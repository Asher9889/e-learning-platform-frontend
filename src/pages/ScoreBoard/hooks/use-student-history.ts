import { useQuery } from "@tanstack/react-query"

import { getStudentHistory } from "../api/scoreBoard.api"

export function useStudentHistory(
  studentId?: string
) {
  return useQuery({
    queryKey: [
      "student-history",
      studentId,
    ],

    queryFn: () =>
      getStudentHistory(studentId!),

    enabled: !!studentId,
  })
}