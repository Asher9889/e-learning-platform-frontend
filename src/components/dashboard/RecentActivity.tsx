// export function RecentActivity({ role }: { role: string | undefined }) {
//   const data =
//     role === "TEACHER"
//       ? [
//           "5 students joined React course",
//           "New assignment submitted",
//           "Class completed: JS Basics",
//         ]
//       : [
//           "You completed React Basics",
//           "Attendance marked present",
//           "New course available",
//         ];

//   return (
//     <div className="space-y-2">
//       <h2 className="font-semibold">
//         Recent Activity
//       </h2>

//       <ul className="space-y-1 text-sm text-muted-foreground">
//         {data.map((item, i) => (
//           <li key={i}>• {item}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";

interface RecentContent {
  _id: string;
  title: string;
  subjectId?: { _id: string; name: string };
}

export function RecentActivity({
  contents,
}: {
  role?: string;
  contents?: RecentContent[];
  isLoading?: boolean;
}) {
  if (false) {
    return (
      <div className="space-y-2">
        <h2 className="font-semibold">Recent Activity</h2>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-3.5 w-full max-w-[180px]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!contents || contents.length === 0) {
    return (
      <div className="space-y-2">
        <h2 className="font-semibold">Recent Activity</h2>
        <p className="text-sm text-muted-foreground">No recent activity yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="font-semibold">Recent Activity</h2>

      <ul className="space-y-1.5 text-sm text-muted-foreground">
        {contents.map((item) => (
          <li
            key={item._id}
            className="flex items-center gap-2 min-w-0"
          >
            <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{item.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}