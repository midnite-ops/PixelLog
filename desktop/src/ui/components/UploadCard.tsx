import { Loader } from "lucide-react";
import type { Upload } from "../../../types.d.ts";
import type { LogType } from "../../../types.d.ts";

interface UploadCardProps {
  upload: {
    document: LogType | null;
    size: string;
    message: string;
    status: Upload;
  };
  index: number;
  isOverview: boolean;
}

function UploadCard({ upload, index, isOverview }: UploadCardProps) {
  return (
    <div
      key={index}
      className={`flex items-center gap-3 ${isOverview ? "border-b border-disabledBorder last:border-b-0 pb-5 " : ""}`}
    >
      <div
        className={`size-2 rounded-full ${upload.status === "Progress" ? "bg-active" : upload.status === "Complete" ? "bg-connected" : upload.status === "Queued" ? "bg-disabled" : "bg-red-500/80"}`}
      ></div>
      <div className="w-full">
        <div className="flex justify-between ">
          <p className="font-light font-mono text-xs">
            {upload.document?.fileName}
          </p>

          <div className="text-xs text-disabled ml-3 flex flex-1 justify-end items-center ">
            <p className="text-[10px] text-disabled font-extralight">
              {upload.size}
            </p>
          </div>
        </div>

        <div className="mt-2">
          <div className=" flex items-center gap-2  text-disabled text-sm">
            {upload.message} 
            { 'from' + upload.document?.filePath}
            {upload.status === "Progress" && (
              <Loader
                size={20}
                className="animate-spin transition-all duration-200"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadCard;
