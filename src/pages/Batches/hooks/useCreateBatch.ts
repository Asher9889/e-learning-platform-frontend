import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import type { AxiosError } from "axios";
import { createBatch } from "../api/batch.api";

export function useCreateBatch() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createBatch,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });

      sileo.success({
        title: "Batch Created",
        description: "Batch created successfully",
      });
    },

    onError: (error: AxiosError<{ message: string }>) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";

      sileo.error({ title: "Error", description: message });
    },
  });

  return {
    createBatchAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
}
