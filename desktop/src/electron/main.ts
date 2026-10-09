import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { isDev } from "./isDev.js";
import { pathResolver } from "./pathResolver.js";
import { getFileInfo, getQueuedFiles, uploadStatus } from "./watcher.js";


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

  if (isDev()) {
    mainWindow.loadURL("http://localhost:8000");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }

  uploadStatus(mainWindow);
  getQueuedFiles(mainWindow)

  ipcMain.handle("getFileInfo", () => {
    return getFileInfo();
  });
});
