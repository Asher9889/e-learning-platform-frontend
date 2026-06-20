import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import type { AxiosError } from "axios";
import { createProgram } from "../api/program.api";

export function useCreateProgram() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createProgram,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });

      sileo.success({
        title: "Program Created",
        description: "Program created successfully",
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
    createProgramAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
}
