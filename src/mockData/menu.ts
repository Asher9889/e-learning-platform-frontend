import {
  BookOpen,
  Video,
  User,
  LayoutDashboard,
  Settings,
  BarChart3,
  Award,
} from "lucide-react";

export const menus = {
  instructor: [
    { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { title: "My Courses", icon: BookOpen, href: "/courses" },
    { title: "Live Classes", icon: Video, href: "/live-classes" },
    { title: "Students", icon: User, href: "/students" },
    { title: "Analytics", icon: BarChart3, href: "/analytics" },
    { title: "Settings", icon: Settings, href: "/settings" },
  ],

  student: [
    { title: "Dashboard", icon: LayoutDashboard, href: "/student/dashboard" },
    { title: "My Courses", icon: BookOpen, href: "/student/courses" },
    { title: "Live Classes", icon: Video, href: "/student/live-classes" },
    { title: "Progress", icon: BarChart3, href: "/student/progress" },
    { title: "Certificates", icon: Award, href: "/student/certificates" },
    { title: "Profile", icon: User, href: "/student/profile" },
  ],

  admin: [
    { title: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { title: "Users", icon: User, href: "/admin/users" },
    { title: "Settings", icon: Settings, href: "/admin/settings" },
  ],
};

export type UserRole = keyof typeof menus;