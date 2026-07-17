import { useMutation } from "@tanstack/react-query";

import { deleteTeacher } from "../api/teacher.api";
import { queryClient } from "@/config";
import { sileo } from "sileo";

export function useDeleteTeacher() {
  const mutate = useMutation({
    mutationKey: ["delete-teacher"],
    mutationFn: (id: string) => deleteTeacher(id),

    onSuccess: (data, id) => {
      console.log("Teacher deleted successfully", data);

      sileo.success({
        title: "Teacher Deleted",
        description: "Teacher deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.removeQueries({ queryKey: ["teacher", id] });
    },

    onError: (error) => {
      console.error("Teacher deletion failed:", error);

      sileo.error({
        title: "Failed to Delete Teacher",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      });
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