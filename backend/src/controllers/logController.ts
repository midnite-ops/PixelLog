import cloudinary from "../services/cloudinary";
import { Response, Request } from "express";
import File from "../models/File";
import { UploadApiResponse } from "cloudinary";

export async function sendLogs(req: Request, res: Response) {
  console.log(req.body);
  try {
    const newFile = new File(req.body);

    await newFile.save();

    res.status(201).json({ message: "New log created successfully" });
  } catch (error) {
    console.error("error in the sendLogs controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateLogs(req: Request, res: Response) {
  try {
    const log = req.body;
    console.log("incoming Id", log.documentId);
    const existingLog = await File.findOne({
      documentId: log.documentId,
    });

    console.log("Existing log:", existingLog);
    const updatedLog = await File.findOneAndReplace(
      { documentId: log.documentId },
      log,
      { new: true },
    );

    if (!updatedLog) {
      return res.status(404).json({
        message: "Log not found",
      });
    }

    return res.status(200).json({
      message: "Log updated successfully",
      log: updatedLog,
    });
  } catch (error) {
    console.error("error in the updateLogs controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function uploadPreview(req: Request, res: Response) {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "No preview uploaded",
      });
    }

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "pixellog/previews",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (!result) {
            reject(new Error("Cloudinary did not return a result"));
          } else {
            resolve(result);
          }
        },
      );

      stream.end(file.buffer);
    });

    res.json({
      message: "Preview uploaded successfully",
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);

    res.status(500).json({
      message: "Preview upload failed",
    });
  }
}
