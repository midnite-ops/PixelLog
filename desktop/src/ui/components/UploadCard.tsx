import type { Upload } from "../../types/upload";

interface UploadCardProps {
    upload: {
        title: string;
        size: string;
        progress: number;
        status?: Upload;
    };
    index: number;
}

function UploadCard({ upload, index }: UploadCardProps){
    return(
        <div key={index} className="flex items-center gap-3">
              <div className={`size-2 rounded-full ${upload.status === 'progress' ? 'bg-active' : upload.status === 'complete' ? 'bg-connected' : upload.status === 'queued' ? 'bg-disabled' : 'bg-red-500/80'}`}></div>
              <div className="w-full">
                <div className=" flex  justify-between">
                  <p className="font-light font-mono text-xs">{upload.title}</p>
                  <p className="text-xs text-disabled font-extralight">
                    {upload.size}
                  </p>
                </div>

                <div className="mt-2">
                  <div className="bg-disabledBorder h-1 rounded-full">
                    <div
                      className="bg-active h-1 rounded-full"
                      style={{ width: `${upload.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="text-xs text-disabled ml-3">
                {upload.progress}%
              </div>
            </div>
    )
}

export default UploadCard