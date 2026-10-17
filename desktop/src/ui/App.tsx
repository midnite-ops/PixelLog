import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Overview from "./pages/Overview";
import Activity from "./pages/Activity";
import Settings from "./pages/Settings";
import Uploads from "./pages/Uploads";
import type { LogType } from "../../types";

function App() {
  const [activeLink, setActiveLink] = useState<string>("Overview");
  // const [queuedFiles, setQueuedFiles] = useState<string[]>([]);
  const [failedUploads, setFailedUploads] = useState<LogType[]>([]);
  const [uploadStatus, setUploadStatus] = useState({
    message: "",
    document: {} as LogType,
    queued: [] as LogType[],
    size: "",
    status: ''
  });
  useEffect(() => {
    //@ts-ignore
    window.pixelLog.frontendReady();
    //@ts-ignore
    window.pixelLog.getFailedUploads().then((uploads: any) => {
      setFailedUploads(uploads);
    });
    //@ts-ignore
    window.pixelLog.uploadStatus((status: any) => {
      console.log("Upload Status:", status);
      setUploadStatus(status);
    });
  },[])
  //@ts-ignore
  return (
    <section className="bg-primary h-screen overflow-hidden text-white flex">
      <Sidebar currentLink={activeLink} setCurrentLink={setActiveLink} />
      <div className="flex-col items-start h-full flex-1 ">
        <Header activePage={activeLink} />
        <main className="overflow-hidden h-full">
          {activeLink === "Overview" && <Overview failedUploads={failedUploads} uploadStatus={uploadStatus} />}
          {activeLink === "Uploads" && <Uploads />}
          {activeLink === "Activity" && <Activity />}
          {activeLink === "Settings" && <Settings />}
        </main>
      </div>
    </section>
  );
}

export default App;
