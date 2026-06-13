import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Upload,
  Video,
  FileText,
  Book,
  Image,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Copy,
  Archive,
  UserCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type ContentType = "VIDEO" | "PDF" | "DOCUMENT" | "IMAGE";

interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  subject: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
}

const MOCK_CONTENT: ContentItem[] = [
  { id: "1", title: "Atomic Structure", type: "VIDEO", subject: "Chemistry", uploadedBy: "Anubhav S.", uploadedAt: "2026-06-10", size: "45 MB" },
  { id: "2", title: "Physics Notes - Kinematics", type: "PDF", subject: "Physics", uploadedBy: "Priya M.", uploadedAt: "2026-06-09", size: "2.1 MB" },
  { id: "3", title: "Chemistry Workbook Ch.3", type: "PDF", subject: "Chemistry", uploadedBy: "Anubhav S.", uploadedAt: "2026-06-08", size: "8.4 MB" },
  { id: "4", title: "Cell Division Diagram", type: "IMAGE", subject: "Biology", uploadedBy: "Rahul K.", uploadedAt: "2026-06-07", size: "1.2 MB" },
  { id: "5", title: "Calculus Lecture Recording", type: "VIDEO", subject: "Mathematics", uploadedBy: "Sneha P.", uploadedAt: "2026-06-06", size: "320 MB" },
  { id: "6", title: "Lab Report Template", type: "DOCUMENT", subject: "Science", uploadedBy: "Admin", uploadedAt: "2026-06-05", size: "456 KB" },
  { id: "7", title: "Organic Chemistry Flashcards", type: "PDF", subject: "Chemistry", uploadedBy: "Anubhav S.", uploadedAt: "2026-06-04", size: "3.7 MB" },
  { id: "8", title: "Periodic Table Reference", type: "IMAGE", subject: "Chemistry", uploadedBy: "Admin", uploadedAt: "2026-06-03", size: "890 KB" },
];

const TYPE_ICONS: Record<ContentType, typeof FileText> = {
  VIDEO: Video,
  PDF: FileText,
  DOCUMENT: Book,
  IMAGE: Image,
};

const TYPE_LABELS: Record<ContentType, string> = {
  VIDEO: "Video",
  PDF: "PDF",
  DOCUMENT: "Document",
  IMAGE: "Image",
};

const TYPE_VARIANTS: Record<ContentType, string> = {
  VIDEO: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  PDF: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  DOCUMENT: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  IMAGE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
};

const FILTER_TABS = [
  { value: "all", label: "All" },
  { value: "VIDEO", label: "Videos" },
  { value: "PDF", label: "PDFs" },
  { value: "DOCUMENT", label: "Documents" },
  { value: "IMAGE", label: "Images" },
] as const;

export default function ContentPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = useMemo(() => {
    return MOCK_CONTENT.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.subject.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Content Library</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View, manage, and assign learning content across all subjects.
          </p>
        </div>
        <Button className="gap-2" onClick={() => navigate("/content/upload")}>
          <Upload className="h-4 w-4" />
          Upload Content
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Tabs value={typeFilter} onValueChange={setTypeFilter}>
          <TabsList variant="line" className="mb-0">
            {FILTER_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Content Table */}
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-sm text-muted-foreground">
                  No content found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => {
                const Icon = TYPE_ICONS[item.type];
                return (
                  <TableRow key={item.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                          TYPE_VARIANTS[item.type]
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">by {item.uploadedBy}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs font-medium", TYPE_VARIANTS[item.type])}>
                        {TYPE_LABELS[item.type]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.subject}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.size}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.uploadedAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
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
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
