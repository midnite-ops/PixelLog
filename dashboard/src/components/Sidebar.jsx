import { useState } from "react";

export default function Sidebar({menu, onclick}) {
    
  return (
    <aside className="w-70 h-screen bg-gray-900 text-white p-5 flex flex-col gap-4 col-span-1 fixed left-0 ">
      <h1 className="text-2xl font-bold mb-6">PixelLog</h1>

      <nav className="flex flex-col gap-2">
        {menu.map((item) => (
          <a
            key={item.name}
            onClick={() => {onclick(item.name)}}
            className="p-2 rounded hover:bg-gray-700 cursor-pointer"
          >
            {item.name}
          </a>
        ))}
      </nav>
    </aside>
  );
}
