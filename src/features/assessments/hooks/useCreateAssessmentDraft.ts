import { useMutation } from "@tanstack/react-query"
import { sileo } from "sileo"
import { createAssessment } from "../api/assessment.api"
import type { CreateAssessmentPayload } from "../types/assessment.types"

export function useCreateAssessmentDraft() {
  return useMutation({
    mutationFn: (data: CreateAssessmentPayload) => createAssessment(data),
    onSuccess: () => {
      sileo.success({ title: "Assessment saved as draft" })
    },
    onError: (error: Error) => {
      sileo.error({ title: "Failed to save draft", description: error.message })
    },
  })
}
