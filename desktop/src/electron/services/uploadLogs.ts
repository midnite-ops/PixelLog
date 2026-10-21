import axios from "axios";
import { LogType } from "../../../types.js";
import { API_URL } from "./api.js";

export const uploadLogs = async (logs: LogType) => {
  try {
    const response = await axios.post(`${API_URL}/logs`, logs);
    console.log(response.data);
  } catch (error) {
    console.log(error || "error posting logs ");
  }
};
