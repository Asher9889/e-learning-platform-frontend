import { useQueries } from "@tanstack/react-query";
import {
  getDashboardStats,
  getRecentContents,
  getRecentGroupStudies,
  getRecentLiveClasses,
} from "../api/dashboard.api";

export function useDashboard() {
  const [
    stats,
    liveClasses,
    contents,
    groupStudies,
  ] = useQueries({
    queries: [
      {
        queryKey: ["dashboard-stats"],
        queryFn: getDashboardStats,
      },
      {
        queryKey: ["recent-live-classes"],
        queryFn: getRecentLiveClasses,
      },
      {
        queryKey: ["recent-contents"],
        queryFn: getRecentContents,
      },
      {
        queryKey: ["recent-group-studies"],
        queryFn: getRecentGroupStudies,
      },
    ],
  });

  return {
    stats,
    liveClasses,
    contents,
    groupStudies,
  };
}