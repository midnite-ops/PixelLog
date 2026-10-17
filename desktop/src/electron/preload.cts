import { ipcRenderer } from "electron/renderer"

const electron = require('electron')

electron.contextBridge.exposeInMainWorld('pixelLog', {
    frontendReady: () => {
        ipcRenderer.send('frontend-ready');
    },
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

    getFailedUploads: () => electron.ipcRenderer.invoke("getFailedUploads"),

    getFileInfo: () => electron.ipcRenderer.invoke("getFileInfo"),
})