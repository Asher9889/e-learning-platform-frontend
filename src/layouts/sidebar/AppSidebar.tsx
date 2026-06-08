import { Link, useLocation } from "react-router-dom";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useAppSelector } from "@/store/hooks";

import { SIDEBAR_ITEMS } from "./sidebar.config";
import type { TUserRole } from "@/constants/user/user.constant";
import AppSidebarHeader from "./AppSidebarHeader";
import AppSidebarFooter from "./AppSidebarFooter";

export function AppSidebar() {
    const location = useLocation();

    const user = useAppSelector(state => state.auth.user);

    if (!user) {
        return null;
    }

    const getSidebarItems = (role: TUserRole) => {
        return SIDEBAR_ITEMS.filter(item => item.roles.includes(role));
    };

    const menus = getSidebarItems(user.role);

    return (
        <Sidebar>
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
            <AppSidebarFooter />
        </Sidebar>
    );
}