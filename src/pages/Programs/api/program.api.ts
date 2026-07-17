import { api, apiEndPoints } from "@/config";
import type {
  CreateProgramInput,
  ProgramListResponse,
  UpdateProgramInput,
} from "../schema/program.schema";
import type { Program } from "../types";

export async function getPrograms() {
  const { url, method } = apiEndPoints.PROGRAMS.LIST;
  const res = await api.request<ProgramListResponse>({ url, method });
  return res.data;
}

export async function getProgram(id: string) {
  const { url, method } = apiEndPoints.PROGRAMS.GET;
  const res = await api.request<Program>({
    url: url.replace(":id", id),
    method,
  });
  return res.data;
}

export async function createProgram(data: CreateProgramInput) {
  const { url, method } = apiEndPoints.PROGRAMS.CREATE;
  const res = await api.request<Program>({ url, method, data });
  return res.data;
}

export async function updateProgram({ id, ...data }: UpdateProgramInput) {
  const { url, method } = apiEndPoints.PROGRAMS.UPDATE;
//   const {benefits, ...restData} = data
//   console.log(restData,"restData",benefits)
//   // console.log(JSON.parse(JSON.stringify(restData)),"restData14");
//   const values = benefits.map(item => item?.value);
// const payload = {
//   ...restData,
//   benefits:values,
// };
  const res = await api.request<Program>({
    url: url.replace(":id", id),
    method,
    data,
  });
  return res.data;
}

export async function deleteProgram(id: string) {
  const { url, method } = apiEndPoints.PROGRAMS.DELETE;
  const res = await api.request({
    url: url.replace(":id", id),
    method,
  });
  return res.data;
}
