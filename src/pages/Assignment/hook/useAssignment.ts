import { useMutation, useQuery } from "@tanstack/react-query";
import { getAssignments, getAssignment, submitAssessment } from "../api/assignment.api";
import type { AssignmentFilters } from "../types/assignment.types";
import type {
  AssessmentResult,
  SubmitAssessmentPayload,
} from "../types/question-paper.types";
import { sileo } from "sileo";
export function useAssignments(filters: AssignmentFilters) {
  return useQuery({
    queryKey: ["assignments", "list", filters],
    queryFn: () => getAssignments(filters),
    select: (response) => response?.data?.assessments ?? [],
  });

}

export function useAssignment(id: string) {
  console.log(id,"assignmentassignmentassignmentassignmentassignmentassignment checkinh id")
  return useQuery({
    queryKey: ["assignments", id],
    queryFn: () => getAssignment(id),
    select: (response) => {
      return response
    },
    enabled: !!id,
  });
}



export function useSubmitAssessment() {
  return useMutation<
    AssessmentResult,
    Error,
    SubmitAssessmentPayload
  >({
    mutationFn: submitAssessment,

    onError: (error) => {
      sileo.error({
        title: "Submission Failed",
        description: error.message,
      });
    },
  });
}