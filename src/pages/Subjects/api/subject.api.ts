import { api, apiEndPoints } from "@/config";
import type {
  CreateSubjectInput,
  SubjectListResponse,
  UpdateSubjectInput,
} from "../schema/subject.schema";
import type { Subject } from "../types";

export async function getSubjects() {
  const { url, method } = apiEndPoints.SUBJECTS.LIST;
  const res = await api.request<SubjectListResponse>({ url, method });
  return res.data;
}

export async function getSubject(id: string) {
  const { url, method } = apiEndPoints.SUBJECTS.GET;
  const res = await api.request<Subject>({
    url: url.replace(":id", id),
    method,
  });
  return res.data;
}

export async function createSubject(data: CreateSubjectInput) {
  const { url, method } = apiEndPoints.SUBJECTS.CREATE;
  const res = await api.request<Subject>({ url, method, data });
  return res.data;
}

export async function updateSubject({ id, ...data }: UpdateSubjectInput) {
  const { url, method } = apiEndPoints.SUBJECTS.UPDATE;
  const res = await api.request<Subject>({
    url: url.replace(":id", id),
    method,
    data,
  });
  return res.data;
}

export async function deleteSubject(id: string) {
  const { url, method } = apiEndPoints.SUBJECTS.DELETE;
  const res = await api.request({
    url: url.replace(":id", id),
    method,
  });
  return res.data;
}
