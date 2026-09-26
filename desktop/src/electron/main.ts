import { app, BrowserWindow } from "electron";
import { fork } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { isDev } from "./isDev.js";
import { pathResolver } from "./pathResolver.js";

type test = string;

app.on("ready", () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,

    webPreferences: {
      preload: pathResolver(),
    },
  });

  const watcher = fork(path.join(__dirname, "watcher.js"));

  watcher.on("message", (message) => {
    mainWindow.webContents.send("upload-status", message);
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:8000");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }
});
