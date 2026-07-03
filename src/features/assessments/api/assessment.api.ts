import { api } from "@/config"
import { apiEndPoints } from "@/config"
import type {
  AssessmentPayload,
  AssessmentApiResponse,
  CreateAssessmentPayload,
} from "../types/assessment.types"

export async function generateAssessment(data: AssessmentPayload): Promise<AssessmentApiResponse["data"]> {
  const { url, method } = apiEndPoints.ASSESSMENTS.GENERATE

  const res = await api.request({
    url,
    method,
    data,
  })

  return res.data as AssessmentApiResponse["data"]
}

export async function createAssessment(data: CreateAssessmentPayload): Promise<AssessmentApiResponse["data"]> {
  const { url, method } = apiEndPoints.ASSESSMENTS.CREATE

  const res = await api.request({
    url,
    method,
    data,
  })

  return res.data as AssessmentApiResponse["data"]
}

export async function publishAssessment(id: string): Promise<void> {
  const { url, method } = apiEndPoints.ASSESSMENTS.PUBLISH(id)

  await api.request({
    url,
    method,
  })
}


