import UploadCard from "../components/UploadCard";
import type { UploadItem } from "../../electron/types/upload";
function Uploads() {
  const current: UploadItem = {
    title: "test.png",
    size: "2.5MB",
    status: "Progress",
    progress: 50,
  };

  const failedUploads: UploadItem = {
    title: "test-100.png",
    size: "2.5MB",
    status: "Failed",
    progress: 50,
  };

  const queuedUploads: UploadItem[] = [
    {
      title: "test.png",
      size: "2.5MB",
      status: "Queued",
      progress: 50,
    },
    {
      title: "test.png",
      size: "2.5MB",
      status: "Queued",
      progress: 50,
    },
    {
      title: "test.png",
      size: "2.5MB",
      status: "Queued",
      progress: 50,
    },
  ];

  const completedUploads: UploadItem[] = [
    {
      title: "test.png",
      size: "2.5MB",
      status: "Complete",
      progress: 100,
    },
    {
      title: "test.png",
      size: "2.5MB",
      status: "Complete",
      progress: 100,
    },
    {
      title: "test.png",
      size: "2.5MB",
      status: "Complete",
      progress: 100,
    },
  ];
  return (
    <section className="page-spacing no-scrollbar">
      <div>
        <h3 className="subtitle-text">in progress</h3>
        <div className="mt-3 bg-cardColor rounded-lg border border-disabledBorder p-4 flex flex-col gap-5">
          <UploadCard upload={current} index={0} isOverview={false} />
        </div>
      </div>

      <div className="mt-10">
        <h3 className="subtitle-text">queued</h3>
        <div className="mt-3 bg-cardColor rounded-lg border border-disabledBorder p-4 flex flex-col gap-5">
          {queuedUploads.map((upload, index) => (
            <UploadCard
              key={index}
              upload={upload}
              index={index}
              isOverview={false}
            />
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h3 className="subtitle-text">completed</h3>
        <div className="mt-3 bg-cardColor rounded-lg border border-disabledBorder p-4 flex flex-col gap-5">
          {completedUploads.map((upload, index) => (
            <UploadCard
              key={index}
              upload={upload}
              index={index}
              isOverview={false}
            />
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h3 className="subtitle-text">failed</h3>
        <div className="mt-3 bg-cardColor rounded-lg border border-disabledBorder p-4 flex flex-col gap-5">
          <UploadCard upload={failedUploads} index={0} isOverview={false} />
        </div>
      </div>
    </section>
  );
}

export default Uploads;
