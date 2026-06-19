import {
  Video,
  FileText,
  Book,
  Image,
  Music,
  File,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Copy,
  Archive,
  UserCheck,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type ContentType = "VIDEO" | "PDF" | "DOCUMENT" | "IMAGE" | "AUDIO"

interface ContentCardItem {
  id: string
  title: string
  type: ContentType
  subject: string
  uploadedBy: string
  uploadedAt: string
  size: string
  coverUrl?: string
}

interface ContentCardProps {
  item: ContentCardItem
  onEdit?: (item: ContentCardItem) => void
  onPreview?: (item: ContentCardItem) => void
}

const TYPE_ICONS: Record<ContentType, LucideIcon> = {
  VIDEO: Video,
  PDF: FileText,
  DOCUMENT: Book,
  IMAGE: Image,
  AUDIO: Music,
}

const TYPE_LABELS: Record<ContentType, string> = {
  VIDEO: "Video",
  PDF: "PDF",
  DOCUMENT: "Document",
  IMAGE: "Image",
  AUDIO: "Audio",
}

const TYPE_STYLES: Record<ContentType, { cover: string; icon: string; badge: string }> = {
  VIDEO: {
    cover: "bg-[oklch(0.95_0.025_250)]",
    icon: "text-[oklch(0.5_0.15_250)]",
    badge: "bg-[oklch(0.93_0.03_250)] text-[oklch(0.4_0.15_250)] border-[oklch(0.85_0.04_250)]",
  },
  PDF: {
    cover: "bg-[oklch(0.95_0.025_25)]",
    icon: "text-[oklch(0.5_0.15_25)]",
    badge: "bg-[oklch(0.93_0.03_25)] text-[oklch(0.4_0.15_25)] border-[oklch(0.85_0.04_25)]",
  },
  DOCUMENT: {
    cover: "bg-[oklch(0.95_0.02_280)]",
    icon: "text-[oklch(0.5_0.12_280)]",
    badge: "bg-[oklch(0.93_0.025_280)] text-[oklch(0.4_0.12_280)] border-[oklch(0.85_0.03_280)]",
  },
  IMAGE: {
    cover: "bg-[oklch(0.95_0.02_170)]",
    icon: "text-[oklch(0.5_0.12_170)]",
    badge: "bg-[oklch(0.93_0.025_170)] text-[oklch(0.4_0.12_170)] border-[oklch(0.85_0.03_170)]",
  },
  AUDIO: {
    cover: "bg-[oklch(0.95_0.02_60)]",
    icon: "text-[oklch(0.5_0.12_60)]",
    badge: "bg-[oklch(0.93_0.025_60)] text-[oklch(0.4_0.12_60)] border-[oklch(0.85_0.03_60)]",
  },
}

export function ContentCard({ item, onEdit, onPreview }: ContentCardProps) {
  const Icon = TYPE_ICONS[item.type] || File
  const styles = TYPE_STYLES[item.type] || TYPE_STYLES.DOCUMENT
  const label = TYPE_LABELS[item.type]

  return (
    <div className="group/card relative flex flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-foreground/20">
      {/* Cover area */}
      <div className={cn("relative flex h-44 shrink-0 items-center justify-center overflow-hidden", styles.cover)}>
        {item.coverUrl ? (
          <img
            src={item.coverUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
            loading="lazy"
          />
        ) : (
          <Icon className={cn("h-14 w-14 opacity-60 transition-all duration-300 group-hover/card:scale-110", styles.icon)} />
        )}

        {/* Hover action overlay */}
        <div className="absolute inset-0 flex translate-y-1 items-center justify-center gap-1.5 bg-black/0 opacity-0 transition-all duration-200 group-hover/card:translate-y-0 group-hover/card:bg-black/[0.04] group-hover/card:opacity-100">
          <Button variant="secondary" size="icon" className="h-8 w-8 shadow-sm" onClick={() => onPreview?.(item)}>
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button variant="secondary" size="icon" className="h-8 w-8 shadow-sm" onClick={() => onEdit?.(item)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8 shadow-sm">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem>
                <UserCheck className="mr-2 h-4 w-4" />
                Assign
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content area */}
      <div className="flex flex-1 flex-col gap-1.5 p-4 pt-3">
        <h3 className="truncate text-sm font-semibold tracking-tight text-foreground">
          {item.title}
        </h3>
        <p className="truncate text-xs text-muted-foreground">
          {item.subject} &middot; by {item.uploadedBy}
        </p>
        <div className="mt-auto flex items-center gap-2 pt-2">
          <span className={cn("inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium leading-none", styles.badge)}>
            {label}
          </span>
          <span className="text-[11px] text-muted-foreground">{item.size}</span>
          <span className="ml-auto text-[11px] text-muted-foreground">{item.uploadedAt}</span>
        </div>
      </div>
    </div>
  )
}

export function ContentCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/5">
      <div className="h-40 animate-pulse bg-muted" />
      <div className="flex flex-col gap-2 p-4 pt-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        <div className="mt-2 flex items-center gap-2">
          <div className="h-4 w-12 animate-pulse rounded-md bg-muted" />
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  )
}
