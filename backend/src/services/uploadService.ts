import axios from "axios";

export const uploadService = async (logs: any) => {
    try {
        const response = await axios.post('http://localhost:3000/pixelLog/logs', logs)
        console.log(response.data)
    } catch (error) {
        console.log(error || 'error posting logs ')
    }
    
}