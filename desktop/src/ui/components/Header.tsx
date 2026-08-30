import { Bell, Link } from "lucide-react";

interface HeaderProps{
    activePage: string
}

function Header({activePage} : HeaderProps) {
  return (
    <section className="flex justify-between items-center w-full h-auto pt-5 px-5 border-b border-b-disabledBorder pb-3">
      <div>
        <p>{activePage}</p>
      </div>

      <div className="flex items-center gap-2">
        <button className="border border-disabledBorder flex gap-2 items-center rounded-lg text-xs py-1 px-3 cursor-pointer">
          <Link className="w-3"/>
          Open Dashboard
        </button>
        <button className="border border-disabledBorder p-1 px-2 rounded-lg cursor-pointer">
          <Bell className="text-disabled w-5"/>
        </button>
      </div>
    </section>
  );
}

export default Header
