import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { isDev } from "./isDev.js";
import { pathResolver } from "./pathResolver.js";
import { getFileInfo, getQueuedFiles, uploadStatus, startWatcher, getFailedUploads } from "./watcher.js";


app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,

    webPreferences: {
      preload: pathResolver(),
    },
  });

   ipcMain.once("frontend-ready", () => {
    console.log("Frontend is ready, starting watcher and sending upload status...");
    startWatcher(mainWindow);
    uploadStatus(mainWindow);
    getQueuedFiles(mainWindow);
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:8000");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }

  ipcMain.handle("getFailedUploads", () => {
    return getFailedUploads();
  });
 

  ipcMain.handle("getFileInfo", () => {
    return getFileInfo();
  });
});
