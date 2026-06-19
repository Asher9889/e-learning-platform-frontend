import { api, apiEndPoints } from "@/config";
import type {
  MaterialsResponse,
  MaterialsStatsResponse,
  MaterialFilters,
  UpdateMaterialPayload,
} from "../types/content.types";

export async function getMaterials(filters: MaterialFilters) {
  const { url, method } = apiEndPoints.MATERIALS.LIST;
  const res = await api.request<MaterialsResponse>({
    url,
    method,
    params: filters,
  });
  return res as unknown as MaterialsResponse;
}

export async function getMaterial(id: string) {
  const { url, method } = apiEndPoints.MATERIALS.GET(id);
  const res = await api.request({ url, method });
  return res.data;
}

export async function updateMaterial(id: string, data: UpdateMaterialPayload) {
  const { url, method } = apiEndPoints.MATERIALS.UPDATE(id);
  const res = await api.request({ url, method, data });
  return res.data;
}

export async function publishMaterial(id: string) {
  const { url, method } = apiEndPoints.MATERIALS.PUBLISH(id);
  const res = await api.request({ url, method });
  return res.data;
}

export async function deleteMaterial(id: string) {
  const { url, method } = apiEndPoints.MATERIALS.DELETE(id);
  const res = await api.request({ url, method });
  return res.data;
}

export async function restoreMaterial(id: string) {
  const { url, method } = apiEndPoints.MATERIALS.RESTORE(id);
  const res = await api.request({ url, method });
  return res.data;
}

export async function getMaterialsStats() {
  const { url, method } = apiEndPoints.MATERIALS.STATS;
  const res = await api.request<MaterialsStatsResponse>({ url, method });
  return res as unknown as MaterialsStatsResponse;
}

export async function saveMetadata(data: {
  title: string;
  description?: string;
  contentType: string;
  fileId: string;
}) {
  const { url, method } = apiEndPoints.MATERIALS.METADATA;
  const res = await api.request({ url, method, data });
  return res.data;
}
