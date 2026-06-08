export function DashboardHeader({ role }: { role: string | undefined }) {
  return (
    <div>
      <h1 className="text-3xl font-bold">
        {role === "TEACHER"
          ? "Teacher Dashboard"
          : "My Learning Dashboard"}
      </h1>

      <p className="text-muted-foreground">
        {role === "TEACHER"
          ? "Manage your classes and students"
          : "Continue your learning journey"}
      </p>
    </div>
  );
}