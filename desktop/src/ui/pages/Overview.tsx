import { Clock4, Eye, Share, X } from "lucide-react";
import UploadCard from "../components/UploadCard";
import type { UploadItem } from "../../../types";
import { useState } from "react";
import type { LogType } from "../../../types";
import { useEffect } from "react";
import { getActivity } from "../utils/loadActivity";
import { activityIcon } from "../components/ActivityIcons";
import { activityMessages } from "../utils/activityMessages";

interface OverviewProps {
  failedUploads: LogType[];
  uploadFile: UploadItem; // Replace 'any' with the actual type if available
}

function Overview({ failedUploads, uploadFile }: OverviewProps) {
  const [failedUploadsState, setFailedUploadsState] = useState(failedUploads);
  const [activeUploads, setActiveUploads] = useState(uploadFile);
  const [queuedFiles, setQueuedFiles] = useState<LogType[]>();
  useEffect(() => {
    setFailedUploadsState(failedUploads);
    setActiveUploads(uploadFile);
    setQueuedFiles(uploadFile.queued);
  }, [failedUploads, uploadFile]);
  const activity = getActivity().filter((_, index) => index <= 4);
  const recentActivity = activity.map((event, index) => {
    return (
      <div
        key={index}
        className="flex p-4 border-b border-b-disabledBorder items-center gap-3"
      >
  
          {event.event === 'Export' ? activityIcon.save : event.event === 'Upload Complete' ? activityIcon.share : event.event === 'Upload Failed' ? activityIcon.error : event.event === 'PixelLog Started' ? activityIcon.startUp : event.event === 'Print' ?  activityIcon.save : event.event === 'Save' ? activityIcon.save : ''}
        
        <div>
          <p className="font-sans text-xs mb-1">{activityMessages[event.event] ?? event.event}</p>
          <p className="text-xs text-disabled font-extralight">
            {event.file}
          </p>
        </div>
        <p className="text-xs text-disabled font-extralight ml-auto">
          {event.time}
        </p>
      </div>
    );
  });

  
  const stats = [
    {
      title: "Uploading Now",
      quantity: 1,
      icon: Share,
    },
    {
      title: "Queued",
      quantity: queuedFiles?.length,
      icon: Clock4,
    },
    {
      title: "Errors",
      quantity: failedUploadsState.length,
      icon: X,
    },
  ];
  return (
    <section className="page-spacing no-scrollbar">
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div className="rounded-lg border bg-cardColor border-disabledBorder p-2">
            <div
              className={`${stat.title === "Errors" ? "bg-red-500/20" : "bg-active/20"} inline-block p-1 px-2 rounded-lg`}
            >
              <stat.icon
                className={`${stat.title === "Errors" ? "text-red" : ""}text-active w-4`}
              />
            </div>
            <p className="ml-1">{stat.quantity}</p>
            <p className="text-sm text-disabled font-extralight">
              {stat.title}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="uppercase tracking-[0.2em] text-disabled font-bold font-sans text-[11px]">
          active uploads
        </h3>

        <div className="mt-3 bg-cardColor rounded-lg border border-disabledBorder p-4 flex flex-col gap-5">
          {queuedFiles?.length !== 0 ? (
            queuedFiles?.map((upload, index) => {
              if (upload.documentId === activeUploads.document?.documentId) {
                return (
                  <UploadCard
                    key={index}
                    upload={{
                      document: activeUploads.document,
                      size: activeUploads.size,
                      message: activeUploads.message,
                      status: "Progress",
                    }}
                    index={index}
                    isOverview={true}
                  />
                );
              } else {
                return (
                  <div className="">
                    <UploadCard
                      key={index}
                      upload={{
                        document: upload,
                        size: activeUploads.size,
                        message: "Queued",
                        status: "Queued",
                      }}
                      index={index}
                      isOverview={true}
                    />
                  </div>
                );
              }
            })
          ) : (
            <div className="py-10 flex justify-center ">No Active uploads</div>
          )}
        </div>

        <div className="mt-5 relative">
          <h3 className="uppercase tracking-[0.2em] text-disabled font-bold font-sans text-[11px]">
            Recent Activity
          </h3>

          <div className="mt-3 bg-cardColor rounded-lg border border-disabledBorder  flex flex-col gap-5">
            
            {recentActivity.length === 0 ? <div className="py-10 flex justify-center ">No Recent Activities</div> : recentActivity}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Overview;
