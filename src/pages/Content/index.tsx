import { useState, useMemo, useEffect } from "react"
import {
  Search,
  Upload,
  BookOpen,
} from "lucide-react"
import { UploadContentDialog } from "@/features/content/components/UploadContentDialog"
import { ContentDetailDialog } from "@/features/content/components/ContentDetailDialog"
import { ContentCard, ContentCardSkeleton } from "@/features/content/components/ContentCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ContentType = "VIDEO" | "PDF" | "DOCUMENT" | "IMAGE"

interface ContentItem {
  id: string
  title: string
  description?: string
  type: ContentType
  subject: string
  uploadedBy: string
  uploadedAt: string
  size: string
}

const MOCK_CONTENT: ContentItem[] = [
  { id: "1", title: "Atomic Structure", type: "VIDEO", subject: "Chemistry", uploadedBy: "Anubhav S.", uploadedAt: "Jun 10", size: "45 MB", description: "An in-depth video lecture covering the structure of atoms, electron configuration, and quantum numbers." },
  { id: "2", title: "Physics Notes - Kinematics", type: "PDF", subject: "Physics", uploadedBy: "Priya M.", uploadedAt: "Jun 09", size: "2.1 MB", description: "Comprehensive notes on kinematics including motion equations, graphs, and problem-solving strategies." },
  { id: "3", title: "Chemistry Workbook Ch.3", type: "PDF", subject: "Chemistry", uploadedBy: "Anubhav S.", uploadedAt: "Jun 08", size: "8.4 MB" },
  { id: "4", title: "Cell Division Diagram", type: "IMAGE", subject: "Biology", uploadedBy: "Rahul K.", uploadedAt: "Jun 07", size: "1.2 MB", description: "Detailed diagram illustrating mitosis and meiosis phases with labeled structures." },
  { id: "5", title: "Calculus Lecture Recording", type: "VIDEO", subject: "Mathematics", uploadedBy: "Sneha P.", uploadedAt: "Jun 06", size: "320 MB" },
  { id: "6", title: "Lab Report Template", type: "DOCUMENT", subject: "Science", uploadedBy: "Admin", uploadedAt: "Jun 05", size: "456 KB", description: "Standardized template for writing lab reports with sections for hypothesis, methodology, results, and conclusion." },
  { id: "7", title: "Organic Chemistry Flashcards", type: "PDF", subject: "Chemistry", uploadedBy: "Anubhav S.", uploadedAt: "Jun 04", size: "3.7 MB" },
  { id: "8", title: "Periodic Table Reference", type: "IMAGE", subject: "Chemistry", uploadedBy: "Admin", uploadedAt: "Jun 03", size: "890 KB", description: "High-resolution periodic table with element symbols, atomic numbers, and mass values." },
]

const FILTER_TABS = [
  { value: "all", label: "All" },
  { value: "VIDEO", label: "Videos" },
  { value: "PDF", label: "PDFs" },
  { value: "DOCUMENT", label: "Documents" },
  { value: "IMAGE", label: "Images" },
] as const

export default function ContentPage() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [uploadOpen, setUploadOpen] = useState(false)
  const [editItem, setEditItem] = useState<ContentItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const filtered = useMemo(() => {
    return MOCK_CONTENT.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.subject.toLowerCase().includes(search.toLowerCase())
      const matchesType = typeFilter === "all" || item.type === typeFilter
      return matchesSearch && matchesType
    })
  }, [search, typeFilter])

  const gridClass = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4"

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Content Library</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse and manage your learning materials.
          </p>
        </div>
        <Button className="gap-2" onClick={() => setUploadOpen(true)}>
          <Upload className="h-4 w-4" />
          Upload Content
        </Button>
      </div>
      {/* Visible only when upload dialog is open */}
      <UploadContentDialog open={uploadOpen} onOpenChange={setUploadOpen} />
      <ContentDetailDialog
        open={!!editItem}
        onOpenChange={(open) => { if (!open) setEditItem(null) }}
        item={editItem ?? undefined}
        onSave={(data) => {
          console.log("Saved:", data)
        }}
      />

      {/* Search + Filters */}
      <div className="space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Tabs value={typeFilter} onValueChange={setTypeFilter}>
          <TabsList variant="line" className="mb-0">
            {FILTER_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="cursor-pointer">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className={gridClass}>
          {Array.from({ length: 8 }).map((_, i) => (
            <ContentCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted ring-1 ring-foreground/5">
            <BookOpen className="h-8 w-8 text-muted-foreground/60" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-foreground">No content found</p>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {search || typeFilter !== "all"
                ? "Try adjusting your search or filter to find what you're looking for."
                : "Your content library is empty. Upload your first learning material to get started."}
            </p>
          </div>
          {!search && typeFilter === "all" && (
            <Button className="mt-1 gap-2" onClick={() => setUploadOpen(true)}>
              <Upload className="h-4 w-4" />
              Upload Content
            </Button>
          )}
        </div>
      ) : (
        <div className={gridClass}>
          {filtered.map((item) => (
            <ContentCard key={item.id} item={item} onEdit={setEditItem} />
          ))}
        </div>
      )}
    </div>
  )
}
