import { LogType } from "../types/logType.js";
import axios from "axios";
import { API_URL } from "./api.js";

export const updateLogs = async (logs: LogType) => {
  try {
    const response = await axios.put(
      `${API_URL}/update-logs/${logs.documentId}`,
      logs,
    );
    console.log(response.data);
  } catch (error) {
    console.log("error updating logs:", error);
  }
};