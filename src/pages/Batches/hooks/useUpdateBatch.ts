import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import type { AxiosError } from "axios";
import { updateBatch } from "../api/batch.api";

export function useUpdateBatch() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateBatch,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });

      sileo.success({
        title: "Batch Updated",
        description: "Batch updated successfully",
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
    updateBatchAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
}
