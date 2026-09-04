import { useState } from "react";
function Settings() {
  const [enableEvent, setEnableEvent] = useState<boolean>(true);
  const [desktopNotifications, setDesktopNotifications] = useState<boolean>(true);
  const [launchAtLogin, setLaunchAtLogin] = useState<boolean>(true);
  return (
    <section className="page-spacing no-scrollbar">
      <div className="w-full lg:w-3/4">
        <div>
          <h3 className="uppercase tracking-[0.2em] text-disabled font-bold font-sans text-[11px]">
            Connection
          </h3>

          <div className="mt-5 bg-cardColor py-4 px-5 rounded-lg border border-disabledBorder flex flex-col gap-5">
            <div className="flex items-center justify-between gap-3 border-b border-disabledBorder pb-5">
              <div>
                <p className="text-sm font-sans mb-1">Dashboard Endpoint</p>
                <p className="text-xs text-disabled font-extralight">
                  Sync target for all uploads and metadata
                </p>
              </div>
              <div className="text-xs text-active bg-active/20 font-extralight font-mono p-2 rounded-lg cursor-pointer">
                studio.pixellog.io
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-sans mb-1">Webhook on Save</p>
                <p className="text-xs text-disabled font-extralight">
                  Notify dashboard on Photoshop save
                </p>
              </div>
              <button
                onClick={() => setEnableEvent(!enableEvent)}
                className={`relative h-7 w-15 rounded-full transition-all duration-300 ${enableEvent ? "bg-active" : "bg-white/10"}`}
              >
                <span
                  className={` absolute top-1 right-9 size-5 rounded-full bg-white transition-all duration-300 ${enableEvent ? "translate-x-8" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>



        <div className="mt-10">
          <h3 className="uppercase tracking-[0.2em] text-disabled font-bold font-sans text-[11px]">
            System
          </h3>
          <div className="mt-5 bg-cardColor py-4 px-5 rounded-lg border border-disabledBorder flex flex-col gap-5">
            
            <div className="flex items-center justify-between gap-3 border-b border-disabledBorder pb-5">
              <div>
                <p className="text-sm font-sans mb-1">Desktop Notifications</p>
                <p className="text-xs text-disabled font-extralight">
                  System alerts for uploads and errors
                </p>
              </div>
              <button
                onClick={() => setDesktopNotifications(!desktopNotifications)}
                className={`relative h-7 w-15 rounded-full transition-all duration-300 ${desktopNotifications ? "bg-active" : "bg-white/10"}`}
              >
                <span
                  className={` absolute top-1 right-9 size-5 rounded-full bg-white transition-all duration-300 ${desktopNotifications ? "translate-x-8" : ""}`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 border-b border-disabledBorder pb-5">
              <div>
                <p className="text-sm font-sans mb-1">Launch at Login</p>
                <p className="text-xs text-disabled font-extralight">
                  Start PixelLog Desktop when you log in
                </p>
              </div>
              <button
                onClick={() => setLaunchAtLogin(!launchAtLogin)}
                className={`relative h-7 w-15 rounded-full transition-all duration-300 ${launchAtLogin ? "bg-active" : "bg-white/10"}`}
              >
                <span
                  className={` absolute top-1 right-9 size-5 rounded-full bg-white transition-all duration-300 ${launchAtLogin ? "translate-x-8" : ""}`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-sans mb-1">Version</p>
                <p className="text-xs text-disabled font-extralight">
                  PixelLog Desktop
                </p>
              </div>
              <div className="text-xs font-extralight text-disabled font-mono p-2">
                v1.0.0
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Settings;
