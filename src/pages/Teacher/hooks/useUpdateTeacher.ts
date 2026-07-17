import { useMutation } from "@tanstack/react-query";

import { updateTeacher } from "../api/teacher.api";
import { queryClient } from "@/config";
import type { TeacherEnrollFormOutput } from "../schema/teacher.schema";

type UpdateTeacherPayload = { id: string } & Partial<TeacherEnrollFormOutput>;

export function useUpdateTeacher() {
  const mutate = useMutation({
    mutationKey: ["update-teacher"],
    mutationFn: ({ id, ...data }: UpdateTeacherPayload) =>
      updateTeacher(id, data),

    onSuccess: (data) => {
      console.log("Teacher updated successfully", data);
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["teacher"] });
    },

    onError: (error) => {
      console.error("Teacher update failed:", error);
    },
  });

  return {
    mutate: mutate.mutate,
    mutateAsync: mutate.mutateAsync,
    isPending: mutate.isPending,
    isSuccess: mutate.isSuccess,
    isError: mutate.isError,
  };
}