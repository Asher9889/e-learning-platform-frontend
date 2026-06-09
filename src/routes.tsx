import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import TeacherLiveClassPage from "@/components/live-classes";
import LoginPage from "@/pages/Login";

import HomePage from "./pages/Home";
import DashboardPage from "./pages/Dashboard";
import PublicRoute from "./PublicRoute";
import StudentsPage from "./pages/Student";
import EnrollStudentPage from "#components/student/EnrollStudentPage";
import TeachersPage from "./pages/Teacher";
import AddTeacher from "#components/teacher/AddTeacher";
// import DashboardPage from "@/pages/dashboard/DashboardPage";
// import CoursesPage from "@/pages/courses/CoursesPage";
// import ClassesPage from "@/pages/classes/ClassesPage";
// import AssignmentsPage from "@/pages/assignments/AssignmentsPage";
// import RecordingsPage from "@/pages/recordings/RecordingsPage";
// import ProfilePage from "@/pages/profile/ProfilePage";

export const router = createBrowserRouter([
    {
        element: <PublicRoute />,

        children: [
            {
                path: "/login",
                element: <LoginPage />,

            },
        ],
    },
    {
        path: "/",
        element: <HomePage />,
        // element: <div className="bg-red-400 w-full h-full m-auto">Login Page</div>,
    },

    {
        element: <ProtectedRoute />,

        children: [
            {
                element: <AuthenticatedLayout />,

                children: [
                    {
                        path: "/dashboard",
                        element: <DashboardPage />,
                    },

                    {
                        path: "/courses",
                        element: <div className="bg-green-400 w-full h-full m-auto">Courses Page</div>,
                    },

                    {
                        path: "/classes",
                        element: <TeacherLiveClassPage />,
                    },

                    {
                        path: "/assignments",
                        element: <div className="bg-purple-400 w-full h-full m-auto">Assignments Page</div>,
                    },

                    {
                        path: "/recordings",
                        element: <div className="bg-pink-400 w-full h-full m-auto">Recordings Page</div>,
                    },

                    {
                        path: "/profile",
                        element: <div className="bg-indigo-400 w-full h-full m-auto">Profile Page</div>,
                        //  element: <ProfilePage />,
                    },
                    {
                        path: "/student",
                        children: [
                            {
                                index: true,
                                element: <StudentsPage />,
                            },
                            {
                                path: "add",
                                element: <EnrollStudentPage />,
                            },
                            {
                                path: ":id",
                                element: <h1>"StudentDetailsPage</h1>,
                            },
                            {
                                path: ":id/edit",
                                element: <h1>"EditStudentPage</h1>,
                            },
                        ],
                        //  element: <ProfilePage />,
                    },
                      {
                        path: "/teachers",
                        children: [
                            {
                                index: true,
                                element: <TeachersPage />,
                            },
                            {
                                path: "new",
                                element: <AddTeacher />,
                            },
                            {
                                path: ":id",
                                element: <h1>"StudentDetailsPage</h1>,
                            },
                            {
                                path: ":id/edit",
                                element: <h1>"EditStudentPage</h1>,
                            },
                        ],
                        //  element: <ProfilePage />,
                    },
                ],
            },
        ],
    },
]);