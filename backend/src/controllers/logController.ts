import { Response, Request } from "express";
import File from "../models/File";



export async function sendLogs(req: Request, res: Response) {
    console.log(req.body)
  try {

    const newFile = new File(req.body);

    await newFile.save();
    console.log(newFile);

    res.status(201).json({ message: "New log created successfully" });
  } catch (error) {
    console.error("error in the sendLogs controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// export async function updateLogs(req: Request, res: Response){
//   try {
//     const update = File.findByIdAndUpdate()
//   } catch (error) {
    
//   }
// }
