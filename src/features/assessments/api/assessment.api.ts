import { api } from "@/config"
import { apiEndPoints } from "@/config"
import type { AssessmentPayload, AssessmentApiResponse, PublishAssessmentPayload } from "../types/assessment.types"

export async function generateAssessment(data: AssessmentPayload): Promise<AssessmentApiResponse["data"]> {
  const { url, method } = apiEndPoints.ASSESSMENTS.GENERATE

  const res = await api.request({
    url,
    method,
    data,
  })

  return res.data as AssessmentApiResponse["data"]
}

export async function publishAssessment(data: PublishAssessmentPayload): Promise<void> {
  const { url, method } = apiEndPoints.ASSESSMENTS.PUBLISH

  await api.request({
    url,
    method,
    data,
  })
}


