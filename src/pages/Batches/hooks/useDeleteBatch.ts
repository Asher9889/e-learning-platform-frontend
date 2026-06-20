import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import type { AxiosError } from "axios";
import { deleteBatch } from "../api/batch.api";

export function useDeleteBatch() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteBatch,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });

      sileo.success({
        title: "Batch Deleted",
        description: "Batch deleted successfully",
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
    deleteBatchAsync: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
}
