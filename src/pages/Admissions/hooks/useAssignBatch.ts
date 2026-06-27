import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import { assignBatch } from "../api/admission.api";

export function useAssignBatch() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: assignBatch,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admissions"],
      });

      sileo.success({
        title: "Admission Approved",
        description: "Batch assigned successfully",
      });
    },

    onError: () => {
      sileo.error({
        title: "Error",
        description: "Unable to assign batch",
      });
    },
  });

  return {
    assignBatchAsync: mutation.mutateAsync,
    isAssigning: mutation.isPending,
  };
}