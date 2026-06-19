import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "#components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#components/ui/select";
import type { Material } from "../types/content.types";
import { formatSize } from "../types/content.types";
import { useGetSubjects } from "@/pages/Subjects/hooks/useGetSubjects";

interface DraftMetadataDrawerProps {
  material: Material | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  programs: { id: string; name: string }[];
  onSaveDraft: (id: string, data: { title: string; description?: string; programId?: string; subjectId?: string }) => void;
  onPublish: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DraftMetadataDrawer({
  material,
  open,
  onOpenChange,
  programs,
  onSaveDraft,
  onPublish,
  onDelete,
}: DraftMetadataDrawerProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [programId, setProgramId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { data: subjectsData } = useGetSubjects(programId || undefined);
  const subjects = subjectsData?.subjects || [];

  useEffect(() => {
    setSubjectId("");
  }, [programId]);

  useEffect(() => {
    if (material) {
      setTitle(material.title || "");
      setDescription(material.description || "");
      setErrors({});
    }
  }, [material]);

  const validate = (forPublish: boolean) => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Title is required";
    if (forPublish) {
      if (!programId) errs.programId = "Program is required";
      if (!subjectId) errs.subjectId = "Subject is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveDraft = () => {
    if (!validate(false) || !material) return;
    onSaveDraft(material.id, { title: title.trim(), description: description.trim() || undefined, programId: programId || undefined, subjectId: subjectId || undefined });
    onOpenChange(false);
  };

  const handlePublish = () => {
    if (!validate(true) || !material) return;
    onSaveDraft(material.id, { title: title.trim(), description: description.trim() || undefined, programId, subjectId });
    onPublish(material.id);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (!material) return;
    onDelete(material.id);
    onOpenChange(false);
  };

  if (!material) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[600px] p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>Complete Details</SheetTitle>
          <SheetDescription>
            Fill in the required metadata to publish this material.
          </SheetDescription>
        </SheetHeader>

        <div className="overflow-y-auto px-6 py-5 space-y-5">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input value={title} onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: "" })); }} placeholder="Enter material title" />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" rows={3} />
          </div>

          <div className="space-y-2">
            <Label>Program *</Label>
            <Select value={programId} onValueChange={(v) => { setProgramId(v); setErrors((p) => ({ ...p, programId: "" })); }}>
              <SelectTrigger>
                <SelectValue placeholder="Select Program" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.programId && <p className="text-xs text-red-500">{errors.programId}</p>}
          </div>

          <div className="space-y-2">
            <Label>Subject *</Label>
            <Select value={subjectId} onValueChange={(v) => { setSubjectId(v); setErrors((p) => ({ ...p, subjectId: "" })); }} disabled={!programId}>
              <SelectTrigger>
                <SelectValue placeholder={programId ? "Select Subject" : "Select Program first"} />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subjectId && <p className="text-xs text-red-500">{errors.subjectId}</p>}
          </div>

          <div className="space-y-2">
            <Label>Material Type</Label>
            <p className="text-sm text-muted-foreground">{material.materialType}</p>
          </div>

          <div className="space-y-2">
            <Label>File Size</Label>
            <p className="text-sm text-muted-foreground">{formatSize(material.file.size)}</p>
          </div>

          <div className="space-y-2">
            <Label>Uploaded By</Label>
            <p className="text-sm text-muted-foreground">{material.createdBy.name}</p>
          </div>

          <div className="space-y-2">
            <Label>Upload Date</Label>
            <p className="text-sm text-muted-foreground">{new Date(material.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="border-t px-6 py-4 flex items-center justify-between">
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Delete
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSaveDraft}>
              Save Draft
            </Button>
            <Button size="sm" onClick={handlePublish}>
              Publish
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
