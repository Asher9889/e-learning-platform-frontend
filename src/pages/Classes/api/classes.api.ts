import { api, apiEndPoints } from "@/config";
import type { CreateClassInput, CreateSectionInput, StudentsListResponse, UpdateClassInput, UpdateSectionInput } from "../schema/class.schema";


export async function createClass(
  classData: CreateClassInput
) {
  const { url, method } =
    apiEndPoints.CLASSES.ADD_CLASS;

  const res = await api.request({
    url,
    method,
    data: classData,
  });

  return res.data;
}

export async function getClasses() {
  const { url, method } =
    apiEndPoints.CLASSES.LIST_CLASSES;

  const res = await api.request<StudentsListResponse>({
    url,
    method,
  });

  return res.data;
}

export async function updateClass({id,...classData}: UpdateClassInput) {
  const { url, method } =
    apiEndPoints.CLASSES.UPDATE_CLASS;

  const res = await api.request({
    url: url.replace(":id", id),
    method,
    data: classData,
  });   

  return res.data;
}

export async function deleteClass(classId: string) {
    const { url, method } =
    apiEndPoints.CLASSES.DELETE_CLASS;

  const res = await api.request({
    url: url.replace(":id", classId),
    method,
  });   
  return res.data;
}
export async function createSection({
  classId,
  ...sectionData
}: CreateSectionInput) {
  const { url, method } =
    apiEndPoints.CLASSES.ADD_SECTION;

  const res = await api.request({
    url: url.replace(":id", classId),
    method,
    data: sectionData,
  });

  return res.data;
}

export async function updateSection({
  classId,
  id,
  ...sectionData
}: UpdateSectionInput) {
  const { url, method } =
    apiEndPoints.CLASSES.UPDATE_SECTION;
console.log(sectionData,"sectionData updateSection")
  const res = await api.request({
    url: url.replace(":id", classId).replace(":sectionId", id),
    method,
    data: sectionData,
  });
   return res.data;
}

export async function deleteSection({
  classId,
  id,
}: {
  classId: string;
  id: string;
}) {
  const { url, method } =
    apiEndPoints.CLASSES.DELETE_SECTION;

  const res = await api.request({
    url: url.replace(":id", classId).replace(":sectionId", id),
    method,
  });
   return res.data;
}   