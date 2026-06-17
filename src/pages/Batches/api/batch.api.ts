import { api, apiEndPoints } from "@/config";
import type {
  CreateBatchInput,
  BatchListResponse,
  UpdateBatchInput,
} from "../schema/batch.schema";
import type { Batch } from "../types";

export async function getBatches(programId?: string) {
  const { url, method } = apiEndPoints.BATCHES.LIST;
  const res = await api.request<BatchListResponse>({
    url,
    method,
    params: programId ? { programId } : undefined,
  });
  return res.data;
}

export async function getBatch(id: string) {
  const { url, method } = apiEndPoints.BATCHES.GET;
  const res = await api.request<Batch>({
    url: url.replace(":id", id),
    method,
  });
  return res.data;
}

export async function createBatch(data: CreateBatchInput) {
  const { url, method } = apiEndPoints.BATCHES.CREATE;
  const res = await api.request<Batch>({ url, method, data });
  return res.data;
}

export async function updateBatch({ id, ...data }: UpdateBatchInput) {
  const { url, method } = apiEndPoints.BATCHES.UPDATE;
  const res = await api.request<Batch>({
    url: url.replace(":id", id),
    method,
    data,
  });
  return res.data;
}

export async function deleteBatch(id: string) {
  const { url, method } = apiEndPoints.BATCHES.DELETE;
  const res = await api.request({
    url: url.replace(":id", id),
    method,
  });
  return res.data;
}
