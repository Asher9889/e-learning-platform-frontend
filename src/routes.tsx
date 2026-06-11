import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "@/ProtectedRoute";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import LoginPage from "@/pages/Login";
import HomePage from "@/pages/Home";
import PublicRoute from "@/PublicRoute";
import type { AppRoutes, ChildRoute } from "./types/route.type";
import LiveClassPage from "@/pages/Live-Classes";
import DashboardPage from "@/pages/Dashboard";
import StudentsPage from "@/pages/Student";
import EnrollStudentPage from "@/components/student/EnrollStudentPage";
import TeachersPage from "@/pages/Teacher";
import AddTeacher from "@/components/teacher/AddTeacher";
import ClassesPage from "@/pages/Classes";
import {
  LayoutDashboard,
  BookOpen,
  Video,
  Users,
  ClipboardCheck,
  School,
  GraduationCap,
} from "lucide-react";
import { USER_ROLE } from "@/constants/user/user.constant";
import RouteOutlet from "./routeOutlet";

export const APP_ROUTES: AppRoutes = {
  dashboard: {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    element: DashboardPage,
    showInSidebar: true,
    roles: Object.values(USER_ROLE),
  },

  teachers: {
    title: "Teachers",
    path: "/teachers",
    icon: Users,
    element: RouteOutlet,
    showInSidebar: true,
    roles: [USER_ROLE.ADMIN],
    children: [
      {
        path: undefined,
        element: TeachersPage,
      },
      {
        path: "new",
        element: AddTeacher,
      },
    ],
  },

  courses: {
    title: "Courses",
    path: "/courses",
    icon: BookOpen,
    element: () => <div>Courses</div>,
    showInSidebar: true,
    roles: [USER_ROLE.ADMIN, USER_ROLE.TEACHER, USER_ROLE.STUDENT],
  },

  liveClasses: {
    title: "Live Classes",
    path: "/live-classes",
    icon: Video,
    element: LiveClassPage,
    showInSidebar: true,
    roles: [USER_ROLE.ADMIN, USER_ROLE.TEACHER, USER_ROLE.STUDENT],
  },

  assignments: {
    title: "Assignments",
    path: "/assignments",
    icon: ClipboardCheck,
    element: () => <div>Assignments</div>,
    showInSidebar: true,
    roles: [USER_ROLE.ADMIN, USER_ROLE.TEACHER, USER_ROLE.STUDENT],
  },

  students: {
    title: "Students",
    path: "/student",
    icon: GraduationCap,
    element: RouteOutlet,
    showInSidebar: true,
    roles: [USER_ROLE.ADMIN, USER_ROLE.TEACHER, USER_ROLE.STUDENT],
    children: [
      {
        path: undefined,
        element: StudentsPage,
      },
      {
        path: "add",
        element: EnrollStudentPage,
      },
    ],
  },

  academic: {
    title: "Academics",
    path: "/academic-management",
    icon: School,
    element: ClassesPage,
    showInSidebar: true,
    roles: [USER_ROLE.ADMIN, USER_ROLE.TEACHER, USER_ROLE.STUDENT],
  },
};

const buildChildRoutes = (children: ChildRoute[]) => {
  return children.map((child) => {
    if (child.path === undefined) {
      return {
        index: true as const,
        element: <child.element />,
      };
    }
    return {
      path: child.path,
      element: <child.element />,
    };
  });
};

const protectedChildren = Object.values(APP_ROUTES).map((route) => ({
  path: route.path.replace("/", ""),
  element: <route.element />,
  children:
    route.children && route.children.length > 0
      ? buildChildRoutes(route.children)
      : undefined,
}));

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [{ path: "/login", element: <LoginPage /> }],
  },

  {
    path: "/",
    element: <HomePage />,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AuthenticatedLayout />,
        children: protectedChildren,
      },
    ],
  },
]);