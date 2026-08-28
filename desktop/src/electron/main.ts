import {app, BrowserWindow} from 'electron';
import path from 'path';

type test = string

app.on("ready", () => {
    const mainWindow = new BrowserWindow({})
    mainWindow.loadURL('http://localhost:8000')
})