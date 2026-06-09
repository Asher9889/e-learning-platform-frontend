import { api } from "@/config";
import type { Method } from "axios";

interface IRequestOptions<TData = unknown> {
  url: string;
  method?: Method;
  data?: TData;
  params?: Record<string, unknown>;
}

export async function apiRequest<TResponse, TData = unknown>({url, method = "GET", data, params}: IRequestOptions<TData>): Promise<TResponse> {
  const response = await api.request<TResponse>({
    url,
    method,
    data,
    params,
  });

  return response.data;
}

export default apiRequest;