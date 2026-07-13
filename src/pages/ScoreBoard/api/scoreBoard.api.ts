import { api, apiEndPoints } from "@/config"

export interface SubmitAssessmentPayload {
  assessmentId: string
  answers: Record<string, string>
}

export async function submitAssessment(
  data: SubmitAssessmentPayload
) {
  const { url, method } =
    apiEndPoints.ASSESSMENT_RESULTS.SUBMIT

  const res = await api.request({
    url,
    method,
    data,
  })

  return res.data
}

export async function getAssessmentResults(params?: {
  page?: number
  limit?: number
  assessmentId?: string
  studentId?: string
}) {
  const { url, method } =
    apiEndPoints.ASSESSMENT_RESULTS.GET_ALL

  const res = await api.request({
    url,
    method,
    params,
  })

  return res.data.data
}

export async function getAssessmentResultById(
  id: string
) {
  const { url, method } =
    apiEndPoints.ASSESSMENT_RESULTS.GET_BY_ID(id)

  const res = await api.request({
    url,
    method,
  })

  return res.data
}


export async function getDashboardAnalytics() {
  const { url, method } =
    apiEndPoints.ASSESSMENT_RESULTS.ANALYTICS

  const res = await api.request({
    url,
    method,
  })

  return res.data.data
}

export async function getStudentPerformance(
  params?: {
    page?: number
    limit?: number
    search?: string
  }
) {
  const { url, method } =
    apiEndPoints.ASSESSMENT_RESULTS.STUDENTS

  const res = await api.request({
    url,
    method,
    params,
  })
  console.log(res.data.students,"apidatajkj api rowStudents",res)
  return res.data
}

export async function getStudentHistory(
  studentId: string
) {
  const { url, method } =
    apiEndPoints.ASSESSMENT_RESULTS.STUDENT_HISTORY(
      studentId
    )

  const res = await api.request({
    url,
    method,
  })

  return res.data.results
}