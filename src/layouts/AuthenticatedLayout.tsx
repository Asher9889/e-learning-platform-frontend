import { Outlet, useLocation } from "react-router-dom";

import { SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "./sidebar/AppSidebar";
import AppHeader from "./header/AppHeader";
import { UploadManager } from "@/features/upload/components/UploadManager";
import { useEffect } from "react";

export default function AuthenticatedLayout() {
  const { pathname } = useLocation();
  const isClassRoomPage = /^\/live-classes\/[^/]+\/class-room$/.test(pathname);
   useEffect(() => {
  const id = setInterval(() => {
    if (document.body.style.pointerEvents === "none") {
      document.body.style.pointerEvents = "";
    }
  }, 200);
  return () => clearInterval(id);
}, []);
  return (
    <SidebarProvider>
      {!isClassRoomPage && <AppSidebar />}

      <div className="flex min-w-0 flex-1 flex-col">
        {!isClassRoomPage && <AppHeader />}

        <main className="min-w-0 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      <UploadManager />
    </SidebarProvider>
  );
}
