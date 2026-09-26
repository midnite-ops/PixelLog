import { app } from "electron";
import path from "path";
import { isDev } from "./isDev.js";

export function pathResolver() {
  return path.join(
    app.getAppPath(),
    isDev() ? "." : "..",
    "dist-electron/preload.cjs",
  );
}
