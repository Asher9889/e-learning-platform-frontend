import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "DRAFT" | "PUBLISHED";
}

export function StatusBadge({
  status,
}: StatusBadgeProps) {
  const isPublished =
    status === "PUBLISHED";

  return (
    <Badge
      variant="outline"
      className={
        isPublished
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-amber-200 bg-amber-50 text-amber-700"
      }
    >
      {isPublished
        ? "Published"
        : "Draft"}
    </Badge>
  );
}