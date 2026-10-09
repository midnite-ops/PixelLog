export type Upload = 'Progress' | 'Complete' | 'Queued' | 'Failed';

export interface UploadItem {
  title: string;
  size: string;
  status: Upload;
  message: string
}