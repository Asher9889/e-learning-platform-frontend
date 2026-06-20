import { useState } from "react";
import { Search, Plus, GraduationCap } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import type { Program } from "./types";
import type {
  CreateProgramInput,
  UpdateProgramInput,
} from "./schema/program.schema";

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

import { useGetPrograms } from "./hooks/useGetPrograms";
import { useCreateProgram } from "./hooks/useCreateProgram";
import { useUpdateProgram } from "./hooks/useUpdateProgram";
import { useDeleteProgram } from "./hooks/useDeleteProgram";
import { ProgramForm } from "#components/program-manager/ProgramForm";
import { ProgramTable } from "#components/program-manager/ProgramTable";

export default function ProgramsPage() {
  const { data, isLoading } = useGetPrograms();
  const programs: Program[] = data?.programs ?? [];

  const { createProgramAsync, isCreating } = useCreateProgram();
  const { updateProgramAsync, isUpdating } = useUpdateProgram();
  const { deleteProgramAsync, isDeleting } = useDeleteProgram();

  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [deletingProgram, setDeletingProgram] = useState<Program | null>(null);

  const filteredPrograms = programs.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.fullName ?? "").toLowerCase().includes(q) ||
      (p.description ?? "").toLowerCase().includes(q)
    );
  });

  const handleCreate = async (data: CreateProgramInput) => {
    const res = await createProgramAsync(data);
    if (res) {
      setShowForm(false);
    }
  };

  const handleUpdate = async (data: UpdateProgramInput) => {
    const res = await updateProgramAsync(data);
    if (res) {
      setEditingProgram(null);
      setShowForm(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProgram) return;
    try {
      await deleteProgramAsync(deletingProgram.id);
      setDeletingProgram(null);
    } catch {
      // error handled by hook toast
    }
  };

  const openCreateForm = () => {
    setEditingProgram(null);
    setShowForm(true);
  };

  const openEditForm = (program: Program) => {
    setEditingProgram(program);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProgram(null);
  };

  const formIsLoading = isCreating || isUpdating;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Programs</h1>
                <p className="text-xs text-muted-foreground">
                  {programs.length}{" "}
                  {programs.length === 1 ? "program" : "programs"} total
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-9"
                />
              </div>
              <Button onClick={openCreateForm} className="gap-2 shrink-0">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Program</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    {["#", "Name", "Full Name", "Type", "Duration", "Status", ""].map((h) => (
                      <th key={h} className="h-10 px-4 text-left text-sm font-medium text-muted-foreground">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b odd:bg-background even:bg-muted/20">
                      {[40, 120, 180, 90, 80, 70, 30].map((w, j) => (
                        <td key={j} className="px-4 py-3">
                          <Skeleton height={16} width={j === 6 ? undefined : w} containerClassName={j === 6 ? "inline-flex" : undefined} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <ProgramTable
            programs={filteredPrograms}
            onEdit={openEditForm}
            onDelete={setDeletingProgram}
          />
        )}
      </main>

      <ProgramForm
        isOpen={showForm}
        onClose={closeForm}
        onSubmit={(data) => {
          if (editingProgram) {
            handleUpdate(data as UpdateProgramInput);
          } else {
            handleCreate(data as CreateProgramInput);
          }
        }}
        programData={editingProgram}
        isLoading={formIsLoading}
      />

      <AlertDialog
        open={!!deletingProgram}
        onOpenChange={() => setDeletingProgram(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Program</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deletingProgram?.name}</strong>? This action cannot be
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
              {isDeleting ? "Deleting..." : "Delete Program"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
