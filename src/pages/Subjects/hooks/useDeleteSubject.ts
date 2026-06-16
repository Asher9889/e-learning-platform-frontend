import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import type { AxiosError } from "axios";
import { deleteSubject } from "../api/subject.api";

export function useDeleteSubject() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteSubject,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      sileo.success({
        title: "Subject Deleted",
        description: "Subject deleted successfully",
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
    deleteSubjectAsync: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
}
