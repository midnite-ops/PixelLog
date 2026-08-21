import chokidar from "chokidar";
import fs from "fs";
import path from "path";
import os from "os";

import { uploadService } from "../services/uploadService";
import { uploadPreview } from "../services/uploadPreview";
import { updateLogs } from "../services/updateLogs";
import { compareChanges } from "./compareChanges";

import { LogType } from "../types/logType";

// Used to delay processing of pixelLog.json.
// This prevents multiple file events from triggering
// the processing function too quickly.
let timer: NodeJS.Timeout | undefined;

// --------------------------------------------------
// PIXELLOG PATHS
// --------------------------------------------------

// Main PixelLog folder
const pixelLogFolder = path.join(os.homedir(), "Documents", "PixelLog");

// Folder where preview images are stored
const previewFolder = path.join(pixelLogFolder, "previews");

// Path to the main PixelLog JSON file
const pixelLogPath = path.join(pixelLogFolder, "pixelLog.json");

// --------------------------------------------------
// FILE WATCHER
// --------------------------------------------------

// Watch both:
// 1. pixelLog.json
// 2. everything inside the previews folder
const watcher = chokidar.watch([pixelLogPath, previewFolder], {
  persistent: true,

  // Detect files that already exist when
  // the watcher starts.
  ignoreInitial: false,
});

// --------------------------------------------------
// PREVIOUS LOGS
// --------------------------------------------------

// Read the current PixelLog when the watcher starts.
//
// This gives us a baseline that we can later compare
// against when pixelLog.json changes.
let previousLogs: LogType[] = [];

// --------------------------------------------------
// PREVIEW CACHE
// --------------------------------------------------

/**
 * Temporarily stores uploaded preview URLs.
 *
 * Example:
 *
 * preview-123
 *      ↓
 * https://res.cloudinary.com/...
 *
 * The key is the preview filename WITHOUT
 * the file extension.
 */
const previewCache = new Map<string, string>();

// --------------------------------------------------
// READ PIXELLOG
// --------------------------------------------------

function readLogs(): LogType[] {
  // Read the latest version of pixelLog.json
  const file = fs.readFileSync(pixelLogPath, "utf8");

  // Convert JSON text into a JavaScript object
  return JSON.parse(file);
}

// --------------------------------------------------
// GET PREVIEW KEY
// --------------------------------------------------

function getPreviewKey(previewPath: string): string {
  /**
   * Converts:
   *
   * /PixelLog/previews/preview-123.jpg
   *
   * into:
   *
   * preview-123
   *
   * Keeping this logic in one function makes sure
   * the cache uses the same key everywhere.
   */
  return path.basename(previewPath, path.extname(previewPath));
}

// --------------------------------------------------
// ATTACH CLOUDINARY URLS TO EVENTS
// --------------------------------------------------

function attachPreviewUrls(logs: LogType[]) {
  // Loop through every log
  logs.forEach((log) => {
    // Loop through every event in that log
    log.event.forEach((event) => {
      // Make sure this event actually has
      // a preview path
      if (!event.previewPath) return;

      // Get the same key that we used when
      // storing the uploaded preview
      const key = getPreviewKey(event.previewPath);

      // Look for the Cloudinary URL
      // inside our temporary cache
      const previewUrl = previewCache.get(key);

      // If the preview hasn't been uploaded yet,
      // leave the event unchanged.
      if (!previewUrl) return;

      // Attach the Cloudinary URL to the event
      event.previewUrl = previewUrl;

      // We no longer need this cached URL
      // because it has now been attached.
      previewCache.delete(key);

      console.log(`Preview URL attached: ${key}`);
    });
  });
}

// --------------------------------------------------
// PROCESS PIXELLOG
// --------------------------------------------------

