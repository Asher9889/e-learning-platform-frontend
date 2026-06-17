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
import ProgramsPage from "@/pages/Programs";
import BatchesPage from "@/pages/Batches";
import SubjectsPage from "@/pages/Subjects";
import {
  LayoutDashboard,
  BookOpen,
  Video,
  Users,
  ClipboardCheck,
  School,
  GraduationCap,
  Library,
  FolderTree,
  Trash2,
  Layers,
  Book,
} from "lucide-react";
import { USER_ROLE } from "@/constants/user/user.constant";
import RouteOutlet from "./routeOutlet";

import ActiveLiveClassPage from "@/features/live-class/pages/ActiveLiveClassPage";

import DashboardPage from "./pages/Dashboard";
import ContentPage from "./pages/Content";
import UploadMetadataPage from "./pages/Content/UploadMetadata";

export const APP_ROUTES: AppRoutes = {
  dashboard: {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    element: DashboardPage,
    showInSidebar: true,
    roles: Object.values(USER_ROLE),
  },

  // ── Academics ──────────────────────────────────────────
  programs: {
    title: "Programs",
    path: "/programs",
    icon: School,
    element: ProgramsPage,
    showInSidebar: true,
    group: "Academics",
    roles: [USER_ROLE.ADMIN, USER_ROLE.TEACHER, USER_ROLE.STUDENT],
  },

  batches: {
    title: "Batches",
    path: "/batches",
    icon: Layers,
    element: BatchesPage,
    showInSidebar: true,
    group: "Academics",
    roles: [USER_ROLE.ADMIN, USER_ROLE.TEACHER, USER_ROLE.STUDENT],
  },

  subjects: {
    title: "Subjects",
    path: "/subjects",
    icon: Book,
    element: SubjectsPage,
    showInSidebar: true,
    group: "Academics",
    roles: [USER_ROLE.ADMIN, USER_ROLE.TEACHER, USER_ROLE.STUDENT],
  },

  // ── People ─────────────────────────────────────────────
  teachers: {
    title: "Teachers",
    path: "/teachers",
    icon: Users,
    element: RouteOutlet,
    showInSidebar: true,
    group: "People",
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

  students: {
    title: "Students",
    path: "/student",
    icon: GraduationCap,
    element: RouteOutlet,
    showInSidebar: true,
    group: "People",
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

  // ── Teaching ──────────────────────────────────────────
  courses: {
    title: "Courses",
    path: "/courses",
    icon: BookOpen,
    element: () => <div>Courses</div>,
    showInSidebar: true,
    group: "Teaching",
    roles: [USER_ROLE.ADMIN, USER_ROLE.TEACHER, USER_ROLE.STUDENT],
  },

  liveClasses: {
    title: "Live Classes",
    path: "/live-classes",
    icon: Video,
    element: RouteOutlet,
    showInSidebar: true,
    group: "Teaching",
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
    group: "Teaching",
    roles: [USER_ROLE.ADMIN, USER_ROLE.TEACHER, USER_ROLE.STUDENT],
  },

  // ── Learning Content ──────────────────────────────────
  content: {
    title: "Content Library",
    path: "/content",
    icon: Library,
    element: RouteOutlet,
    showInSidebar: true,
    group: "Learning Content",
    roles: [USER_ROLE.ADMIN, USER_ROLE.TEACHER],
    children: [
      { path: undefined, element: ContentPage },
      { path: "upload/metadata", element: UploadMetadataPage },
    ],
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