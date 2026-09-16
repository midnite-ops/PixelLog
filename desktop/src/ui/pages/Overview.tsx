import { Clock4, Eye, Share, X } from "lucide-react";
import UploadCard from "../components/UploadCard";
import type { UploadItem } from "../../electron/types/upload";

function Overview() {
  const activeUploads: UploadItem[] = [
    {
      title: "CP_reception_0847.psd",
      size: "1.2 MB",
      progress: 50,
      status: "Progress",
    },
    {
      title: "File 1",
      size: "500 MB",
      progress: 50,
      status: "Progress",
    },
    {
      title: "CP_portraits_0214.psd",
      size: "1.2 MB",
      progress: 50,
      status: "Progress",
    },
  ];
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
      quantity: 1,
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
            <p>{stat.quantity}</p>
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
          {activeUploads.map((upload, index) => (
            <UploadCard
              key={index}
              upload={upload}
              index={index}
              isOverview={true}
            />
          ))}
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
