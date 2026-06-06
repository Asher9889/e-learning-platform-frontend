import { CourseCard } from "./CourseCard";

export function CoursesGrid({
  courses,
  role,
}: any) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course: any) => (
        <CourseCard
          key={course.id}
          course={course}
          role={role}
        />
      ))}
    </div>
  );
}