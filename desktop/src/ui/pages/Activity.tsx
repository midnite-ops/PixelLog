import { Eye, Share,  X, Zap } from "lucide-react";

function Activity() {
    const activity = [
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
          title: "Error uploading file",
          file: "CP_reception_0847.psd",
          time: "2 min ago",
          icon: X,
          color: "bg-red-500/20 text-red-100",
        },
        {
          title: "Photoshop save detected",
          file: "CP_reception_0847.psd",
          time: "2 min ago",
          icon: Eye,
          color: "bg-active/20 text-active",
        },
        {
          title: "PixelLog Desktop started",
          file: "v1.0.0 . Watching 2 folders",
          time: "2 min ago",
          icon: Zap,
          color: "bg-[#fbbf24]/20 text-[#fbbf24]",
        },
      ];
    return (
        <section className= 'page-spacing no-scrollbar'>
            <div className="bg-cardColor rounded-lg border border-disabledBorder  flex flex-col gap-3">
                {activity.map((act, index) => (
                    <div className={`flex items-center gap-4 pt-3 px-3 pb-4 ${index === activity.length - 1 ? "" : "border-b border-disabledBorder"}`}>
                        <div className={`size-7 rounded-md flex items-center justify-center ${act.color}`}>
                            <act.icon className="w-4"/>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm">{act.title}</p>
                            <p className="text-xs text-disabled font-mono">{act.file}</p>
                        </div>
                        <p className="text-xs text-disabled ml-auto">{act.time}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Activity;