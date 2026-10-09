import {  useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Overview from "./pages/Overview";
import Activity from "./pages/Activity";
import Settings from "./pages/Settings";
import Uploads from "./pages/Uploads";

function App() {
  //@ts-ignore
  window.pixelLog.uploadStatus(data => console.log({data}, ))
  //@ts-ignore
  window.pixelLog.getQueuedFiles((newFiles) => console.log(newFiles))
    console.log("App.tsx mounted");
  //@ts-ignore
  window.pixelLog.test()
  
  const [activeLink, setActiveLink] = useState<string>("Overview");
  return (
    <section className="bg-primary h-screen overflow-hidden text-white flex">
        <Sidebar currentLink={activeLink} setCurrentLink={setActiveLink}/>
      <div className="flex-col items-start h-full flex-1 ">
        <Header activePage={activeLink}/>
        <main className="overflow-hidden h-full">
          {activeLink === 'Overview' && <Overview />}
          {activeLink === 'Uploads' && <Uploads />}
          {activeLink === 'Activity' && <Activity />}
          {activeLink === 'Settings' && <Settings />}
        </main>
      </div>
    </section>
  );
}

export default App;
