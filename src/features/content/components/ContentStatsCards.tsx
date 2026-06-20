import { Card, CardContent } from "#components/ui/card";
import { Files, CheckCircle2, FileEdit, HardDrive } from "lucide-react";

interface ContentStatsCardsProps {
  stats?: {
    totalMaterials: number;
    publishedMaterials: number;
    draftMaterials: number;
    storageUsed: number;
  };
}

function formatStorage(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

const cards = [
  {
    label: "Total Materials",
    icon: Files,
    getValue: (s: ContentStatsCardsProps["stats"]) => s?.totalMaterials ?? 0,
    formatter: (v: number) => v.toLocaleString(),
  },
  {
    label: "Published",
    icon: CheckCircle2,
    getValue: (s: ContentStatsCardsProps["stats"]) => s?.publishedMaterials ?? 0,
    formatter: (v: number) => v.toLocaleString(),
  },
  {
    label: "Drafts",
    icon: FileEdit,
    getValue: (s: ContentStatsCardsProps["stats"]) => s?.draftMaterials ?? 0,
    formatter: (v: number) => v.toLocaleString(),
  },
  {
    label: "Storage Used",
    icon: HardDrive,
    getValue: (s: ContentStatsCardsProps["stats"]) => s?.storageUsed ?? 0,
    formatter: (v: number) => formatStorage(v),
  },
];

export function ContentStatsCards({ stats }: ContentStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = card.getValue(stats);
        return (
          <Card key={card.label} size="sm">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className="text-xl font-bold">{card.formatter(value)}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
