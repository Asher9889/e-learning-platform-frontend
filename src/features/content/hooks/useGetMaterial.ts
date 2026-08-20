import { useQuery } from "@tanstack/react-query";
import type { Material } from "../types/content.types";

const DUMMY_MATERIAL: Material = {
  id: "6a69b12168a25081e88f7f4c",
  title: "Database Normalization - Lecture 1",
  description:
    "This class introduces database normalization and explains first, second, and third normal forms with practical examples.",
  materialType: "VIDEO",
  objectKey: "materials/6a69b12168a25081e88f7f4c/sample-video.mp4",
  file: {
    originalFileName: "database-normalization-lecture-1.mp4",
    mimeType: "video/mp4",
    size: 245_000_000,
  },
  status: "PUBLISHED",
  createdAt: "2026-08-10T09:00:00.000Z",
  updatedAt: "2026-08-12T14:30:00.000Z",
  subject: "Database Management Systems",
  createdBy: {
    id: "6a230bc2f6775f99e7d2360b",
    name: "System Administrator",
  },
  metadata: {
    durationMs: 3_120_000,
  },
};

export function useGetMaterial(id: string) {
  return useQuery({
    queryKey: ["materials", "detail", id],
    queryFn: async () => ({ data: DUMMY_MATERIAL }),
    enabled: !!id,
  });
}
