import {
  Sidebar, SidebarInset, SidebarProvider, SidebarContent, SidebarGroup,
  SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton,
  SidebarGroupLabel, SidebarHeader, SidebarRail, 
  SidebarFooter
} from "../ui/sidebar";
import { LayoutDashboard, UserCircle2Icon } from "lucide-react";
import { TooltipProvider } from "../ui/tooltip";
import { Link, useLocation } from "react-router-dom";
import { menus } from "@/mockData/menu";
import { useSelector } from "react-redux";
import type { UserRole } from "@/types/user.types";
import { DashboardHeader } from "../headers/DashboardHeader";


export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
 const user = useSelector((state: any) => state.auth);
 const isAuthenticated = user?.isAuthenticated;
  const role: UserRole | null = isAuthenticated ? user?.user?.role : null;
  // const role: UserRole | null = 'teacher'
 console.log(user,"user",isAuthenticated,"isAuthenticated",role,"role")
  const location = useLocation();
  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        {/* Sidebar Section */}
        <Sidebar collapsible="icon" variant="sidebar">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2 font-bold text-blue-600">
              <LayoutDashboard className="size-6" />
              <span className="truncate group-data-[collapsible=icon]:hidden">
                E-LEARNING
              </span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {role && menus[role]?.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.href}
                        tooltip={item.title}
                      >
                        <Link to={item.href} >
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
          <SidebarFooter>
            <div className="flex items-center gap-3 p-2">
              <UserCircle2Icon  className="h-5 w-5 shrink-0"/>
              <div className="truncate group-data-[collapsible=icon]:hidden">
                <p>{user?.user?.username}</p>
                <p className="text-xs">{user?.user?.role}</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content Area */}
        <SidebarInset className="transition-[margin] duration-300 ease-in-out">
          {/* <header className="flex h-14 items-center gap-2 px-4 border-b">
            <SidebarTrigger />
            <div className="text-sm font-medium text-gray-500">Dashboard</div>
          </header> */}
          <DashboardHeader />
          <main className="p-6">
            {children}
          </main>

        </SidebarInset>

      </SidebarProvider>
    </TooltipProvider>
  );
};