import { useMutation } from "@tanstack/react-query"
import { sileo } from "sileo"
import { publishAssessment } from "../api/assessment.api"
import type { PublishAssessmentPayload } from "../types/assessment.types"

export function usePublishAssessment() {
  return useMutation({
    mutationFn: (data: PublishAssessmentPayload) => publishAssessment(data),
    onSuccess: () => {
      sileo.success({ title: "Assessment published successfully" })
    },
    onError: (error: Error) => {
      sileo.error({ title: "Publishing failed", description: error.message })
    },
  })
}
