import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Overview from "./pages/Overview";
import Activity from "./pages/Activity";
import Settings from "./pages/Settings";
import Uploads from "./pages/Uploads";
import type { LogType } from "../../types";
import { saveActivity } from "./utils/loadActivity";
import { saveCompletedUploads } from "./utils/completedUploads";

function App() {
  const [activeLink, setActiveLink] = useState<string>("Overview");
  // const [queuedFiles, setQueuedFiles] = useState<string[]>([]);
  const [failedUploads, setFailedUploads] = useState<LogType[]>([]);
  const [uploadStatus, setUploadStatus] = useState({
    message: "",
    document: {} as LogType,
    queued: [] as LogType[],
    size: "",
    status: "",
  });
  useEffect(() => {
    //@ts-ignore
    window.pixelLog.frontendReady();
    //@ts-ignore
    window.pixelLog.getFailedUploads().then((uploads: any) => {
      setFailedUploads(uploads);
    });

    //@ts-ignore
    window.pixelLog.getActivity((activity: any) => {
      if (activity.event === "") return;
      saveActivity(activity.event, activity.file, activity.id);
    });
    //@ts-ignore
    window.pixelLog.uploadStatus((doc: any) => {
      setUploadStatus(doc);

      const document = doc?.document;
      const event = document?.event?.[0];

      if(doc.status === 'Completed'){
        saveCompletedUploads(doc)
        console.log('yes')
      }else{
        console.log('no')
      }

      if (document && event?.type && event?.id) {
        saveActivity(event.type, document.fileName, event.id);
      }
    });
  }, []);

  //@ts-ignore
  return (
    <section className="bg-primary h-screen overflow-hidden text-white flex">
      <Sidebar currentLink={activeLink} setCurrentLink={setActiveLink} />
      <div className="flex-col items-start h-full flex-1 ">
        <Header activePage={activeLink} />
        <main className="overflow-hidden h-full">
          {activeLink === "Overview" && (
            <Overview failedUploads={failedUploads} uploadFile={uploadStatus} />
          )}
          {activeLink === "Uploads" && (
            <Uploads failedUploads={failedUploads} />
          )}
          {activeLink === "Activity" && <Activity />}
          {activeLink === "Settings" && <Settings />}
        </main>
      </div>
    </section>
  );
}

export default App;
