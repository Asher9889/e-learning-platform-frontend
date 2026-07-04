import { useQuery } from "@tanstack/react-query";
import { getAssignments, getAssignment } from "../api/assignment.api";
import type { AssignmentFilters } from "../types/assignment.types";

export function useAssignments(filters: AssignmentFilters) {
  return useQuery({
    queryKey: ["assignments", "list", filters],
    queryFn: () => getAssignments(filters),
  });
}

export function useAssignment(id: string) {
  return useQuery({
    queryKey: ["assignments", id],
    queryFn: () => getAssignment(id),
    enabled: !!id,
  });
}