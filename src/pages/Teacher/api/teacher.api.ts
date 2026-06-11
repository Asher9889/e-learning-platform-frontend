import { api } from "@/config";
import { apiEndPoints } from "@/config";

import type {
  TeacherEnrollFormOutput,
  TeachersListResponse,
  TeachersSummary,
} from "../schema/teacher.schema";

export async function createTeacher(
  teacherData: TeacherEnrollFormOutput
) {
  const { url, method } =
    apiEndPoints.USERS.ADD_TEACHER;

  const res = await api.request({
    url,
    method,
    data: teacherData,
  });

  return res.data;
}

export async function getTeachers() {
  const { url, method } =
    apiEndPoints.USERS.LIST_TEACHERS;

  const res = await api.request<TeachersListResponse>({
    url,
    method,
  });

  return res.data;
}
export async function getTeachersSummary() {
  const { url, method } =
    apiEndPoints.USERS.SUMMARY_TEACHERS;

  const res = await api.request<TeachersSummary>({
    url,
    method,
  });

  return res.data;
}