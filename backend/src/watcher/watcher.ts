import express from 'express';
import chokidar from "chokidar";
import fs from "fs";
import path from "path";
import os from "os";
import { uploadService } from "../services/uploadService";
import { LogType } from '../types/logType';
import { compareChanges } from './compareChanges';

let timer: NodeJS.Timeout;

const pixelLogFolder = path.join(os.homedir(), "Documents", "PixelLog");

const previewFolder = path.join(pixelLogFolder, "preview");

const pixelLogPath = path.join(pixelLogFolder, "pixelLog.json");

const watcher = chokidar.watch([pixelLogPath, previewFolder], {
  persistent: true,
  ignoreInitial: false,
});
let previousLogs:LogType[] = [];


previousLogs = JSON.parse(fs.readFileSync(pixelLogPath, 'utf-8'))

// Created the timer because when a file is being updated, it's deleted and gets rewritten, removing its old content and writing a new one, and inbetween that interval the code runs and it might throw an error, hence the timer

// DIRECTORY CREATED
watcher.on("addDir", (dirPath) => {
  console.log("Directory detected:", dirPath);

  if (dirPath === previewFolder) {
    console.log("Preview folder is available");
  }
});

//FILE CREATED
watcher.on("add", async (filePath) => {
  console.log("File added:", filePath);

  // pixelLog.json was created
  if (filePath === pixelLogPath) {
    clearTimeout(timer);

    timer = setTimeout(async () => {
      try {
        const file = fs.readFileSync(filePath, "utf-8");

        const logs = JSON.parse(file);

        await uploadService(logs);

        console.log("PixelLog updated:", filePath, file);

      } catch (error) {
        console.error("Failed to process PixelLog:", error);
      }
    }, 500);
    console.log("PixelLog JSON Updated");

    return;
  }

  

  // A preview was created
  if (filePath.startsWith(previewFolder)) {
    console.log("New preview detected:", filePath);

    try {
      const preview = fs.readFileSync(filePath);

      // Later:
      // await uploadPreview(filePath, preview);

      console.log("Preview read successfully");
    } catch (error) {
      console.error("Failed to read preview:", error);
    }
  }
});

// ------------------------------------
// FILE CHANGED
// ------------------------------------

watcher.on("change", (filePath) => {
  // Only process pixelLog.json here
  if (filePath !== pixelLogPath) {
    return;
  }

  clearTimeout(timer);

  timer = setTimeout(async () => {
    try {
      const file = fs.readFileSync(filePath, "utf-8");

      const logs: LogType[] = JSON.parse(file);
      
        await uploadService(compareChanges(previousLogs, logs))
      previousLogs = logs
    } catch (error) {
      console.error("Failed to process PixelLog:", error);
    }
  }, 500);
});
