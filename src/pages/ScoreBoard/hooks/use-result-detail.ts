import { useQuery } from "@tanstack/react-query"

import { getAssessmentResultById } from "../api/scoreBoard.api"

export function useResultDetail(
  resultId?: string
) {
  return useQuery({
    queryKey: [
      "assessment-result-detail",
      resultId,
    ],

    queryFn: () =>
      getAssessmentResultById(
        resultId!
      ),

    enabled: !!resultId,
  })
}