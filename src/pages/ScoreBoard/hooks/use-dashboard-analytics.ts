import { useQuery } from "@tanstack/react-query"
import { getDashboardAnalytics } from "../api/scoreBoard.api"

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: ["result-analytics"],

    queryFn: getDashboardAnalytics,
  })
}