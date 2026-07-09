import chokidar from 'chokidar';
import fs from 'fs'
import path from 'path';
import os from 'os'
import { uploadService } from '../services/uploadService';

let timer: NodeJS.Timeout

const pixelLogPath = path.join(
    os.homedir(),
    "Documents",
    "PixelLog",
    "pixelLog.json"
)

const watcher = chokidar.watch(pixelLogPath, {
    persistent: true,
    ignoreInitial: false
})



// Created the timer because when chokidar is being updated, it deletes it gets rewritten, removing its old content and writing a new one, and inbetween that interval our code runs and it might throw an error, hence the timer
watcher.on('change', (filepath) => {
    clearTimeout(timer)
    timer = setTimeout(async () => {
        const file = fs.readFileSync(filepath,"utf-8")
        const logs = JSON.parse(file)
        await uploadService(logs)
        console.log(`${filepath} changed`, logs)
    }, 500)
    
}).on('add', (filePath) => {
    clearTimeout(timer)
    const file = fs.readFileSync(filePath, "utf-8")
    timer = setTimeout(() => {
        console.log(`${file} PixelLog created`)
    }, 500)
    
} )