// src/pages/Classes/hooks/useDeleteClass.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGrade } from "../api/grades.api";

export function useDeleteGrade() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteGrade,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["grades"],
      });
    },
  });

  return {
    deleteGradeAsync: mutation.mutateAsync,

    isDeleting: mutation.isPending,

    error: mutation.error,
  };
}