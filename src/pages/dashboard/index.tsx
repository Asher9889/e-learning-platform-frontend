import { useSelector } from "react-redux";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { NextClassCard } from "@/components/dashboard/NextClassCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { InstructorPanel } from "@/components/dashboard/InstructorPanel";
import { StudentPanel } from "@/components/dashboard/StudentPanel";
import type { RootState } from "@/store";


export default function DashboardPage() {
//   const queryClient = useQueryClient();

// const user = queryClient.getQueryData(['user']);

// const userCache = useQueryCache(['user']);

// // read
// const user = userCache.get();
// console.log(user,"user data in dashboard")
  const role =
    useSelector(
      (state: RootState) => state.auth.user?.role
    ) || "student";
// const role: string = 'instructor';
  return (
    <div className="space-y-6 p-4 md:p-6">
      <DashboardHeader role={role} />

      <StatsGrid role={role} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <NextClassCard role={role} />

          {role === "instructor" ? (
            <InstructorPanel />
          ) : (
            <StudentPanel />
          )}
        </div>

        <div className="space-y-6">
          <QuickActions role={role} />
          <RecentActivity role={role} />
        </div>
      </div>
    </div>
  );
}