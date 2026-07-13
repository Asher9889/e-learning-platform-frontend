import { useQuery } from "@tanstack/react-query";

import { getAssessments } from "../api/assessment.api";

export function useAssessments() {
  return useQuery({
    queryKey: ["assessments"],

    queryFn: getAssessments,
  });
}