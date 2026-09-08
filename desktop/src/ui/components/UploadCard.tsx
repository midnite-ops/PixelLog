import type { Upload } from "../../types/upload";

interface UploadCardProps {
  upload: {
    title: string;
    size: string;
    progress: number;
    status?: Upload;
  };
  index: number;
  isOverview: boolean;
}

function UploadCard({ upload, index, isOverview }: UploadCardProps) {
  return (
    <div key={index} className="flex items-center gap-3">
      <div
        className={`size-2 rounded-full ${upload.status === "Progress" ? "bg-active" : upload.status === "Complete" ? "bg-connected" : upload.status === "Queued" ? "bg-disabled" : "bg-red-500/80"}`}
      ></div>
      <div className="w-full">
        {isOverview && (
          <div className=" flex  justify-between">
            <p className="font-light font-mono text-xs">{upload.title}</p>
            <p className="text-xs text-disabled font-extralight">
              {upload.size}
            </p>
          </div>
        )}

        {!isOverview && (
          <div className="flex justify-between ">
            <p className="font-light font-mono text-xs">{upload.title}</p>

            <div className="text-xs text-disabled ml-3 flex flex-1 justify-end items-center gap-5">
              <p className="font-extralight font-sans  text-white/70 text-xs">{upload.title}</p>
              <p className="text-[10px] text-disabled font-extralight">
                {upload.size}
              </p>

              <p className="ml-5">{upload.status}</p>
            </div>
          </div>
        )}

        <div className="mt-2">
          <div className="bg-disabledBorder h-1 rounded-full">
            <div
              className="bg-active h-1 rounded-full"
              style={{ width: `${upload.progress}%` }}
            ></div>
          </div>
        </div>
      </div>
      {isOverview && (
        <div className="text-xs text-disabled ml-3">
          {isOverview ? `${upload.progress}%` : upload.status}
        </div>
      )}
    </div>
  );
}

export default UploadCard;
