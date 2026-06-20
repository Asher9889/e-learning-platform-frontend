import { api } from "@/config";
import { apiEndPoints } from "@/config";
import type {
  StudentEnrollFormOutput,
  StudentsListResponse,
  StudentStatsResponse,
  SingleStudentResponse,
  UpdateStatusResponse,
  BulkUpdateStatusResponse,
  DeleteStudentResponse,
  StudentFilters,
  UpdateStudentStatusInput,
  BulkUpdateStatusInput,
} from "../schema/student.schema";

export async function createStudent(studentData: StudentEnrollFormOutput) {
  const { url, method } = apiEndPoints.USERS.ADD_STUDENT;
  if (studentData?.personalInfo.profileImage === "") {
    delete studentData?.personalInfo.profileImage;
  }
  const res = await api.request({ url, method, data: studentData });
  return res.data;
}

export async function getStudents(filters?: StudentFilters) {
  const { url, method } = apiEndPoints.USERS.LIST_STUDENTS;
  const res = await api.request<StudentsListResponse>({
    url,
    method,
    params: filters,
  });
  return res as unknown as StudentsListResponse;
}

export async function getStudent(id: string) {
  const { url, method } = apiEndPoints.USERS.GET_STUDENT(id);
  const res = await api.request<SingleStudentResponse>({ url, method });
  return res as unknown as SingleStudentResponse;
}

export async function updateStudent(id: string, data: Record<string, unknown>) {
  const { url, method } = apiEndPoints.USERS.UPDATE_STUDENT(id);
  const res = await api.request({ url, method, data });
  return res.data;
}

export async function deleteStudent(id: string) {
  const { url, method } = apiEndPoints.USERS.DELETE_STUDENT(id);
  const res = await api.request<DeleteStudentResponse>({ url, method });
  return res as unknown as DeleteStudentResponse;
}

export async function updateStudentStatus(id: string, data: UpdateStudentStatusInput) {
  const { url, method } = apiEndPoints.USERS.UPDATE_STUDENT_STATUS(id);
  const res = await api.request<UpdateStatusResponse>({ url, method, data });
  return res as unknown as UpdateStatusResponse;
}

export async function bulkUpdateStudentStatus(data: BulkUpdateStatusInput) {
  const { url, method } = apiEndPoints.USERS.BULK_UPDATE_STATUS;
  const res = await api.request<BulkUpdateStatusResponse>({ url, method, data });
  return res as unknown as BulkUpdateStatusResponse;
}

export async function getStudentStats() {
  const { url, method } = apiEndPoints.USERS.STUDENTS_STATS;
  const res = await api.request<StudentStatsResponse>({ url, method });
  return res as unknown as StudentStatsResponse;
}
