import express from 'express';
import { sendLogs, updateLogs, uploadPreview } from '../controllers/logController';
import { upload } from '../middleware/upload';

const routes = express.Router()

routes.post('/logs', sendLogs)
routes.put('/update-logs/:id', updateLogs)
routes.post(
  "/upload-preview",
  upload.single("preview"),
  (req, res, next) => {
    console.log("MULTER ROUTE HIT");
    console.log("FILE:", req.file?.originalname);
    console.log("SIZE:", req.file?.size);

    next();
  },
  uploadPreview,
);


export default routes