// import {
//   LayoutDashboard,
//   BookOpen,
//   Video,
//   Users,
//   ClipboardCheck,
//   School,
//   GraduationCap,
// } from "lucide-react";

// import { USER_ROLE } from "@/constants/user/user.constant";

// export const SIDEBAR_ITEMS = [
//   {
//     title: "Dashboard",
//     path: "/dashboard",
//     icon: LayoutDashboard,
//     roles: Object.values(USER_ROLE),
//   },

//   {
//     title: "Teachers",
//     path: "/teachers",
//     icon: Users,
//     roles: [USER_ROLE.ADMIN],
//   },

//   {
//     title: "Courses",
//     path: "/courses",
//     icon: BookOpen,
//     roles: [
//       USER_ROLE.ADMIN,
//       USER_ROLE.TEACHER,
//       USER_ROLE.STUDENT,
//     ],
//   },

//   {
//     title: "Live Classes",
//     path: "/live-classes",
//     icon: Video,
//     roles: [
//       USER_ROLE.ADMIN,
//       USER_ROLE.TEACHER,
//       USER_ROLE.STUDENT,
//     ],
//   },

//   {
//     title: "Assignments",
//     path: "/assignments",
//     icon: ClipboardCheck,
//     roles: [
//       USER_ROLE.ADMIN,
//       USER_ROLE.TEACHER,
//       USER_ROLE.STUDENT,
//     ],
//   },
//   {
//     title: "Student",
//     path: "/student",
//     icon: GraduationCap,
//     roles: [
//       USER_ROLE.ADMIN,
//       USER_ROLE.TEACHER,
//       USER_ROLE.STUDENT,
//     ],
//   },
//   {
//     title: "Academic Management",
//     path: "/academic-management",
//     icon: School,
//     roles: [
//       USER_ROLE.ADMIN,
//       USER_ROLE.TEACHER,
//       USER_ROLE.STUDENT,
//     ],
//   },
// ];

// import {
//   LayoutDashboard,
//   BookOpen,
//   Video,
//   Users,
//   ClipboardCheck,
//   School,
//   GraduationCap,
// } from "lucide-react";

// import { USER_ROLE } from "@/constants/user/user.constant";

// export const APP_ROUTES = {
//   dashboard: {
//     title: "Dashboard",
//     path: "/dashboard",
//     icon: LayoutDashboard,
//     roles: Object.values(USER_ROLE),
//   },

//   teachers: {
//     title: "Teachers",
//     path: "/teachers",
//     icon: Users,
//     roles: [USER_ROLE.ADMIN],
//   },

//   courses: {
//     title: "Courses",
//     path: "/courses",
//     icon: BookOpen,
//     roles: [USER_ROLE.ADMIN, USER_ROLE.TEACHER, USER_ROLE.STUDENT],
//   },

//   liveClasses: {
//     title: "Live Classes",
//     path: "/live-classes",
//     icon: Video,
//     roles: [USER_ROLE.ADMIN, USER_ROLE.TEACHER, USER_ROLE.STUDENT],
//   },

//   assignments: {
//     title: "Assignments",
//     path: "/assignments",
//     icon: ClipboardCheck,
//     roles: [USER_ROLE.ADMIN, USER_ROLE.TEACHER, USER_ROLE.STUDENT],
//   },

//   students: {
//     title: "Students",
//     path: "/student",
//     icon: GraduationCap,
//     roles: [USER_ROLE.ADMIN, USER_ROLE.TEACHER, USER_ROLE.STUDENT],
//   },

//   academic: {
//     title: "Academics",
//     path: "/academic-management",
//     icon: School,
//     roles: [USER_ROLE.ADMIN, USER_ROLE.TEACHER, USER_ROLE.STUDENT],
//   },
// } as const;