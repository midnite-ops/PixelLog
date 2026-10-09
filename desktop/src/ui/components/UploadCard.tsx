import { Loader } from "lucide-react";
import type { Upload } from "../../electron/types/upload";

interface UploadCardProps {
  upload: {
    title: string;
    size: string;
    message: string;
    status?: Upload;
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
          <p className="font-light font-mono text-xs">{upload.title}</p>

          <div className="text-xs text-disabled ml-3 flex flex-1 justify-end items-center ">
            <p className="text-[10px] text-disabled font-extralight">
              {upload.size}
            </p>
          </div>
        </div>

        <div className="mt-2">
          <div className=" flex items-center gap-2  text-disabled text-sm">
            {upload.message} from
            /Users/Documents/Previews/CP_reception_0847.jpg
            <Loader size={15} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadCard;
