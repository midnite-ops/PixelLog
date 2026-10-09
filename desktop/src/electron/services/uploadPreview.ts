import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { API_URL } from "./api.js";

export const uploadPreview = async (previewPath: string) => {
  try {
    const formData = new FormData();

    formData.append("preview", fs.createReadStream(previewPath));

    const response = await axios.post(`${API_URL}/upload-preview`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    console.log(response.data);

    return response.data.url;
  } catch (error) {
    console.error("Failed to upload preview:", error);
    throw error;
  }
};
