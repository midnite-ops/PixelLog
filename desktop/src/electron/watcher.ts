import chokidar from "chokidar";
import fs from "fs";
import path from "path";
import os from "os";

import { uploadService } from "./services/uploadService.js";
import { uploadPreview } from "./services/uploadPreview.js";
import { updateLogs } from "./services/updateLogs.js";
import { compareChanges } from "./compareChanges.js";

import { LogType } from "./types/logType.js";

// Used to delay processing of pixelLog.json.
// This prevents multiple file events from triggering
// the processing function too quickly.
let processTimer: NodeJS.Timeout | undefined;

// --------------------------------------------------
// PIXELLOG PATHS
// --------------------------------------------------

// Main PixelLog folder
const pixelLogFolder = path.join(os.homedir(), "Documents", "PixelLog");

// Folder where preview images are stored
const previewFolder = path.join(pixelLogFolder, "previews");

// Path to the main PixelLog JSON file
const pixelLogPath = path.join(pixelLogFolder, "pixelLog.json");

const failedPreviewFolder = path.join(pixelLogFolder, "failed-previews")

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
// READ PIXELLOG
// --------------------------------------------------
async function moveFailedPreview(filePath: string) {
  try {
    await fs.promises.mkdir(failedPreviewFolder, {
      recursive: true,
    });

    const fileName = path.basename(filePath);

    const failedPath = path.join(
      failedPreviewFolder,
      fileName
    );

    await fs.promises.rename(
      filePath,
      failedPath
    );

    console.log("Moved failed preview:", failedPath);
  } catch (error) {
    console.error(
      "Failed to move preview:",
      error
    );
  }
}

function readLogs(): LogType[] {
  // Read the latest version of pixelLog.json
  const file = fs.readFileSync(pixelLogPath, "utf8");

  // Convert JSON text into a JavaScript object
  return JSON.parse(file);
}

const logs = readLogs();

let newFiles: string[] = [];

// --------------------------------------------------
// ATTACH CLOUDINARY URLS TO EVENTS
// --------------------------------------------------

async function uploadPreviewDoc(logs: LogType[]): Promise<LogType[]> {
  const uploaded:LogType[] = []
  for (const filePath of newFiles) {
    try {
      for (const log of logs) {
        const event = log.event.find(
          (event) => event.previewPath + ".jpg" === filePath
        );

        if (!event) {
          continue;
        }

        const previewUrl = await uploadPreview(filePath);

        if (!previewUrl) {
          throw new Error("Preview upload returned no URL");
        }

        event.previewUrl = previewUrl;

        uploaded.push(log)

        console.log("Attached url:", filePath);

        break;
      }
    } catch (error) {
      console.error("Preview upload failed:", filePath);

      await moveFailedPreview(filePath);
    }
  }
  return uploaded
}

// --------------------------------------------------
// PROCESS PIXELLOG
// --------------------------------------------------

async function processPixelLog() {
  if (processTimer) {
    clearTimeout(processTimer);
  }

  processTimer = setTimeout(async () => {
    console.log('start')
    try {
      const logs = readLogs();

      const changedDocuments = compareChanges(previousLogs, logs);

      if (!changedDocuments || changedDocuments.length === 0) {
        console.log("No new changes");
        return;
      }

      const uploadedLogs = await uploadPreviewDoc(changedDocuments);

      newFiles = []

      if (previousLogs.length < logs.length) {
        console.log("upload");
        for (const document of uploadedLogs) {
          await uploadService(document);
        }
      } else {
        console.log("change");
        await updateLogs(uploadedLogs[0]);
      }

      previousLogs = logs;

      console.log("PixelLog processed");
    } catch (error) {
      console.error("PixelLog processing failed:", error);
    }
  }, 2000);
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
    console.log("preview added");
    newFiles.push(filePath);
    processPixelLog();
  }
});

// --------------------------------------------------
// FILE CHANGED
// --------------------------------------------------

watcher.on("change", async (filePath) => {
  if (filePath.startsWith(previewFolder)) {
    /**
     * A preview already exists but its contents
     * have changed.
     *
     * Upload the new version to Cloudinary.
     */
    processPixelLog();
  }
});
