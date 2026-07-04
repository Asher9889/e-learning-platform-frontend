import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { NextClassCard } from "@/components/dashboard/NextClassCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
// import { TeacherPanel } from "@/components/dashboard/TeacherPanel";
// import { StudentPanel } from "@/components/dashboard/StudentPanel";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
// import { LearnerIdCard } from "#components/dashboard/LearnerIdCard";
import { useMemo } from "react";
// import { cardAsImage } from "./lib/cardAsImage";
import { useDashboard } from "./hooks/useDashboard";
import { NextGroupStudyCard } from "#components/dashboard/NextGroupStudyCard";
// import { useGetUser } from "./hooks/useGetUser";
// import { useEffect } from "react";


export default function DashboardPage() {
  const {
  stats,
  liveClasses,
  contents,
  groupStudies,
} = useDashboard();
  // const cardRef = useRef<HTMLDivElement>(null);
  // const getUserMutation = useGetUser();
  //   const queryClient = useQueryClient();

  // const user = queryClient.getQueryData(['user']);

  // const userCache = useQueryCache(['user']);

console.log(stats.data,"awdjhgawdhagw",liveClasses?.data);

  // // read
  // const user = userCache.get();
  // console.log(user,"user data in dashboard")
  const user = useSelector((state: RootState) => state.auth.user);
  const role =
    useSelector(
      (state: RootState) => state.auth.user?.role
    );
const nextClass = useMemo(() => {
  console.log("nextClass liveClass0147554",liveClasses?.data)
  const data = liveClasses?.data;
  if (!data || typeof data !== "object") return null;
  // if (data.status !== "SCHEDULED") return null;
  return data;
}, [liveClasses?.data]);
console.log(liveClasses?.data,"bhar list liveClass0147")

  // useEffect(()=>{
  //   const response =  getUserMutation.mutateAsync();
  //   console.log(response, 'response');
  // },[])
  // console.log(role,"aaaaaadasdasd")
  // const role: string = 'teacher';

  console.log(user, "user data in dashboard",groupStudies?.data);
  return (
    <div className="space-y-6 p-4 md:p-6">
      <DashboardHeader role={role} />

      <StatsGrid role={role} statsdata={stats.data?.counts}/>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <NextClassCard role={role}  liveClass={nextClass}
/>
    <NextGroupStudyCard data={groupStudies?.data} />
          {/* {role === "TEACHER" ? (
            <TeacherPanel />
          ) : (
            <StudentPanel />
          )} */}
        </div>

        <div className="space-y-6">
          <QuickActions role={role} />
          <RecentActivity contents={contents?.data}  />
         {/* {role === "STUDENT" && (
          <div>
            <LearnerIdCard
              ref={cardRef}
              user={user}
              onDownload={() =>
                cardAsImage(cardRef, `${user?.personalInfo.name ?? "learner"}-id-card.png`)
              } />
          </div>)} */}
        </div>
      </div>
    </div>
  );
}