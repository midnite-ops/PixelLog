import { ipcRenderer } from "electron/renderer"
import { Activity, UploadItem } from "../../types";

const electron = require('electron')

electron.contextBridge.exposeInMainWorld('pixelLog', {
    frontendReady: () => {
        ipcRenderer.send('frontend-ready');
    },
    uploadStatus:  (callback: (status:any) => void) => {
        electron.ipcRenderer.on("upload-status", (_:any,data:UploadItem) => {
            callback(data)
        })
    },
    

    getActivity: (callback: (data:any) => void) => {
        electron.ipcRenderer.on("get-activity", (_:any, activity:Activity) => {
            callback(activity)
        })
    },

    getFailedUploads: () => electron.ipcRenderer.invoke("getFailedUploads"),

    getFileInfo: () => electron.ipcRenderer.invoke("getFileInfo"),
})