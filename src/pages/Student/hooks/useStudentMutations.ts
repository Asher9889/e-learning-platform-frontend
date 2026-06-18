import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/config";
import { sileo } from "sileo";
import {
  deleteStudent,
  updateStudentStatus,
  bulkUpdateStudentStatus,
} from "../api/student.api";
import type { UpdateStudentStatusInput, BulkUpdateStatusInput } from "../schema/student.schema";

export function useDeleteStudent() {
  return useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student-stats"] });
      sileo.success({ title: "Student deleted" });
    },
    onError: (error: Error) => {
      sileo.error({ title: "Delete failed", description: error.message });
    },
  });
}

export function useUpdateStudentStatus() {
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateStudentStatusInput) =>
      updateStudentStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student-stats"] });
      sileo.success({ title: "Status updated" });
    },
    onError: (error: Error) => {
      sileo.error({ title: "Status update failed", description: error.message });
    },
  });
}

export function useBulkUpdateStudentStatus() {
  return useMutation({
    mutationFn: (data: BulkUpdateStatusInput) => bulkUpdateStudentStatus(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student-stats"] });
      sileo.success({
        title: `${res.data.updatedCount} students updated`,
      });
    },
    onError: (error: Error) => {
      sileo.error({ title: "Bulk update failed", description: error.message });
    },
  });
}
