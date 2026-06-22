import { useMutation } from "@tanstack/react-query"
import { sileo } from "sileo"
import { generateAssessment } from "../api/assessment.api"
import type { AssessmentPayload } from "../types/assessment.types"

export function useGenerateAssessment() {
  return useMutation({
    mutationFn: (data: AssessmentPayload) => generateAssessment(data),
    onSuccess: () => {
      sileo.success({ title: "Assessment generated successfully" })
    },
    onError: (error: Error) => {
      sileo.error({ title: "Generation failed", description: error.message })
    },
  })
}
