import { Outlet } from "react-router-dom";

import { SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "./sidebar/AppSidebar";
import AppHeader from "./header/AppHeader";

export default function AuthenticatedLayout() {
  return (
    <SidebarProvider>

      <AppSidebar />

      <main className="flex-1">
        <AppHeader  />
        <Outlet />
      </main>

    </SidebarProvider>
  );
}