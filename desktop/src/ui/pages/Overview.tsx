import { Clock4, Eye, Share, X } from "lucide-react";
import UploadCard from "../components/UploadCard";
import type { UploadItem } from "../../../types";
import { useState } from "react";
import type { LogType } from "../../../types";
import { useEffect } from "react";

interface OverviewProps {
  failedUploads: LogType[];
  uploadStatus: UploadItem; // Replace 'any' with the actual type if available
}

function Overview({ failedUploads, uploadStatus }: OverviewProps) {
  const [failedUploadsState, setFailedUploadsState] = useState(failedUploads);
  const [activeUploads, setActiveUploads] = useState(uploadStatus);
  useEffect(() => {
    setFailedUploadsState(failedUploads);
    setActiveUploads(uploadStatus);
  }, [failedUploads, uploadStatus]);

  const recentActivity = [
    {
      title: "Photoshop save detected",
      file: "CP_reception_0847.psd",
      time: "2 min ago",
      icon: Eye,
      color: "bg-connected/20 text-connected",
    },
    {
      title: "Upload Complete",
      file: "CP_reception_0847.psd",
      time: "2 min ago",
      icon: Share,
      color: "bg-active/20 text-active",
    },
    {
      title: "Photoshop export detected",
      file: "CP_reception_0847.psd",
      time: "2 min ago",
      icon: Eye,
      color: "bg-active/20 text-active",
    },
    {
      title: "Photoshop save detected",
      file: "CP_reception_0847.psd",
      time: "2 min ago",
      icon: Eye,
      color: "bg-active/20 text-active",
    },
    {
      title: "Photoshop save detected",
      file: "CP_reception_0847.psd",
      time: "2 min ago",
      icon: Eye,
      color: "bg-active/20 text-active",
    },
  ];
  const stats = [
    {
      title: "Uploading Now",
      quantity: 1,
      icon: Share,
    },
    {
      title: "Queued",
      quantity: 2,
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
          {activeUploads.queued.length !== 0  ? activeUploads.queued.map((upload, index) => {
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
          }) : <div className="py-10 justify-center ">No Actvive uploads</div> }
        </div>

        <div className="mt-5">
          <h3 className="uppercase tracking-[0.2em] text-disabled font-bold font-sans text-[11px]">
            Recent Activity
          </h3>

          <div className="mt-3 bg-cardColor rounded-lg border border-disabledBorder  flex flex-col gap-5">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex p-4 border-b border-b-disabledBorder items-center gap-3"
              >
                <div
                  className={`${activity.color} inline-block p-1 px-2 rounded-lg`}
                >
                  <activity.icon className="w-4" />
                </div>
                <div>
                  <p className="font-sans text-xs mb-1">{activity.title}</p>
                  <p className="text-xs text-disabled font-extralight">
                    {activity.file}
                  </p>
                </div>
                <p className="text-xs text-disabled font-extralight ml-auto">
                  {activity.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Overview;
