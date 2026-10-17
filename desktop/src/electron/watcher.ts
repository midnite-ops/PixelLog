import chokidar, { type FSWatcher } from "chokidar";
import fs from "fs";
import path from "path";
import os from "os";

import { uploadLogs } from "./services/uploadLogs.js";
import { uploadPreview } from "./services/uploadPreview.js";
import { updateLogs } from "./services/updateLogs.js";
import { compareChanges } from "./compareChanges.js";

import { LogType, UploadItem } from "../../types.js";
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
let watcher: FSWatcher | null = null;
let mainWindow: BrowserWindow | null = null;

export function uploadStatus(mainWindow: BrowserWindow) {
  mainWindow.webContents.send("upload-status", syncUploadStatus);
}
export function getQueuedFiles(mainWindow: BrowserWindow) {
  console.log(newFiles, "fiadacadcd");
  mainWindow.webContents.send("queuedFiles", newFiles);
}
export function getFileInfo() {
  return readJson("pixelLog.json")[0];
}

export function getFailedUploads() {
  return readJson("retryQueue.json");
}

function sendUploadStatus() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("upload-status", syncUploadStatus);
  }
}

export function startWatcher(window: BrowserWindow) {
  if (watcher) return;
  mainWindow = window;

  watcher = chokidar.watch([pixelLogPath, previewFolder], {
    persistent: true,
    ignoreInitial: false,
  });

  watcher.on("add", async (filePath: string) => {
    console.log("File added:", filePath);

    if (filePath.startsWith(previewFolder)) {
      newFiles.push(filePath);
      uploadPixelLog();
    }
  });

  watcher.on("change", async (filePath: string) => {
    if (filePath.startsWith(previewFolder)) {
      newFiles.push(filePath);
      uploadPixelLog();
    }
  });
}

// --------------------------------------------------
// PREVIOUS LOGS
// --------------------------------------------------

function writeToPreviousLogs(logs: LogType[]) {
  const previousLogsPath = path.join(pixelLogFolder, "previousLogs.json");

  fs.writeFileSync(previousLogsPath, JSON.stringify(logs, null, 2));
}

// --------------------------------------------------
// READ PIXELLOG
// --------------------------------------------------

function readJson(filePath: string): LogType[] {
  // Read the latest version of pixelLog.json
  const file = path.join(pixelLogFolder, filePath);
  const fileContents = fs.readFileSync(file, "utf8");

  // Convert JSON text into a JavaScript object
  return JSON.parse(fileContents);
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

  const retryQueue = readJson("retryQueue.json");

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
const syncUploadStatus: UploadItem = {
  document: null,
  message: "",
  queued: [],
  status: '',
  size: "",
};

//PROCESS RETRY QUEUE
async function processRetryQueue() {
  const retryQueue = readJson("retryQueue.json");

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

async function uploadPixelLog() {
  console.log("start");
  if (processTimer) {
    clearTimeout(processTimer);
  }
  processTimer = setTimeout(async () => {
    const logs = readJson("pixelLog.json");
    const previousLogs = readJson("previousLogs.json");
    const changedDocuments = compareChanges(previousLogs, logs);
    console.log("Changed Documents:", changedDocuments);

    if (!changedDocuments || changedDocuments.length === 0) {
      console.log("No new changes");
      return;
    }
    syncUploadStatus.queued = changedDocuments 

    for (const document of changedDocuments) {
      try {
        syncUploadStatus.message = "Uploading preview";
        syncUploadStatus.status = 'Progress'
        syncUploadStatus.document = document;
        sendUploadStatus();
        const previewUrl = await uploadPreview(
          document.event[0].previewPath + ".jpg",
        );

        if (!previewUrl) {
          throw new Error("Preview upload returned no URL");
        }
        document.event[0].previewUrl = previewUrl;

        if (previousLogs.length < logs.length) {
          syncUploadStatus.message = "Uploading Logs";
          syncUploadStatus.document = document;
          sendUploadStatus();
          await uploadLogs(document);
          syncUploadStatus.status = 'Completed'
          sendUploadStatus()
        } else {
          updateLogs(document);
        }
      } catch (error) {
        syncUploadStatus.status = "Failed"
        console.error("Upload failed:", document.documentId, error);
        addToRetryQueue(document);
      }
    }
    writeToPreviousLogs(logs);

    console.log("PixelLog processed");
  }, 2000);
}

async function processPixelLog() {
  if (processTimer) {
    clearTimeout(processTimer);
  }

  processTimer = setTimeout(async () => {
    console.log("start");

    try {
      const logs = readJson("pixelLog.json");
      const previousLogs = readJson("previousLogs.json");

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
            syncUploadStatus.message = "Uploading Logs";
            sendUploadStatus();

            await uploadLogs(document);

            syncUploadStatus.message = "Logs uploaded";
            sendUploadStatus();
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

      writeToPreviousLogs(logs);

      console.log("PixelLog processed");
    } catch (error) {
      console.error("PixelLog processing failed:", error);
    }
  }, 2000);
}

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
        sendUploadStatus();

        const previewUrl = await uploadPreview(filePath);

        if (!previewUrl) {
          throw new Error("Preview upload returned no URL");
        }

        syncUploadStatus.message = "Preview uploaded";
        sendUploadStatus();

        event.previewUrl = previewUrl;

        uploaded.push(log);

        console.log("Attached url:", filePath);

        break;
      }
    } catch (error) {
      syncUploadStatus.message = "Preview upload failed";
      sendUploadStatus();
      console.error("Preview upload failed:", filePath);

      if (failedLog) {
        addToRetryQueue(failedLog);
      }
    }
  }

  return uploaded;
}
