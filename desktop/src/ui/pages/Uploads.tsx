import UploadCard from "../components/UploadCard";
import { useEffect, useState } from "react";
import type { UploadItem, LogType } from "../../../types";
import { getCompletedUploads } from "../utils/completedUploads";
import { LoaderPinwheelIcon } from "lucide-react";

interface UploadProps {
  failedUploads: LogType[];
}
function Uploads({ failedUploads }: UploadProps) {
  const [failed, setFailed] = useState<UploadItem[]>([]);
  const completedUploads = getCompletedUploads();
  useEffect(() => {
    const updateUploads = failedUploads.map((upload) => {
      return {
        document: upload || null,
        size: "",
        status: "Failed",
        message: `Failed to upload ${upload.fileName}`,
      };
    });
    setFailed(updateUploads);
  }, [failedUploads]);
  return (
    <section className="page-spacing no-scrollbar">
      <div className="mt-10">
        <h3 className="subtitle-text">completed</h3>
        <div className="mt-3 bg-cardColor rounded-lg border border-disabledBorder p-4 flex flex-col gap-5">
          {completedUploads.length === 0 ? (
            <div className="flex justify-center">Nothing to see here</div>
          ) : (
            completedUploads.map((upload, index) => (
              <UploadCard
                key={index}
                upload={upload}
                index={index}
                isOverview={false}
              />
            ))
          )}
        </div>
      </div>

      <div className="mt-10">
        <div className="flex justify-between items-center">
          <h3 className="subtitle-text">failed</h3>
          <div className="flex gap-2 items-center bg-disabledBorder py-1 px-2 rounded-lg cursor-pointer">
            <h3 className="subtitle-text">Retry</h3>
            <LoaderPinwheelIcon className="text-disabled w-4 "/>
          </div>
        </div>

        <div className="mt-3 bg-cardColor rounded-lg border border-disabledBorder p-4 flex flex-col gap-5">
          {failed.map((upload, index) => (
            <UploadCard upload={upload} index={index} isOverview={false} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Uploads;
