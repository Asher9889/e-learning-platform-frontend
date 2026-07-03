import { useMutation } from "@tanstack/react-query"
import { sileo } from "sileo"
import { createAssessment, publishAssessment } from "../api/assessment.api"
import type { CreateAssessmentPayload } from "../types/assessment.types"

export function usePublishAssessment() {
  return useMutation({
    mutationFn: async (assessmentData: CreateAssessmentPayload) => {
      const created = await createAssessment(assessmentData)
      const id = created.id
      if (!id) throw new Error("Assessment ID not found")
      await publishAssessment(id)
    },
    onSuccess: () => {
      sileo.success({ title: "Assessment published successfully" })
    },
    onError: (error: Error) => {
      sileo.error({ title: "Publishing failed", description: error.message })
    },
  })
}
