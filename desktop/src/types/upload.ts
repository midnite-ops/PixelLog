export type Upload = 'progress' | 'complete' | 'queued' | 'failed';

export interface UploadItem {
  title: string;
  size: string;
  progress: number;
  status: Upload;
}