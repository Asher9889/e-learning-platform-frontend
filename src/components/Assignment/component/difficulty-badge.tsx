import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  difficulty: "EASY" | "MEDIUM" | "HARD" | "MIXED";
};

const variants = {
  EASY: "bg-emerald-100 text-emerald-700 border-emerald-200",
  MEDIUM: "bg-amber-100 text-amber-700 border-amber-200",
  HARD: "bg-red-100 text-red-700 border-red-200",
  MIXED: "bg-blue-100 text-blue-700 border-blue-200",
};

export function DifficultyBadge({ difficulty }: Props) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-3 py-1 font-medium",
        variants[difficulty]
      )}
    >
      {difficulty}
    </Badge>
  );
}