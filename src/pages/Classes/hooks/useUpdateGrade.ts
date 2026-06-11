// src/pages/Classes/hooks/useUpdateClass.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGrades } from "../api/grades.api";

export function useUpdateGrade() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateGrades,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["grades"],
      });
    },
  });

  return {
    updateGradeAsync: mutation.mutateAsync,

    isUpdating: mutation.isPending,

    error: mutation.error,
  };
}