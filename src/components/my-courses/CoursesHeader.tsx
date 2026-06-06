export function CoursesHeader({ role }: any) {
  return (
    <div>
      <h1 className="text-3xl font-bold">
        {role === "teacher"
          ? "My Created Courses"
          : "My Learning Courses"}
      </h1>

      <p className="text-muted-foreground">
        {role === "teacher"
          ? "Manage and track your courses"
          : "Continue your learning journey"}
      </p>
    </div>
  );
}