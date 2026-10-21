type uploadStatus = {
    uploading: string;
    file: string;
    queued: string;
    completed: string;
    failed: string;
}

export interface LogType{
    documentId: string
    id: string
    fileName: string;
    filePath: string | null
    event: {
        id:string
        type: ActivityType,
        date:string
        history: {}
        fileType: string
        previewPath: string
        previewUrl: string
    }[];
}

export type Upload = 'Progress' | 'Complete' | 'Queued' | 'Failed';

export interface UploadItem {
  document: LogType | null
  size: string;
  status: Upload | string;
  message: string
  queued: LogType[]
}

export type ActivityType =
  | "Save"
  | "Export"
  | "Print"
  | "Upload Complete"
  | "Upload Failed"
  | "PixelLog Started";

export type Activity = {
  id: string;
  event: ActivityType;
  file?: string;
  time: string;
};