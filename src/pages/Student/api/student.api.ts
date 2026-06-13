import { api } from "@/config";
import { apiEndPoints } from "@/config";
import type { StudentEnrollFormOutput, StudentsListResponse } from "../schema/student.schema";



export async function createStudent(
  studentData: StudentEnrollFormOutput
) {
  const { url, method } =
    apiEndPoints.USERS.ADD_STUDENT;
  if(studentData?.personalInfo.profileImage === ""){
    delete studentData?.personalInfo.profileImage
  }
  const res = await api.request({
    url,
    method,
    data: studentData,
  });

  return res.data;
}

export async function getStudents() {
  const { url, method } =
    apiEndPoints.USERS.LIST_STUDENTS;

  const res = await api.request<StudentsListResponse>({
    url,
    method,
  });

  return res.data;
}