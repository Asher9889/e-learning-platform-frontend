import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/config";
import { sileo } from "sileo";
import {
  updateMaterial,
  publishMaterial,
  deleteMaterial,
  restoreMaterial,
  saveMetadata,
} from "../api/content.api";
import type { UpdateMaterialPayload } from "../types/content.types";

export function useUpdateMaterial() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMaterialPayload }) =>
      updateMaterial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials", "list"] });
      sileo.success({ title: "Material updated" });
    },
    onError: (error: Error) => {
      sileo.error({ title: "Update failed", description: error.message });
    },
  });
}

export function usePublishMaterial() {
  return useMutation({
    mutationFn: (id: string) => publishMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials", "list"] });
      queryClient.invalidateQueries({ queryKey: ["materials", "stats"] });
      sileo.success({ title: "Material published" });
    },
    onError: (error: Error) => {
      sileo.error({ title: "Publish failed", description: error.message });
    },
  });
}

export function useDeleteMaterial() {
  return useMutation({
    mutationFn: (id: string) => deleteMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials", "list"] });
      queryClient.invalidateQueries({ queryKey: ["materials", "stats"] });
      sileo.success({ title: "Material moved to trash" });
    },
    onError: (error: Error) => {
      sileo.error({ title: "Delete failed", description: error.message });
    },
  });
}

export function useRestoreMaterial() {
  return useMutation({
    mutationFn: (id: string) => restoreMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials", "list"] });
      queryClient.invalidateQueries({ queryKey: ["materials", "stats"] });
      sileo.success({ title: "Material restored" });
    },
    onError: (error: Error) => {
      sileo.error({ title: "Restore failed", description: error.message });
    },
  });
}

export function useSaveMetadata() {
  return useMutation({
    mutationFn: (data: { title: string; description?: string; contentType: string; fileId: string }) =>
      saveMetadata(data),
    onSuccess: () => {
      sileo.success({ title: "Metadata saved" });
    },
    onError: (error: Error) => {
      sileo.error({ title: "Save failed", description: error.message });
    },
  });
}
