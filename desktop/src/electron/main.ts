import {app, BrowserWindow} from 'electron';
import path from 'path';
import { isDev } from './utils.js';

type test = string

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height:600,
        minWidth: 800,
        minHeight:600
    })
    if(isDev()){
        mainWindow.loadURL('http://localhost:8000')
    }else{
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'))
    }
    
})