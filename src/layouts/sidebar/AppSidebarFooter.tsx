import { 
  LogOut, 
  Settings, 
  Shield, 
  ChevronUp,
  User,
} from "lucide-react";
import { 
  SidebarFooter, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "#components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "#lib/utils";
import { useAppSelector } from "@/store/hooks";

interface AppSidebarFooterProps {
  className?: string;
  logout: () => void;
}

const AppSidebarFooter = ({ className, logout }: AppSidebarFooterProps) => {


  // const user = {
  //   name: "Alex Morgan",
  //   email: "alex.morgan@university.edu",
  //   avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
  //   role: "Student",
  //   // plan: "Pro"
  // };
 const user = useAppSelector(
        (state) => state?.auth?.user
    );
  return (
    <SidebarFooter className={cn("border-t border-sidebar-border/50 p-0", className)}>
    
      {/* User Profile Dropdown */}
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton 
                size="lg" 
                className="p-2  h-auto min-h-[3.5rem] gap-3 rounded-none border border-transparent px-3 py-2.5 transition-all hover:border-sidebar-border hover:bg-sidebar-accent data-[state=open]:border-sidebar-border data-[state=open]:bg-sidebar-accent group-data-[collapsible=icon]:!size-12
    group-data-[collapsible=icon]:justify-center
    group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:!w-full" 
              >
                <Avatar className="h-9 w-9 rounded-full border-2 border-sidebar-border/30">
                  <AvatarImage src={user?.personalInfo?.profileImage} alt={user?.personalInfo?.name} />
                  {!user?.personalInfo?.profileImage && <AvatarFallback className="rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">
                    {user?.personalInfo?.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>}
                </Avatar>
                
                <div className="flex flex-1 flex-col items-start gap-0.5 overflow-hidden text-left group-data-[collapsible=icon]:hidden">
                  <div className="flex w-full items-center gap-2">
                    <span className="truncate text-sm font-semibold text-sidebar-foreground">
                      {user?.personalInfo?.name}
                    </span>
                    <ChevronUp className="ml-auto h-4 w-4 shrink-0 text-sidebar-foreground/50 transition-transform group-data-[state=open]:-rotate-180" />
                  </div>
                  <span className="truncate text-xs text-sidebar-foreground/60">
                    {user?.email}
                  </span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent 
              side="top" 
              align="start" 
              className="w-[--radix-popper-anchor-width] min-w-[240px] rounded-xl border-border/50 bg-popover p-2 mx-2 shadow-lg"
            >
              {/* User Info Header */}
              <div className="mb-2 flex items-center gap-3 rounded-t-md bg-muted/50 p-3">
                <Avatar className="h-10 w-10 rounded-none">
                  <AvatarImage src={user?.personalInfo?.profileImage} alt={user?.personalInfo?.name} />
                  <AvatarFallback className="rounded-full bg-primary text-primary-foreground">
                    {user?.personalInfo?.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold">{user?.personalInfo?.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-medium">
                      {user?.role}
                    </Badge>
                    {/* <Badge className="h-5 gap-1 bg-gradient-to-r from-amber-500 to-orange-500 px-1.5 text-[10px] font-medium text-white hover:from-amber-600 hover:to-orange-600">
                      <Sparkles className="h-3 w-3" />
                      {user.plan}
                    </Badge> */}
                  </div>
                </div>
              </div>

              <DropdownMenuSeparator className="my-1.5" />

              {/* Account Actions */}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Account
                </DropdownMenuLabel>
                
                <DropdownMenuItem className="gap-2.5 rounded-lg px-2 py-2 text-sm cursor-pointer">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Profile
                </DropdownMenuItem>
                
                {/* <DropdownMenuItem className="gap-2.5 rounded-lg px-2 py-2 text-sm cursor-pointer">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  Billing & Plans
                </DropdownMenuItem> */}
                
                <DropdownMenuItem className="gap-2.5 rounded-lg px-2 py-2 text-sm cursor-pointer">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  Security
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-1.5" />

              {/* Preferences */}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Preferences
                </DropdownMenuLabel>
                
                <DropdownMenuItem className="gap-2.5 rounded-lg px-2 py-2 text-sm cursor-pointer">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Preferences
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-1.5" />

              {/* Logout */}
              <DropdownMenuItem 
                onClick={logout}
                className="gap-2.5 rounded-lg px-2 py-2.5 text-sm font-medium text-destructive focus:text-destructive cursor-pointer focus:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};

export default AppSidebarFooter;