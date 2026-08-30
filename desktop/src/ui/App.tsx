import { useState } from "react";
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";

function App() {
  const [activeLink, setActiveLink] = useState<string>("Overview");
  return (
    <section className="bg-primary h-screen font-inherit text-white">
      <div className="flex items-start h-full">
        <Sidebar currentLink={activeLink} setCurrentLink={setActiveLink}/>
        <Header activePage={activeLink}/>
        <main>
          <Outlet />
        </main>
      </div>
    </section>
  );
}

export default App;
