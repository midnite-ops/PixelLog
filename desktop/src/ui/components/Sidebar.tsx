import { useState } from "react";
import appLogo from "../assets/PixelLog.png";
import { Activity, Folder, Loader2, Monitor, Settings, Share } from "lucide-react";
function Sidebar() {
  const [activeLink, setActiveLink] = useState("Overview");
  const links = [
    {
      title: "Overview",
      icon: Monitor,
    },
    {
      title: "Uploads",
      icon: Share,
    },
    {
      title: "Activity",
      icon: Activity,
    },
    {
      title: "Folders",
      icon: Folder,
    },
    {
      title: "Settings",
      icon: Settings,
    },
  ];
  return (
    <section className="w-55 py-5 pl-2 border-r border-r-disabledBorder h-full flex flex-col">
      <header className="flex items-start gap-3 border-b-disabledBorder border-b pb-3">
        <img src={appLogo} className="w-8 rounded-lg" />
        <div>
          <p className="font-semibold font-sans">PixelLog</p>
          <p className="uppercase font-extralighter tracking-[0.2em] text-xs text-disabled">
            Desktop
          </p>
        </div>
      </header>

      <ul className="flex gap-5 px-2 pt-5 flex-col flex-1">
        {links.map((link) => (
          <li
            onClick={() => setActiveLink(link.title)}
            className={`${activeLink === link.title ? "text-active bg-[#182439] py-2  rounded-lg" : "bg-none rounded-none text-disabled"} text-sm text-mono cursor-pointer flex items-center gap-2 pl-2`}
          >
            <link.icon className="w-4" />
            <p>{link.title}</p>
          </li>
        ))}
      </ul>

      <div className="border-t border-t-disabledBorder pt-3">
        <div className="text-connected flex items-center  gap-2">
          <div className="size-2 rounded-full bg-connected"></div>
          <p className="text-xs">Connected</p>
        </div>

        <div className="mt-3 flex items-center gap-2">
            <Loader2 className="w-4 text-disabled"/>
            <p className="font-sans text-xs text-disabled ">studio.pixelLog.io</p>
        </div>
      </div>
    </section>
  );
}

export default Sidebar;
