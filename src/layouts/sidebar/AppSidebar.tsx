import { Link, useLocation } from "react-router-dom";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useAppSelector } from "@/store/hooks";
// import { APP_ROUTES } from "@/routes/appRoutes";
// import { APP_ROUTES } from "./sidebar.config";
import type { TUserRole } from "@/constants/user/user.constant";
import AppSidebarHeader from "./AppSidebarHeader";
import AppSidebarFooter from "./AppSidebarFooter";
import { useLogout } from "./hooks/useLogout";
import { APP_ROUTES } from "@/routes";

export function AppSidebar() {
    const location = useLocation();

    const user = useAppSelector(state => state.auth.user);
    const mutation = useLogout();

    const handleLogout = () => {
        mutation.mutate();
    }

    if (!user) {
        console.log("AppSidebar returning null because user is falsy");
        return null;
    }
  const getSidebarItems = (role: TUserRole) => {
    return Object.values(APP_ROUTES).filter(item =>
        item.roles.includes(role)
    );
};

    const menus = getSidebarItems(user?.role);



    return (
        <Sidebar collapsible="icon">
            <AppSidebarHeader />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menus.map(menu => {
                                const isActive = location.pathname === menu.path;
                                return (
                                    <SidebarMenuItem key={menu.path}>
                                        <SidebarMenuButton asChild isActive={isActive}>
                                            <Link to={menu.path}>
                                                <menu.icon />
                                                <span>
                                                    {menu.title}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            {/* Footer */}
            <AppSidebarFooter logout={handleLogout} />
        </Sidebar>
    );
}