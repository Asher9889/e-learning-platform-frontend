import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import type { AxiosError } from "axios";
import { deleteProgram } from "../api/program.api";

export function useDeleteProgram() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteProgram,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });

      sileo.success({
        title: "Program Deleted",
        description: "Program deleted successfully",
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
    deleteProgramAsync: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
}
