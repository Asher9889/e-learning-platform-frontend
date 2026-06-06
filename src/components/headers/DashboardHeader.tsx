import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, Search } from "lucide-react";

import { SidebarTrigger } from "../ui/sidebar";
import ThemeToggle from "../toggle/ThemeToggle";
import { Input } from "../ui/input";
import { useLogout } from "@/hooks/useLogout";

export const DashboardHeader = () => {
   const handleLogout = useLogout();
  return (
    <>
      <header className="sticky top-0  border-b px-4 py-3 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
        </div>
        {/* Brand */}
        {/* <h2 className="font-bold text-xl text-blue-600">E-LEARNING</h2> */}

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1.5 w-64">
          <Search className="w-4 h-4 text-gray-500" />
          <Input className="bg-transparent border-none !focus-visible:outline-none !focus-visible:ring-0 outline-none ml-2 text-sm w-full" placeholder="Search courses..." />
        </div>

        {/* Profile & Notifications */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AS</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      {/* <Sidebar role="student" setIsMobileOpen={setIsMobileOpen} isMobileOpen={isMobileOpen}/> */}
    </>
  );
};