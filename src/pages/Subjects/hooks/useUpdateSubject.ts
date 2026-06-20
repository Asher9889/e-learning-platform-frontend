import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import type { AxiosError } from "axios";
import { updateSubject } from "../api/subject.api";

export function useUpdateSubject() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateSubject,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      sileo.success({
        title: "Subject Updated",
        description: "Subject updated successfully",
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
    updateSubjectAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
}
