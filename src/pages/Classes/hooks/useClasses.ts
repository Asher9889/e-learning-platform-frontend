// hooks/useClasses.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockApi } from "../mock-api";

const CLASSES_KEY = ["classes"] as const;

export function useClasses() {
  return useQuery({
    queryKey: CLASSES_KEY,
    queryFn: mockApi.getClasses,
  });
}

export function useClass(id: string) {
  return useQuery({
    queryKey: [...CLASSES_KEY, id],
    queryFn: () => mockApi.getClass(id),
    enabled: !!id,
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockApi.createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASSES_KEY });
    },
  });
}

export function useUpdateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockApi.updateClass,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CLASSES_KEY });
      queryClient.invalidateQueries({ queryKey: [...CLASSES_KEY, data.id] });
    },
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockApi.deleteClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASSES_KEY });
    },
  });
}