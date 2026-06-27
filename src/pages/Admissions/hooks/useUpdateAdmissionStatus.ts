import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import type { AxiosError } from "axios";
import { updateAdmissionStatus } from "../api/admission.api";

export function useUpdateAdmissionStatus() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateAdmissionStatus,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admissions"] });

      sileo.success({
        title:
          variables.status === "APPROVED" ? "Admission Approved" : "Admission Rejected",
        description: `Application has been ${variables.status.toLowerCase()} successfully`,
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
    updateAdmissionStatusAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
}