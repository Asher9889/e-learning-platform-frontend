import { GraduationCap } from "lucide-react";
import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "#components/ui/sidebar";
import { cn } from "#lib/utils";

interface AppSidebarHeaderProps {
    className?: string;
}

const AppSidebarHeader = ({ className }: AppSidebarHeaderProps) => {
    const { state } = useSidebar();

    return (
        <SidebarHeader className={cn("border-b border-sidebar-border/50 h-16", className)}>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton >

                        <GraduationCap className="h-12 w-12" />

                        {/* Brand */}
                        {state === "expanded" &&
                            <div className="flex flex-col gap-0.5 leading-none py-4">
                                <span className="font-semibold tracking-tight text-sidebar-foreground">
                                    E-Learning
                                </span>
                                <span className="text-[11px] font-medium text-sidebar-foreground/60">
                                    Learning Management
                                </span>
                            </div>}
                    </SidebarMenuButton>


                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
    );
};

export default AppSidebarHeader;