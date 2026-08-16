import axios from "axios";
import { LogType } from "../types/logType";

export const uploadService = async (logs: LogType) => {
    try {
        const response = await axios.post('http://localhost:3000/pixelLog/logs', logs)
        console.log(response.data)
    } catch (error) {
        console.log(error || 'error posting logs ')
    }
    
}