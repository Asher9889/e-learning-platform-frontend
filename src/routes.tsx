import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "@/ProtectedRoute";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import LoginPage from "@/pages/Login";
import HomePage from "@/pages/Home";
import PublicRoute from "@/PublicRoute";
import type { AppRoutes, ChildRoute } from "./types/route.type";
import LiveClassPage from "@/pages/Live-Classes";
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
  Library,
  Upload,
  FolderTree,
  Trash2,
} from "lucide-react";
import { USER_ROLE } from "@/constants/user/user.constant";
import RouteOutlet from "./routeOutlet";

import ActiveLiveClassPage from "@/features/live-class/pages/ActiveLiveClassPage";

import DashboardPage from "./pages/dashboard";
import ContentPage from "./pages/Content";
import UploadContentPage from "./pages/Content/UploadContent";

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

  // liveClasses: {
  //   title: "Live Classes",
  //   path: "/live-classes",
  //   icon: Video,
  //   element: LiveClassPage,
  //   showInSidebar: true,
  //   roles: [USER_ROLE.ADMIN, USER_ROLE.TEACHER, USER_ROLE.STUDENT],
  //   children: [
  //     {
  //       path: ":roomName/class-room",
  //       element: () => <div className="bg-red-600">Live Class Room</div>,
  //     }
  //   ]
  // },

  liveClasses: {
    title: "Live Classes",
    path: "/live-classes",
    icon: Video,
    element: RouteOutlet,
    showInSidebar: true,
    roles: [USER_ROLE.ADMIN, USER_ROLE.TEACHER, USER_ROLE.STUDENT],
    children: [
       {
        path: undefined,
        element: LiveClassPage,
      },
      {
        path: ":roomName/class-room",
        element: ActiveLiveClassPage,
      }
    ]
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

  content: {
    title: "Content Library",
    path: "/content",
    icon: Library,
    element: ContentPage,
    showInSidebar: true,
    group: "Learning Content",
    roles: [USER_ROLE.ADMIN, USER_ROLE.TEACHER],
  },

  uploadContent: {
    title: "Upload Content",
    path: "/content/upload",
    icon: Upload,
    element: UploadContentPage,
    showInSidebar: true,
    group: "Learning Content",
    roles: [USER_ROLE.ADMIN, USER_ROLE.TEACHER],
  },

  contentCategories: {
    title: "Categories",
    path: "/content/categories",
    icon: FolderTree,
    element: () => <div className="p-6"><h1 className="text-2xl font-bold">Categories</h1></div>,
    showInSidebar: true,
    group: "Learning Content",
    roles: [USER_ROLE.ADMIN, USER_ROLE.TEACHER],
  },

  contentTrash: {
    title: "Trash",
    path: "/content/trash",
    icon: Trash2,
    element: () => <div className="p-6"><h1 className="text-2xl font-bold">Trash</h1></div>,
    showInSidebar: true,
    group: "Learning Content",
    roles: [USER_ROLE.ADMIN, USER_ROLE.TEACHER],
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