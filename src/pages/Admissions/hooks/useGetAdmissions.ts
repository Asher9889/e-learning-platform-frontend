import { useQuery } from "@tanstack/react-query";
import { getAdmissions } from "../api/admission.api";

export function useGetAdmissions() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admissions"],
    queryFn: getAdmissions,
  });

  return { data, isLoading, error };
}