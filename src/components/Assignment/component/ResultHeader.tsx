import { Trophy } from "lucide-react";

type ResultHeaderProps = {
  title: string;
};

export function ResultHeader({
  title,
}: ResultHeaderProps) {
  return (
    <div className="rounded-2xl border bg-card p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Trophy className="h-8 w-8 text-primary" />
      </div>

      <h1 className="text-3xl font-bold">
        Test Completed
      </h1>

      <p className="mt-2 text-muted-foreground">
        {title}
      </p>
    </div>
  );
}