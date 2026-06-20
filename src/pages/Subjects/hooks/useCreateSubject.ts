import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import type { AxiosError } from "axios";
import { createSubject } from "../api/subject.api";

export function useCreateSubject() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createSubject,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      sileo.success({
        title: "Subject Created",
        description: "Subject created successfully",
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
    createSubjectAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
}
