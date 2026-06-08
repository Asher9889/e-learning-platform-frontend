import { Outlet } from "react-router-dom";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AppSidebar } from "./sidebar/AppSidebar";

export default function AuthenticatedLayout() {
  return (
    <SidebarProvider>

      <AppSidebar />

      <main className="flex-1">
        <SidebarTrigger />
        <Outlet />
      </main>

    </SidebarProvider>
  );
}