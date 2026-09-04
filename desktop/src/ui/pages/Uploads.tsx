import UploadCard from "../components/UploadCard";
import type { UploadItem } from "../../types/upload";
function Uploads() {
  const current: UploadItem = {
    title: "test.png",
    size: "2.5MB",
    status: 'progress',
    progress: 50,
  };

  const failedUploads: UploadItem = {
    title: "test-100.png",
    size: "2.5MB",
    status: "failed",
    progress: 50,
  };

  const queuedUploads: UploadItem[] = [
    {
      title: "test.png",
      size: "2.5MB",
      status: "queued",
      progress: 50,
    },
    {
      title: "test.png",
      size: "2.5MB",
      status: "queued",
      progress: 50,
    },
    {
      title: "test.png",
      size: "2.5MB",
      status: "queued",
      progress: 50,
    },
  ];

  const completedUploads: UploadItem[] = [
    {
      title: "test.png",
      size: "2.5MB",
      status: "complete",
      progress: 100,
    },
    {
      title: "test.png",
      size: "2.5MB",
      status: "complete",
      progress: 100,
    },
    {
      title: "test.png",
      size: "2.5MB",
      status: "complete",
      progress: 100,
    },
  ];
  return (
    <section className="page-spacing no-scrollbar">
      <div>
        <h3 className="subtitle-text">in progress</h3>
        <div className="mt-3 bg-cardColor rounded-lg border border-disabledBorder p-4 flex flex-col gap-5">
          <UploadCard upload={current} index={0} />
        </div>
      </div>

        <div className="mt-10">
            <h3 className="subtitle-text">queued</h3>
            <div className="mt-3 bg-cardColor rounded-lg border border-disabledBorder p-4 flex flex-col gap-5">
            {queuedUploads.map((upload, index) => (
                <UploadCard key={index} upload={upload} index={index} />
            ))}
            </div>
        </div>

        <div className="mt-10">
            <h3 className="subtitle-text">completed</h3>
            <div className="mt-3 bg-cardColor rounded-lg border border-disabledBorder p-4 flex flex-col gap-5">
            {completedUploads.map((upload, index) => (
                <UploadCard key={index} upload={upload} index={index} />
            ))}
            </div>
        </div>

        <div className="mt-10">
            <h3 className="subtitle-text">failed</h3>
            <div className="mt-3 bg-cardColor rounded-lg border border-disabledBorder p-4 flex flex-col gap-5">
                <UploadCard upload={failedUploads} index={0} />
            </div>
        </div>
    </section>
  );
}


export default Uploads;
