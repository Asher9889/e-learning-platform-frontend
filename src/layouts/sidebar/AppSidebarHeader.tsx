import { BookOpen, GraduationCap } from "lucide-react";
import { SidebarHeader, SidebarMenu, SidebarMenuItem } from "#components/ui/sidebar";
import { cn } from "#lib/utils";

interface AppSidebarHeaderProps {
  className?: string;
}

const AppSidebarHeader = ({ className }: AppSidebarHeaderProps) => {
  return (
    <SidebarHeader className={cn("border-b border-sidebar-border/50", className)}>
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-3 px-2 py-3">
            {/* Logo Icon */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            
            {/* Brand */}
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-semibold tracking-tight text-sidebar-foreground">
                E-Learning
              </span>
              <span className="text-[11px] font-medium text-sidebar-foreground/60">
                Learning Management
              </span>
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};

export default AppSidebarHeader;