import { v2 as cloudinary } from "cloudinary";
import "../config/env";

cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

export const uploadPreview = async (preview: string) => {

    const result = await cloudinary.uploader.upload(preview, {
      folder: "pixelLog/previews",
    });
  

  return result.secure_url
};
