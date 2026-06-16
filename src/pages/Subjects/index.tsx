import { useState } from "react";
import { Search, Plus, Book, Loader2 } from "lucide-react";

import type { Subject } from "./types";
import type {
  CreateSubjectInput,
  UpdateSubjectInput,
} from "./schema/subject.schema";
import type { Program } from "@/pages/Programs/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useGetSubjects } from "./hooks/useGetSubjects";
import { useCreateSubject } from "./hooks/useCreateSubject";
import { useUpdateSubject } from "./hooks/useUpdateSubject";
import { useDeleteSubject } from "./hooks/useDeleteSubject";
import { useGetPrograms } from "@/pages/Programs/hooks/useGetPrograms";
import { SubjectForm } from "#components/subject-manager/SubjectForm";
import { SubjectTable } from "#components/subject-manager/SubjectTable";

export default function SubjectsPage() {
  const { data: subjectData, isLoading } = useGetSubjects();
  const { data: programData } = useGetPrograms();
  const subjects: Subject[] = subjectData?.subjects ?? [];
  const programs: Program[] = programData?.programs ?? [];

  const { createSubjectAsync, isCreating } = useCreateSubject();
  const { updateSubjectAsync, isUpdating } = useUpdateSubject();
  const { deleteSubjectAsync, isDeleting } = useDeleteSubject();

  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);

  const filteredSubjects = subjects.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      (s.description ?? "").toLowerCase().includes(q) ||
      (s.program?.name ?? "").toLowerCase().includes(q)
    );
  });

  const handleCreate = async (data: CreateSubjectInput) => {
    const res = await createSubjectAsync(data);
    if (res) setShowForm(false);
  };

  const handleUpdate = async (data: UpdateSubjectInput) => {
    const res = await updateSubjectAsync(data);
    if (res) {
      setEditingSubject(null);
      setShowForm(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSubject) return;
    try {
      await deleteSubjectAsync(deletingSubject.id);
      setDeletingSubject(null);
    } catch {
      /* toast handles it */
    }
  };

  const openCreateForm = () => {
    setEditingSubject(null);
    setShowForm(true);
  };

  const openEditForm = (subject: Subject) => {
    setEditingSubject(subject);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingSubject(null);
  };

  const formIsLoading = isCreating || isUpdating;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Book className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Subjects</h1>
                <p className="text-xs text-muted-foreground">
                  {subjects.length}{" "}
                  {subjects.length === 1 ? "subject" : "subjects"} total
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-9"
                />
              </div>
              <Button onClick={openCreateForm} className="gap-2 shrink-0">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Subject</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <SubjectTable
            subjects={filteredSubjects}
            onEdit={openEditForm}
            onDelete={setDeletingSubject}
          />
        )}
      </main>

      <SubjectForm
        isOpen={showForm}
        onClose={closeForm}
        onSubmit={(data) => {
          if (editingSubject) {
            handleUpdate(data as UpdateSubjectInput);
          } else {
            handleCreate(data as CreateSubjectInput);
          }
        }}
        subjectData={editingSubject}
        programs={programs}
        isLoading={formIsLoading}
      />

      <AlertDialog
        open={!!deletingSubject}
        onOpenChange={() => setDeletingSubject(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subject</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deletingSubject?.name}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Subject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
