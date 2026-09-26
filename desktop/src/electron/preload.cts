import { ipcRenderer } from "electron"

const electron = require('electron')

electron.contextBridge.exposeInMainWorld('pixelLog', {
    uploadStatus:  (callback: (data:any) => void) => {
        ipcRenderer.on("upload-status", (_,data) => {
            callback(data)
        })
    }
})