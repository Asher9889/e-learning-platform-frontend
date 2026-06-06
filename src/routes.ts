
/* =========================
   Pages
========================= */
// Pages
import LandingPage from '@/pages/landing';
import Login from '@/pages/login';
import DashboardPage from '@/pages/dashboard';
import LiveClassesPage from '@/pages/live-classes';
import MyCoursesPage from '@/pages/my-courses';

/* =========================
   Route Paths
========================= */
export const PATHS = {
  HOME: "/",
  LOGIN: "/login",

  DASHBOARD: "/dashboard",
  COURSES: "/courses",
  LIVE_CLASSES: "/live-classes",
  SETTINGS: "/settings",
} as const;

/* =========================
   Route Groups
========================= */


 const publicRoutes = [
  {
    path: PATHS.HOME,
    element: LandingPage,
  },
];

 const authRoutes = [
  {
    path: PATHS.LOGIN,
    element: Login,
  },
];

const protectedRoutes = [
  {
    path: PATHS.DASHBOARD,
    element:DashboardPage,
  },
  {
    path: PATHS.COURSES,
    element: MyCoursesPage ,
  },
  {
    path: PATHS.LIVE_CLASSES,
    element: LiveClassesPage ,
  },
];

export default publicRoutes;
export { protectedRoutes, authRoutes };


