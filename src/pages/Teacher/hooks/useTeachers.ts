import { useQuery } from "@tanstack/react-query";

import { getTeachers } from "../api/teacher.api";

export function useTeachers() {
  const query = useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
       staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,

    refetchOnWindowFocus: false,

    select: (response) => {
        console.log("response teachers1213213132", response.teachers);  
      return response.teachers;
    }
      
  });
  const teachers =
    query.data || [];

  return {
    teachers,

    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,

    refetch: query.refetch,

    // Full query object if needed
    query,
  };
}