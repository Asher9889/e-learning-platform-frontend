import { api } from "@/config";
import { apiEndPoints } from "@/config";
import type { StudentEnrollFormOutput } from "../schema/student.schema";



export async function createStudent(
  teacherData: StudentEnrollFormOutput
) {
  const { url, method } =
    apiEndPoints.USERS.ADD_STUDENT;

  const res = await api.request({
    url,
    method,
    data: teacherData,
  });

  return res.data;
}