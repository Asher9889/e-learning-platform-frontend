import { api, apiEndPoints } from "@/config";
import type { CreateGradeInput, GradesListResponse, UpdateGrade } from "../schema/grade.schema";

export async function createGrade(
  gradesdata: CreateGradeInput
) {
  const { url, method } =
    apiEndPoints.GRADES.CREATE_GRADE;

  const res = await api.request({
    url,
    method,
    data: gradesdata,
  });

  return res;
}

export async function getGrades() {
  const { url, method } =
    apiEndPoints.GRADES.LIST_GRADES;

  const res = await api.request<GradesListResponse>({
    url,
    method,
  });

  return res.data;
}

export async function updateGrades({id ,...gradesdata} :UpdateGrade ) {
   const { url, method } =
    apiEndPoints.GRADES.UPDATE_GRADE;

  const res = await api.request({
    url: url.replace(":id", id),
    method,
    data: gradesdata,
  });   

  return res.data;
}

export async function deleteGrade(classId: string) {
    const { url, method } =
    apiEndPoints.GRADES.DELETE_GRADE;

  const res = await api.request({
    url: url.replace(":id", classId),
    method,
  });   
  return res.data;
}