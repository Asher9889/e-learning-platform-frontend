// hooks/useSections.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mockApi } from "../mock-api";

const CLASSES_KEY = ["classes"] as const;

export function useCreateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockApi.createSection,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CLASSES_KEY });
      queryClient.invalidateQueries({ queryKey: [...CLASSES_KEY, variables.classId] });
    },
  });
}

export function useUpdateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockApi.updateSection,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CLASSES_KEY });
      queryClient.invalidateQueries({ queryKey: [...CLASSES_KEY, variables.classId] });
    },
  });
}

export function useDeleteSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, sectionId }: { classId: string; sectionId: string }) =>
      mockApi.deleteSection(classId, sectionId),
      onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CLASSES_KEY });
      queryClient.invalidateQueries({ queryKey: [...CLASSES_KEY, variables.classId] });
    },
  });
}
