import { Link, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useAppSelector } from "@/store/hooks";
import type { TUserRole } from "@/constants/user/user.constant";
import type { AppRoute } from "@/types/route.type";
import AppSidebarHeader from "./AppSidebarHeader";
import AppSidebarFooter from "./AppSidebarFooter";
import { useLogout } from "./hooks/useLogout";
import { APP_ROUTES } from "@/routes";

interface SidebarSection {
  label: string | null;
  items: AppRoute[];
}

export function AppSidebar() {
  const location = useLocation();
  const user = useAppSelector(state => state.auth.user);
  const mutation = useLogout();

  const handleLogout = () => {
    mutation.mutate();
  };

  if (!user) {
    return null;
  }

  const allRoutes = Object.values(APP_ROUTES).filter(
    (item) => item.showInSidebar && item.roles.includes(user.role as TUserRole)
  );

  const SECTION_ORDER = ["Academics", "People", "Teaching", "Learning Content"];

  const sections: SidebarSection[] = [];
  const grouped: Record<string, AppRoute[]> = {};
  const ungrouped: AppRoute[] = [];

  for (const route of allRoutes) {
    if (route.group) {
      if (!grouped[route.group]) grouped[route.group] = [];
      grouped[route.group].push(route);
    } else {
      ungrouped.push(route);
    }
  }

  if (ungrouped.length > 0) {
    sections.push({ label: null, items: ungrouped });
  }

  const sortedGroupLabels = Object.keys(grouped).sort(
    (a, b) => SECTION_ORDER.indexOf(a) - SECTION_ORDER.indexOf(b)
  );

  for (const label of sortedGroupLabels) {
    sections.push({ label, items: grouped[label] });
  }

  return (
    <Sidebar collapsible="icon">
      <AppSidebarHeader />
      <SidebarContent>
        {sections.map((section) => (
          <SidebarGroup key={section.label ?? "__main"}>
            {section.label && <SidebarGroupLabel>{section.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((menu) => {
                  const isActive = location.pathname === menu.path;
                  return (
                    <SidebarMenuItem key={menu.path}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={menu.title}>
                        <Link to={menu.path}>
                          <menu.icon />
                          <span>{menu.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <AppSidebarFooter logout={handleLogout} />
    </Sidebar>
  );
}
