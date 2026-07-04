import { Badge } from "@/components/ui/badge";

interface Props {
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
}

export function StatusBadge({
  status,
}: Props) {
  const variant =
    status === "ACTIVE"
      ? "default"
      : status === "BLOCKED"
      ? "destructive"
      : "secondary";

  return (
    <Badge variant={variant}>
      {status}
    </Badge>
  );
}