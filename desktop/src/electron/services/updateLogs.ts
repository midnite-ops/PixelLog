import { LogType } from "../types/logType";
import axios from "axios";

export const updateLogs = async (logs: LogType) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/pixelLog/update-logs/${logs.documentId}`,
      logs,
    );
    console.log(response.data);
  } catch (error) {
    console.log("error updating logs:", error);
  }
};