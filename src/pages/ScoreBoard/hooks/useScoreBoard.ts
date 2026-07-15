import {
  useMutation,
  useQuery,
} from "@tanstack/react-query"

import { sileo } from "sileo"

import {
  submitAssessment,
  getAssessmentResults,
  getAssessmentResultById,
  type SubmitAssessmentPayload,
} from "../api/scoreBoard.api"

export function useSubmitAssessment() {
  return useMutation({
    mutationFn: async (
      payload: SubmitAssessmentPayload
    ) => {
      return await submitAssessment(payload)
    },

    onSuccess: () => {
      sileo.success({
        title:
          "Assessment submitted successfully",
      })
    },

    onError: (error: Error) => {
      sileo.error({
        title: "Submission failed",
        description: error.message,
      })
    },
  })
}

export function useAssessmentResults(
  params?: {
    page?: number
    limit?: number
    assessmentId?: string
    studentId?: string
  }
) {
  return useQuery({
    queryKey: [
      "assessment-results",
      params,
    ],

    queryFn: () =>
      getAssessmentResults(params),
  })
}

export function useAssessmentResult(
  id: string
) {
  return useQuery({
    queryKey: [
      "assessment-result",
      id,
    ],

    queryFn: () =>
      getAssessmentResultById(id),

    enabled: !!id,
  })
}