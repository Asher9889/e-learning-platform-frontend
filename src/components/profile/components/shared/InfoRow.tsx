import type { ReactNode } from "react";

interface Props {
  label: string;
  value?: string | null;
  children?: ReactNode;
}

export function InfoRow({ label, value, children }: Props) {
  return (
    <div className="flex flex-col gap-1 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      {children ? children : <p className="text-sm font-medium">{value || "—"}</p>}
    </div>
  );
}