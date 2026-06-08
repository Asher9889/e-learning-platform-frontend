export function RecentActivity({ role }: { role: string | undefined }) {
  const data =
    role === "TEACHER"
      ? [
          "5 students joined React course",
          "New assignment submitted",
          "Class completed: JS Basics",
        ]
      : [
          "You completed React Basics",
          "Attendance marked present",
          "New course available",
        ];

  return (
    <div className="space-y-2">
      <h2 className="font-semibold">
        Recent Activity
      </h2>

      <ul className="space-y-1 text-sm text-muted-foreground">
        {data.map((item, i) => (
          <li key={i}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}