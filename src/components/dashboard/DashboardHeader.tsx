export function DashboardHeader({ role }: { role: string }) {
  return (
    <div>
      <h1 className="text-3xl font-bold">
        {role === "teacher"
          ? "Teacher Dashboard"
          : "My Learning Dashboard"}
      </h1>

      <p className="text-muted-foreground">
        {role === "teacher"
          ? "Manage your classes and students"
          : "Continue your learning journey"}
      </p>
    </div>
  );
}