import { ipcRenderer } from "electron/renderer"

const electron = require('electron')

electron.contextBridge.exposeInMainWorld('pixelLog', {
    uploadStatus:  (callback: (status:any) => void) => {
        electron.ipcRenderer.on("upload-status", (_:any,data:any) => {
            callback(data)
        })
    },

    getQueuedFiles: (callback: (data:any) => void) => {
        electron.ipcRenderer.on("queuedFiles", (_:any, files:any) => {
            callback(files)
        })
    },

    getFileInfo: () => electron.ipcRenderer.invoke("getFileInfo"),
})