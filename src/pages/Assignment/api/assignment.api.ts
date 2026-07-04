import { api, apiEndPoints } from "@/config";
import type { AssignmentFilters, AssignmentsResponse } from "../types/assignment.types";


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