import { api } from "@/config"
import { apiEndPoints } from "@/config"
import type { AssessmentPayload, AssessmentApiResponse } from "../types/assessment.types"

export async function generateAssessment(data: AssessmentPayload): Promise<AssessmentApiResponse["data"]> {
  const { url, method } = apiEndPoints.ASSESSMENTS.GENERATE

  const res = await api.request({
    url,
    method,
    data,
  })

  return res.data as AssessmentApiResponse["data"]
}
