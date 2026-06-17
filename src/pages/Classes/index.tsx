import { useState } from "react";
import { type Class } from "@/pages/Classes/types/index";
import { ClassList } from "@/components/class-manager/ClassList";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { useClasses } from "@/pages/Classes/hooks/useClasses";
import { Plus, Search, GraduationCap, Loader2, BookOpen } from "lucide-react";
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
import type { ClassFormData } from "./schema/class.schema";
import { useCreateClass } from "./hooks/useCreateClass";
import { useGetClasses } from "./hooks/useGetClasses";
import { useUpdateClass } from "./hooks/useUpdateClass";
import { useDeleteClass } from "./hooks/useDeleteClass";
import { SubjectForm } from "#components/class-manager/SubjectForm";
import { GradeForm } from "#components/class-manager/GradeForm";
import { Tabs, TabsList, TabsTrigger } from "#components/ui/tabs";
import { useCreateGrade } from "./hooks/useCreateGrade";
import { type CreateGradeInput, type Grade, type UpdateGrade } from "./schema/grade.schema";
import { ClassesTable } from "#components/class/ClassesTable";
import { useGetGrades } from "./hooks/useGetGrades";
import { useUpdateGrade } from "./hooks/useUpdateGrade";
import { useDeleteGrade } from "./hooks/useDeleteGrade";

export default function ClassManager() {
  // const { data: classes = [], isLoading } = useClasses();
  const {
    data,
    isLoading,
    // error,
    // refetch,
  } = useGetClasses();
  const classes = data?.classes || [];
  console.log(classes, "classes")
  // const createClass = useCreateClass();
  // const updateClass = useUpdateClass();
  // const deleteClass = useDeleteClass();
  const {
    data: gradeData

  } = useGetGrades();
  const grades: Grade[] = gradeData?.grades || [];
  const {
    createClassAsync,
    isCreating,
  } = useCreateClass();
  console.log(gradeData, "gradeDatagrades", grades)
  const { createGradeAsync } = useCreateGrade()
  const {
    updateClassAsync,
    // isUpdating: isUpdatingClass,
  } = useUpdateClass();
    const {
    updateGradeAsync,
    // isUpdating: isUpdatingClass,
    
  } = useUpdateGrade();
   const {
    deleteGradeAsync,
    // isDeleting,
  } = useDeleteGrade();
  const {
    deleteClassAsync,
    isDeleting,
  } = useDeleteClass();
  const [searchQuery, setSearchQuery] = useState("");
  const [showClassForm, setShowClassForm] = useState(false);
  const [showGradeForm, setShowGradeForm] = useState(false);
  const [editinggrade,setEditingGrade] = useState<Grade | null>(null)
  const [_,setDeletingGrade] =  useState<Grade | null>(null)
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [deletingClass, setDeletingClass] = useState<Class | null>(null);
  const [activeTab, setActiveTab] = useState("subjects");
  const filteredClasses = classes?.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.academicYear.includes(searchQuery)
  );

  const totalStudents = classes?.reduce((sum, c) => sum + c.totalStrength, 0);
  const totalSections = classes?.reduce((sum, c) => sum + c.sections.length, 0);

  const handleCreateClass = async (data: ClassFormData) => {
    const response = await createClassAsync(data);
    console.log(response, "response")
    if (response) setShowClassForm(false);

  };

  const handleCreateGrade = async (data: CreateGradeInput) => {
    const response = await createGradeAsync(data);
    console.log(response, "response")
    if (response) setShowGradeForm(false);

  };

 const handleUpdateGrade = async (data: UpdateGrade) => {
    const response = await updateGradeAsync(data);
    console.log(response, "response")
    if (response) {
      setEditingGrade(null);
      setShowGradeForm(false);
    }

  };
  
   const handleDeleteGrade = async (grade: Grade) => {
    if (!grade) return;

    try {
      const response =
        await deleteGradeAsync(grade?.id);

      console.log(response);

      setDeletingGrade(null);
    } catch (error) {
      console.error(error);
    }
    // deleteClass.mutate(deletingClass.id, {
    //   onSuccess: () => setDeletingClass(null),
    // });
  };
  console.log(editingClass, "editingClasseditingClasseditingClasseditingClass")

  const handleUpdateClass = async (data: ClassFormData) => {
    if (!editingClass) return;
    console.log(editingClass, "editingClass")
    const response = await updateClassAsync({
      ...data,
      id: editingClass.id,
    });
    console.log(response, "response handleUpdateClass")
    if (response) { setEditingClass(null); };

  };

  const handleDeleteClass = async () => {
    if (!deletingClass) return;

    console.log(deletingClass, "deletingClassdeletingClass")
    try {
      const response =
        await deleteClassAsync(deletingClass?.id);

      console.log(response);

      setDeletingClass(null);
    } catch (error) {
      console.error(error);
    }
    // deleteClass.mutate(deletingClass.id, {
    //   onSuccess: () => setDeletingClass(null),
    // });
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
                <h1 className="text-xl font-bold text-foreground">Academics Manager</h1>
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
                <span className="hidden sm:inline">New Subject</span>
              </Button>
              <Button onClick={() => { setShowGradeForm(true) }} className="gap-2 shrink-0">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Class</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="px-4 py-4"
        >
          <TabsList className="h-auto rounded-xl border bg-muted/40 p-1">
            <TabsTrigger
              value="subjects"
              className="
      gap-2
      rounded-lg
      px-5
      py-2
      transition-all
      duration-300
      data-[state=active]:bg-background
      data-[state=active]:shadow-sm
    "
            >
              <BookOpen className="h-4 w-4" />
              Subjects
            </TabsTrigger>

            <TabsTrigger
              value="classes"
              className="
      gap-2
      rounded-lg
      px-5
      py-2
      transition-all
      duration-300
      data-[state=active]:bg-background
      data-[state=active]:shadow-sm
    "
            >
              <GraduationCap className="h-4 w-4" />
              Classes
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {/* Main Content */}
      {activeTab === "subjects" ? <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
      </main> : <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!classes.length ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (<ClassesTable
          grades={grades}
          onEdit={(grade) => {
            setEditingGrade(grade);
            setShowGradeForm(true)
          }}
          onDelete={(grade) => {
            handleDeleteGrade(grade);
          }}
        />)}</main>}

 {/* isOpen,
  onClose,
  onSubmit,
  gradeData,
  isLoading = false, */}
      <GradeForm
        isOpen={showGradeForm}
        onClose={() => {
          setShowGradeForm(false)
        }}
        onSubmit={(data) => {
          if(editinggrade){
          handleUpdateGrade({...data,id:editinggrade?.id})

          }else{
          handleCreateGrade(data)
          }

        }}
        gradeData={editinggrade}
      />

      {/* Create/Edit Class Dialog */}
      <SubjectForm
        isOpen={showClassForm || !!editingClass}
        onClose={() => {
          setShowClassForm(false);
          setEditingClass(null);
        }}
        onSubmit={(data) => {
          console.log(data, "editingClasseditingClasseditingClasseditingClass")
          if (editingClass) {
            handleUpdateClass(data)
          } else {
            handleCreateClass(data)
          }
        }}
        classData={editingClass}
        isLoading={isCreating}
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
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClass}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Class"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}