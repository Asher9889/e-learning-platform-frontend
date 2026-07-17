import { api } from "@/config";
import { apiEndPoints } from "@/config";

import type {
  TeacherDataFromApi,
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

// 👇 NAYA: single teacher fetch karne ke liye (edit mode prefill)
export async function getTeacherById(id: string) {
  // ⚠️ apiEndPoints.USERS.GET_TEACHER apko config mein add karna hoga
  // agar aapka pattern ":id" placeholder wala hai to replace kar lena,
  // ya agar api.request params support karta hai to wahan pass kar dena
  const { url, method } = apiEndPoints.USERS.GET_TEACHER(id);

  const res = await api.request<TeacherDataFromApi>({
    url: `${url}`, // agar url already ":id" placeholder wala hai to: url.replace(":id", id)
    method,
  });

  return res.data;
}

// 👇 NAYA: teacher update karne ke liye
export async function updateTeacher(
  id: string,
  teacherData: Partial<TeacherEnrollFormOutput>
) {
  const { url, method } = apiEndPoints.USERS.UPDATE_TEACHER(id);

  const res = await api.request({
    url: `${url}`, // ya url.replace(":id", id)
    method,
    data: teacherData,
  });

  return res.data;
}

export async function deleteTeacher(id: string) {
  // ⚠️ apiEndPoints.USERS.DELETE_TEACHER add karna hoga config mein
  // (method: "DELETE" hona chahiye)
  const { url, method } = apiEndPoints.USERS.DELETE_TEACHER(id);

  const res = await api.request({
    url: `${url}`, // ya url.replace(":id", id) agar aapka pattern wo hai
    method,
  });

  return res.data;
}