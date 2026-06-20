import { useState } from "react";
import { Search, Plus, Layers } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import type { Batch } from "./types";
import type {
  CreateBatchInput,
  UpdateBatchInput,
} from "./schema/batch.schema";
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

import { useGetBatches } from "./hooks/useGetBatches";
import { useCreateBatch } from "./hooks/useCreateBatch";
import { useUpdateBatch } from "./hooks/useUpdateBatch";
import { useDeleteBatch } from "./hooks/useDeleteBatch";
import { useGetPrograms } from "@/pages/Programs/hooks/useGetPrograms";
import { BatchForm } from "#components/batch-manager/BatchForm";
import { BatchTable } from "#components/batch-manager/BatchTable";

export default function BatchesPage() {
  const { data: batchData, isLoading } = useGetBatches();
  const { data: programData } = useGetPrograms();
  const batches: Batch[] = batchData?.batches ?? [];
  const programs: Program[] = programData?.programs ?? [];

  const { createBatchAsync, isCreating } = useCreateBatch();
  const { updateBatchAsync, isUpdating } = useUpdateBatch();
  const { deleteBatchAsync, isDeleting } = useDeleteBatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [deletingBatch, setDeletingBatch] = useState<Batch | null>(null);

  const filteredBatches = batches.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      b.academicSession.toLowerCase().includes(q)
    );
  });

  const handleCreate = async (data: CreateBatchInput) => {
    const res = await createBatchAsync(data);
    if (res) setShowForm(false);
  };

  const handleUpdate = async (data: UpdateBatchInput) => {
    const res = await updateBatchAsync(data);
    if (res) {
      setEditingBatch(null);
      setShowForm(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingBatch) return;
    try {
      await deleteBatchAsync(deletingBatch.id);
      setDeletingBatch(null);
    } catch {
      /* toast handles it */
    }
  };

  const openCreateForm = () => {
    setEditingBatch(null);
    setShowForm(true);
  };

  const openEditForm = (batch: Batch) => {
    setEditingBatch(batch);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingBatch(null);
  };

  const formIsLoading = isCreating || isUpdating;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Batches</h1>
                <p className="text-xs text-muted-foreground">
                  {batches.length}{" "}
                  {batches.length === 1 ? "batch" : "batches"} total
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search batches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-9"
                />
              </div>
              <Button onClick={openCreateForm} className="gap-2 shrink-0">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Batch</span>
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
                    {["#", "Name", "Program", "Session", "Max Students", "Status", ""].map((h) => (
                      <th key={h} className="h-10 px-4 text-left text-sm font-medium text-muted-foreground">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b odd:bg-background even:bg-muted/20">
                      {[40, 120, 140, 90, 80, 70, 30].map((w, j) => (
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
          <BatchTable
            batches={filteredBatches}
            onEdit={openEditForm}
            onDelete={setDeletingBatch}
          />
        )}
      </main>

      <BatchForm
        isOpen={showForm}
        onClose={closeForm}
        onSubmit={(data) => {
          if (editingBatch) {
            handleUpdate(data as UpdateBatchInput);
          } else {
            handleCreate(data as CreateBatchInput);
          }
        }}
        batchData={editingBatch}
        programs={programs}
        isLoading={formIsLoading}
      />

      <AlertDialog
        open={!!deletingBatch}
        onOpenChange={() => setDeletingBatch(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Batch</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deletingBatch?.name}</strong>? This action cannot be
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
              {isDeleting ? "Deleting..." : "Delete Batch"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
