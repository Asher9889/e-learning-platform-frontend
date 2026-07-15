import { api, apiEndPoints } from "@/config";
import type { AssignmentFilters, AssignmentsResponse } from "../types/assignment.types";

import type {
  AssessmentResult,
  SubmitAssessmentPayload,
} from "../types/question-paper.types";

export async function getAssignments(filters: AssignmentFilters) {
  const { url, method } = apiEndPoints.ASSIGNMENT.LIST;

  const res = await api.request<AssignmentsResponse>({
    url,
    method,
    params: filters,
  });

  return res as unknown as AssignmentsResponse;
}

export async function getAssignment(id: string) {
  const { url, method } = apiEndPoints.ASSIGNMENT.GET(id);

  const res = await api.request({
    url,
    method,
  });

  return res.data;
}

export async function submitAssessment(
  payload: SubmitAssessmentPayload
) {
  const { url, method } =
    apiEndPoints.ASSIGNMENT.SUBMIT_ASSIGNMENT;

  const res =
    await api.request<AssessmentResult>({
      url,
      method,
      data: payload,
    });

  return res?.data as unknown as AssessmentResult;
}