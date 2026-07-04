import {
  BookOpen,
  Users,
  Video,
  Layers,
  ClipboardList,
  GraduationCap,
  UserCheck,
  Users2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ICON_MAP: Record<string, { icon: LucideIcon; color: string; bg: string; border: string }> = {
  "Study Material": { icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  "Study Groups": { icon: Users, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
  "Live Classes": { icon: Video, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  "Subjects": { icon: Layers, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  "Admission Count": { icon: ClipboardList, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  "Batch Count": { icon: GraduationCap, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200" },
  "Program Count": { icon: UserCheck, color: "text-pink-600", bg: "bg-pink-50", border: "border-pink-200" },
  "User Count": { icon: Users2, color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-200" },
};

// role ke hisaab se sirf titles nikaal liye — skeleton count isi se milega
const TITLES_BY_ROLE: Record<string, string[]> = {
  TEACHER: ["Study Material", "Live Classes", "Subjects", "Program Count"],
  STUDENT: ["Study Material", "Study Groups", "Live Classes", "Subjects"],
};
const DEFAULT_TITLES = [
  "Study Material",
  "Study Groups",
  "Live Classes",
  "Subjects",
  "Admission Count",
  "Batch Count",
  "Program Count",
  "User Count",
];

export function StatsGrid({
  role,
  statsdata,
}: {
  role: string | undefined;
  statsdata: any;
}) {
  const titles = (role && TITLES_BY_ROLE[role]) || DEFAULT_TITLES;

  // isLoading prop diya to usse use karo, warna fallback: statsdata abhi aayi hi nahi
  const showSkeleton =  !statsdata;

  const stats =
    role === "TEACHER"
      ? [
        { title: "Study Material", value: statsdata?.contentCount?.toString() ?? "0" },
        { title: "Live Classes", value: statsdata?.liveClassCount?.toString() ?? "0" },
        { title: "Subjects", value: statsdata?.subjectCount?.toString() ?? "0" },
        { title: "Program Count", value: statsdata?.programCount?.toString() ?? "0" },
      ]
      : role === "STUDENT" ? [
        { title: "Study Material", value: statsdata?.contentCount?.toString() ?? "0" },
        { title: "Study Groups", value: statsdata?.groupStudyCount?.toString() ?? "0" },
        { title: "Live Classes", value: statsdata?.liveClassCount?.toString() ?? "0" },
        { title: "Subjects", value: statsdata?.subjectCount?.toString() ?? "0" },
      ] : [
        { title: "Study Material", value: statsdata?.contentCount?.toString() ?? "0" },
        { title: "Study Groups", value: statsdata?.groupStudyCount?.toString() ?? "0" },
        { title: "Live Classes", value: statsdata?.liveClassCount?.toString() ?? "0" },
        { title: "Subjects", value: statsdata?.subjectCount?.toString() ?? "0" },
        { title: "Admission Count", value: statsdata?.admissionCount?.toString() ?? "0" },
        { title: "Batch Count", value: statsdata?.batchCount?.toString() ?? "0" },
        { title: "Program Count", value: statsdata?.programCount?.toString() ?? "0" },
        { title: "User Count", value: statsdata?.userCount?.toString() ?? "0" },
      ];

  if (showSkeleton) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {titles.map((title) => (
          <div
            key={title}
            className="flex items-center gap-3 rounded-lg border bg-white px-3.5 py-2.5"
          >
            <Skeleton className="h-7 w-7 rounded-md" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-2.5 w-16" />
              <Skeleton className="h-4 w-10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => {
        const meta = ICON_MAP[s.title];
        const Icon = meta?.icon ?? BookOpen;
        return (
          <div
            key={s.title}
            className={`flex items-center gap-3 rounded-lg border ${meta?.border ?? "border-gray-200"} bg-white px-3.5 py-2.5`}
          >
            <div className={`rounded-md ${meta?.bg ?? "bg-gray-50"} p-1.5`}>
              <Icon className={`h-4 w-4 ${meta?.color ?? "text-gray-600"}`} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground leading-none mb-0.5">{s.title}</p>
              <p className="text-base font-bold leading-none">{s.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}