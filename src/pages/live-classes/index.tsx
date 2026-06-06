import { useState } from "react";
import { LiveClassHeader } from "@/components/live-classes/LiveClassHeader";
import { LiveStats } from "@/components/live-classes/LiveStats";
import { LiveNowCard } from "@/components/live-classes/LiveNowCard";
import { UpcomingClasses } from "@/components/live-classes/UpcomingClasses";
import { RecentRecordings } from "@/components/live-classes/RecentRecordings";
import { AttendanceSummary } from "@/components/live-classes/AttendanceSummary";
import type { UserRole } from "@/mockData/menu";

export default function LiveClassesPage() {
//   const role =
//     useSelector(
//       (state: RootState) => state.auth.user?.role
//     ) || "student";
const role: UserRole = 'instructor';

  const [upcoming, setUpcoming] = useState([
    {
      id: 1,
      title: "React Hooks Deep Dive",
      date: "12 Jun 2026",
      time: "7:00 PM",
    },
    {
      id: 2,
      title: "Redux Toolkit",
      date: "14 Jun 2026",
      time: "8:00 PM",
    },
  ]);

  // 🔥 Add new class dynamically
  const addClass = (newClass: any) => {
    setUpcoming((prev) => [
      {
        id: Date.now(),
        ...newClass,
      },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <LiveClassHeader role={role} onAddClass={addClass}/>

      <LiveStats role={role} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LiveNowCard role={role} />
        </div>

        <AttendanceSummary role={role} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <UpcomingClasses
          role={role}
          classes={upcoming}
          onAddClass={addClass}
        />

        <RecentRecordings role={role} />
      </div>
    </div>
  );
}