async function processPixelLog() {
  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(async () => {
    try {
      const logs = readLogs();

      attachPreviewUrls(logs);
      const changedDocument = compareChanges(previousLogs, logs);

      if(!changedDocument){
        console.log('No new changes');
        return
      }

      if(previousLogs.length < logs.length){
        console.log('upload')
        await uploadService(changedDocument)
      }else{
        console.log('change')
        await updateLogs(changedDocument)
      }


      previousLogs = logs;

      console.log("PixelLog processed");
    } catch (error) {
      console.error("PixelLog processing failed:", error);
    }
  }, 500);
}

// --------------------------------------------------
// SCHEDULE PIXELLOG PROCESSING
// --------------------------------------------------

// function schedulePixelLogProcessing() {
//   /**
//    * Cancel the previous timer.
//    *
//    * For example, if Photoshop changes the file
//    * several times within 500ms, we don't want to
//    * process the file multiple times.
//    */
//   clearTimeout(timer);

//   /**
//    * Wait 500ms before processing the log.
//    */
//   timer = setTimeout(processPixelLog, 500);
// }

// --------------------------------------------------
// UPLOAD PREVIEW
// --------------------------------------------------

async function handlePreview(filePath: string) {
  try {
    console.log("Processing preview:", filePath);

    // Read the image from disk
    const preview = fs.readFileSync(filePath);

    /**
     * Convert the image to Base64.
     *
     * Example:
     *
     * preview.jpg
     *      ↓
     * Base64
     *      ↓
     * data:image/jpeg;base64,...
     */
    const base64Preview = `data:image/jpeg;base64,${preview.toString(
      "base64",
    )}`;

    // Upload the preview to Cloudinary
    const previewUrl = await uploadPreview(base64Preview);

    // Get the filename without extension
    //
    // preview-123.jpg
    //      ↓
    // preview-123
    const key = getPreviewKey(filePath);

    // Store the Cloudinary URL temporarily
    // so attachPreviewUrls() can find it.
    previewCache.set(key, previewUrl);

    console.log(`Preview uploaded: ${key}`);

    /**
     * Process the PixelLog after the preview
     * has successfully been uploaded.
     *
     * This is important because the JSON event
     * may already exist before the preview upload
     * finishes.
     */
    processPixelLog()
  } catch (error) {
    console.error("Preview upload failed:", error);
  }
}

// --------------------------------------------------
// FILE CREATED
// --------------------------------------------------

watcher.on("add", async (filePath) => {
  console.log("File added:", filePath);

  // ----------------------------------------------
  // PREVIEW CREATED
  // ----------------------------------------------

  if (filePath.startsWith(previewFolder)) {
    console.log('preview added')
    await handlePreview(filePath);
  }

  // ----------------------------------------------
  // PIXELLOG.JSON CREATED
  // ----------------------------------------------

  // if (filePath === pixelLogPath) {
  //   /**
  //    * Wait 500ms before processing the log.
  //    */
  //   console.log('pixelLog Added')
  //   processPixelLog();

  //   return;
  // }
});

// --------------------------------------------------
// FILE CHANGED
// --------------------------------------------------

watcher.on("change", async (filePath) => {
  console.log("File changed:", filePath);

  // ----------------------------------------------
  // PIXELLOG.JSON CHANGED
  // ----------------------------------------------
  //The pixelLog.json file is added first, so i need to wait for the preview folder to load so i can attach the previewUrl to the event before sending it to the logs so i'll execute processPixelLog in handlepreview
  // if (filePath === pixelLogPath) {
  //   /**
  //    * pixelLog.json changed.
  //    *
  //    * Wait 500ms before processing it.
  //    */
  //   processPixelLog();

  //   return;
  // }

  // ----------------------------------------------
  // PREVIEW CHANGED
  // ----------------------------------------------

  if (filePath.startsWith(previewFolder)) {
    /**
     * A preview already exists but its contents
     * have changed.
     *
     * Upload the new version to Cloudinary.
     */
    await handlePreview(filePath);
  }
});
