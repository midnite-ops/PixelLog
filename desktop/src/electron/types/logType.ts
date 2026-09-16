export interface LogType{
    documentId: string
    id: string
    fileName: string;
    filePath: string | null
    event: {
        id:string
        type: string,
        date:string
        history: {}
        fileType: string
        previewPath: string
        previewUrl: string
    }[];
}