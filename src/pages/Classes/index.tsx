import { useState } from "react";
import { type Class } from "@/pages/Classes/types/index";
import { ClassList } from "@/components/class-manager/ClassList";
import { ClassForm } from "@/components/class-manager/ClassForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClasses, useCreateClass, useUpdateClass, useDeleteClass } from "@/pages/Classes/hooks/useClasses";
import { Plus, Search, GraduationCap, Loader2 } from "lucide-react";
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

export default function ClassManager() {
  const { data: classes = [], isLoading } = useClasses();
  const createClass = useCreateClass();
  const updateClass = useUpdateClass();
  const deleteClass = useDeleteClass();

  const [searchQuery, setSearchQuery] = useState("");
  const [showClassForm, setShowClassForm] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [deletingClass, setDeletingClass] = useState<Class | null>(null);

  const filteredClasses = classes.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.academicYear.includes(searchQuery)
  );

  const totalStudents = classes.reduce((sum, c) => sum + c.totalStrength, 0);
  const totalSections = classes.reduce((sum, c) => sum + c.sections.length, 0);

  const handleCreateClass = (data: { name: string; description: string; grade: string; academicYear: string }) => {
    createClass.mutate(data, {
      onSuccess: () => setShowClassForm(false),
    });
  };

  const handleUpdateClass = (data: { id: string; name: string; description: string; grade: string; academicYear: string }) => {
    updateClass.mutate(data, {
      onSuccess: () => setEditingClass(null),
    });
  };

  const handleDeleteClass = () => {
    if (!deletingClass) return;
    deleteClass.mutate(deletingClass.id, {
      onSuccess: () => setDeletingClass(null),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Class Manager</h1>
                <p className="text-xs text-muted-foreground">
                  {classes.length} {classes.length === 1 ? "class" : "classes"} · {totalSections} {totalSections === 1 ? "section" : "sections"} · {totalStudents} {totalStudents === 1 ? "student" : "students"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search classes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Button onClick={() => setShowClassForm(true)} className="gap-2 shrink-0">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Class</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading && !classes.length ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ClassList
            classes={filteredClasses}
            onEditClass={setEditingClass}
            onDeleteClass={setDeletingClass}
            onCreateClass={() => setShowClassForm(true)}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Create/Edit Class Dialog */}
      <ClassForm
        isOpen={showClassForm || !!editingClass}
        onClose={() => {
          setShowClassForm(false);
          setEditingClass(null);
        }}
        onSubmit={editingClass ? handleUpdateClass : handleCreateClass}
        classData={editingClass}
        isLoading={createClass.isPending || updateClass.isPending}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingClass} onOpenChange={() => setDeletingClass(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Class</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deletingClass?.name}</strong>?
              This will also delete all {deletingClass?.sections.length} section(s) and remove {deletingClass?.totalStrength} students. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteClass.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClass}
              disabled={deleteClass.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteClass.isPending ? "Deleting..." : "Delete Class"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
