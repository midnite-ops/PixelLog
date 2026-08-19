export interface LogType{
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

/**
 * 
 * {
        "fileName": "DSC_7648-Recovered.JPG",
        "filePath": null,
        "event": [
            {
                "type": "Export",
                "date": "Tue Aug 11 2026 00:06:45 GMT+0100",
                "history": {

                },
                "fileType": "jpg",
                "previewPath": "/Users/mac/Documents/PixelLog/previews/DSC_7648-Recovered copy"
            }
        ]
    }
 */