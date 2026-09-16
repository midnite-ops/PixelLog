export type Upload = 'Progress' | 'Complete' | 'Queued' | 'Failed';

export interface UploadItem {
  title: string;
  size: string;
  progress: number;
  status: Upload;
}