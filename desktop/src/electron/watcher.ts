import chokidar from "chokidar";
import fs from "fs";
import path from "path";
import os from "os";

import { uploadLogs } from "./services/uploadLogs.js";
import { uploadPreview } from "./services/uploadPreview.js";
import { updateLogs } from "./services/updateLogs.js";
import { compareChanges } from "./compareChanges.js";

import { LogType } from "./types/logType.js";
import { BrowserWindow } from "electron";

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

function readLogs(): LogType[] {
  // Read the latest version of pixelLog.json
  const file = fs.readFileSync(pixelLogPath, "utf8");

  // Convert JSON text into a JavaScript object
  return JSON.parse(file);
}

function readRetryQueue(): LogType[] {
  const retryQueue = path.join(pixelLogFolder, "retryQueue.json");
  const file = fs.readFileSync(retryQueue, "utf8");

  return JSON.parse(file);
}
// Read the current retryQueue file and overwrite it with the new updated data
function deleteFromRetryQueue(doc: LogType) {
  const retryQueue = path.join(pixelLogFolder, "retryQueue.json");
  const file = JSON.parse(fs.readFileSync(retryQueue, "utf8"));
  file.logs = file.logs.filter((log: string) => log !== doc.documentId);

  fs.writeFileSync(retryQueue, JSON.stringify(file, null, 2));
}

function addToRetryQueue(doc: LogType) {
  const retryQueuePath = path.join(pixelLogFolder, "retryQueue.json");

  const retryQueue = readRetryQueue();

  const index = retryQueue.findIndex(
    (log) => log.documentId === doc.documentId,
  );

  if (index !== -1) {
    retryQueue[index] = doc;
  } else {
    retryQueue.push(doc);
  }

  fs.writeFileSync(retryQueuePath, JSON.stringify(retryQueue, null, 2));
}

let newFiles: string[] = [];
const syncUploadStatus: {failed: string[], message:string, file:string, queued: string, completed:string} = {
  message: "",
  file: "",
  queued: "",
  completed: "",
  failed: [],
};

export function uploadStatus(mainWindow: BrowserWindow) {
   mainWindow.webContents.send("upload-status", syncUploadStatus);
}
export function getQueuedFiles(mainWindow: BrowserWindow){
   mainWindow.webContents.send("queuedFiles", ['fish'])
}
export function getFileInfo() {
  return readLogs()[0];
}

// --------------------------------------------------
// ATTACH CLOUDINARY URLS TO EVENTS
// --------------------------------------------------

async function uploadPreviewDoc(logs: LogType[]): Promise<LogType[]> {
  const uploaded: LogType[] = [];
  const updatedFiles = newFiles.map((file) => {
    const extension = path.extname(file);

    return file.slice(0, -extension.length) + extension.toLowerCase();
  });
  for (const filePath of updatedFiles) {
    let failedLog: LogType | undefined;

    try {
      for (const log of logs) {
        const event = log.event.find(
          (event) => event.previewPath + ".jpg" === filePath,
        );

        if (!event) {
          continue;
        }
        console.log("yes", event.previewPath);

        failedLog = log;
        syncUploadStatus.message = "Uploading preview";
        const previewUrl = await uploadPreview(filePath);

        if (!previewUrl) {
          throw new Error("Preview upload returned no URL");
        }

        event.previewUrl = previewUrl;

        uploaded.push(log);

        console.log("Attached url:", filePath);

        break;
      }
    } catch (error) {
      syncUploadStatus.failed.push(filePath)
      console.error("Preview upload failed:", filePath);

      if (failedLog) {
        addToRetryQueue(failedLog);
      }
    }
  }

  return uploaded;
}

//PROCESS RETRY QUEUE
async function processRetryQueue() {
  const retryQueue = readRetryQueue();

  for (const log of retryQueue) {
    try {
      const event = log.event[0];

      if (!event.previewUrl) {
        const preview = await uploadPreview(event.previewPath);

        if (!preview) {
          throw new Error("Preview upload returned no URL");
        }

        event.previewUrl = preview;
      }
      await uploadLogs(log);

      deleteFromRetryQueue(log);

      console.log("Retry successful:", log.documentId);
    } catch (error) {
      console.error("Retry failed:", log.documentId, error);
    }
  }
}
// --------------------------------------------------
// PROCESS PIXELLOG
// --------------------------------------------------

async function processPixelLog() {
  if (processTimer) {
    clearTimeout(processTimer);
  }

  processTimer = setTimeout(async () => {
    console.log("start");

    try {
      const logs = readLogs();

      const changedDocuments = compareChanges(previousLogs, logs);

      if (!changedDocuments || changedDocuments.length === 0) {
        console.log("No new changes");
        return;
      }

      const uploadedLogs = await uploadPreviewDoc(changedDocuments);

      newFiles = [];

      if (previousLogs.length < logs.length) {
        for (const document of uploadedLogs) {
          try {
            syncUploadStatus.message = "Uploading Logs"
            await uploadLogs(document);
          } catch (error) {
            console.error(
              "Database upload failed:",
              document.documentId,
              error,
            );

            addToRetryQueue(document);
          }
        }
      } else {
        try {
          await updateLogs(uploadedLogs[0]);
        } catch (error) {
          console.error(
            "Database update failed:",
            uploadedLogs[0].documentId,
            error,
          );

          addToRetryQueue(uploadedLogs[0]);
        }
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
