// hooks/useSections.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CLASSES_KEY = ["classes"] as const;

export function useCreateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: unknown) => {
      console.log("createSection", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASSES_KEY });
    },
  });
}

export function useUpdateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: unknown) => {
      console.log("updateSection", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASSES_KEY });
    },
  });
}

export function useDeleteSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ classId, sectionId }: { classId: string; sectionId: string }) => {
      console.log("deleteSection", classId, sectionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASSES_KEY });
    },
  });
}
