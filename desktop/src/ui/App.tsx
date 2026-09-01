import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Overview from "./pages/Overview";

function App() {
  const [activeLink, setActiveLink] = useState<string>("Overview");
  return (
    <section className="bg-primary h-screen overflow-hidden text-white flex">
        <Sidebar currentLink={activeLink} setCurrentLink={setActiveLink}/>
      <div className="flex-col items-start h-full flex-1 ">
        <Header activePage={activeLink}/>
        <main className="overflow-hidden h-full">
          {activeLink === 'Overview' && <Overview />}
        </main>
      </div>
    </section>
  );
}

export default App;
