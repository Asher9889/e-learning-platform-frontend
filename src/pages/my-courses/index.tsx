import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

import { CoursesHeader } from "@/components/my-courses/CoursesHeader";
import { CoursesStats } from "@/components/my-courses/CoursesStats";
import { CourseFilters } from "@/components/my-courses/CourseFilters";
import { CoursesGrid } from "@/components/my-courses/CoursesGrid";
import { ContinueLearningBanner } from "@/components/my-courses/ContinueLearningBanner";

export default function MyCoursesPage() {
  const role = useSelector(
    (state: RootState) => state.auth.user?.role
  );

//   const role =  "instructor" //user?.role || "student";

  // same data structure but extended for instructor use
  const [courses] = useState([
    {
      id: 1,
      title: "React Masterclass",
      progress: 60,

      // instructor data
      instructor: "John Doe",
      students: 120,
      revenue: 5000,

      duration: "12h",
    },
    {
      id: 2,
      title: "Redux Toolkit",
      progress: 30,
      instructor: "Jane Smith",
      students: 80,
      revenue: 3000,
      duration: "8h",
    },
    {
      id: 3,
      title: "Node.js Basics",
      progress: 80,
      instructor: "Alex",
      students: 200,
      revenue: 8000,
      duration: "10h",
    },
  ]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <CoursesHeader role={role} />

      <CoursesStats
        role={role}
        courses={courses}
      />

      {/* Student only */}
      {role === "student" && (
        <ContinueLearningBanner
          course={courses[0]}
        />
      )}

      <CourseFilters role={role} />

      <CoursesGrid
        courses={courses}
        role={role}
      />
    </div>
  );
}