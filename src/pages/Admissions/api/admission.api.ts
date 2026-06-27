import { api, apiEndPoints } from "@/config";
import type { UpdateAdmissionStatusInput } from "../schema/admission.schema";
import type { Admission } from "../types";
export interface AssignBatchInput {
  admissionId: string;
  batchId: string;
}
export async function getAdmissions() {
  const { url, method } = apiEndPoints.ADMISSIONS.LIST;
  const res = await api.request<{ admissions: Admission[] }>({
    url,
    method,
  });
  return res.data;
}

export async function getAdmission(id: string) {
  const { url, method } = apiEndPoints.ADMISSIONS.GET;
  const res = await api.request<Admission>({
    url: url.replace(":id", id),
    method,
  });
  return res.data;
}

export async function updateAdmissionStatus({
  id,
  ...data
}: UpdateAdmissionStatusInput) {
  const { url, method } = apiEndPoints.ADMISSIONS.UPDATE_STATUS;
  const res = await api.request<Admission>({
    url: url.replace(":id", id),
    method,
    data,
  });
  return res.data;
}

export async function assignBatch(input: AssignBatchInput) {
  const { url, method } = apiEndPoints.ADMISSIONS.ASSIGN_BATCH;

  const res = await api.request({
    url,
    method,
    data: input,
  });

  return res.data;
}