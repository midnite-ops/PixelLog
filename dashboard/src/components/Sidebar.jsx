import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Sidebar() {
  const menu = [
    { name: "Dashboard", path: "/" },
    { name: "Files", path: "/files" },
    { name: "Activity", path: "/activity" },
    { name: "Settings", path: "/settings" },
  ];
  // const location = useLocation().pathname()

  return (
    <aside className="w-60 h-screen bg-gray-900 text-white p-5 flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-6">PixelLog</h1>

      <nav className="flex flex-col gap-2">
        {menu.map((item) => (
          <a
            key={item.name}
            to={item.path}
            className="p-2 rounded hover:bg-gray-700 cursor-pointer"
          >
            {item.name}
          </a>
        ))}
      </nav>
    </aside>
  );
}
