export {};

declare global {
  interface Window {
    pixelLog: {
      uploadStatus: (
        callback: (data: {
          type: string;
          file: string;
          queuedFiles: []
        }) => void
      ) => void;
    };
  }
}