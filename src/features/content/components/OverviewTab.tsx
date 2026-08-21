import type { MaterialDetail } from "../types/content.types";
import { formatSize } from "../types/content.types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Calendar,
  HardDrive,
  BookOpen,
  FileText,
  Film,
  Image,
  Music,
} from "lucide-react";

const TYPE_LABELS: Record<string, string> = {
  VIDEO: "Recorded Class",
  PDF: "PDF Document",
  DOCUMENT: "Document",
  IMAGE: "Image",
  AUDIO: "Audio",
};

const TYPE_ICONS: Record<string, typeof Film> = {
  VIDEO: Film,
  PDF: FileText,
  DOCUMENT: FileText,
  IMAGE: Image,
  AUDIO: Music,
};

interface OverviewTabProps {
  material: MaterialDetail;
  materialType: string;
}

export function OverviewTab({ material, materialType }: OverviewTabProps) {
  const TypeIcon = TYPE_ICONS[materialType] || FileText;
  const subjectName = material.subject?.name || "--";

  return (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Description
        </h3>
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-sm leading-relaxed text-foreground">
            {material.description || "No description provided."}
          </p>
        </div>
      </div>

      {/* Content Information */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Content Information
        </h3>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              <InfoRow
                icon={<BookOpen className="h-4 w-4" />}
                label="Subject"
                value={subjectName}
              />
              <InfoRow
                icon={<User className="h-4 w-4" />}
                label="Uploaded By"
                value={material.createdBy.name}
              />
              <InfoRow
                icon={<HardDrive className="h-4 w-4" />}
                label="File Size"
                value={formatSize(material.file.size)}
              />
              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label="Uploaded"
                value={new Date(material.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              />
              <InfoRow
                icon={<TypeIcon className="h-4 w-4" />}
                label="Content Type"
                value={
                  <Badge variant="secondary" className="font-normal">
                    {TYPE_LABELS[materialType] || materialType}
                  </Badge>
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}
