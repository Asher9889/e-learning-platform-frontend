import { api } from "@/config";
import { apiEndPoints } from "@/config";

import type {
  TeacherEnrollFormOutput,
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

  const res = await api.request({
    url,
    method,
  });

  return res.data;
}