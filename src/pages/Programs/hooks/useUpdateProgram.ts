import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import type { AxiosError } from "axios";
import { updateProgram } from "../api/program.api";

export function useUpdateProgram() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateProgram,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });

      sileo.success({
        title: "Program Updated",
        description: "Program updated successfully",
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
    updateProgramAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
}
