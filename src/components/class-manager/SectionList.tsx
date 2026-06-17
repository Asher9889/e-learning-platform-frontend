import { useState } from "react";
import type { Section } from "@/pages/Classes/types/index";
import { SectionCard } from "./SectionCard";
import { SectionForm } from "./SectionForm";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Plus, Users } from "lucide-react";
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
import type { CreateSectionInput, UpdateSectionInput } from "@/pages/Classes/schema/class.schema";
import { useCreateSection } from "@/pages/Classes/hooks/useCreateSection";
import { useUpdateSection } from "@/pages/Classes/hooks/useUpdateSection";
import { useDeleteSection } from "@/pages/Classes/hooks/useDeleteSection";

interface SectionListProps {
  sections: Section[];
  classId: string;
}

export function SectionList({ sections, classId }: SectionListProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [deletingSection, setDeletingSection] = useState<Section | null>(null);
  console.log(sections,"sectionssections",classId,"editingSection",editingSection)
const {
  createSectionAsync,
  isCreating,
} = useCreateSection();
const {
  updateSectionAsync,
  isUpdating,
} = useUpdateSection();
const {
  deleteSectionAsync,
  isDeleting,
} = useDeleteSection();
console.log(isDeleting,"isDeleting")
  const handleCreate = async (data: CreateSectionInput) => {
   console.log("response",data)

    const response = await createSectionAsync(data);
     if(response){
     setEditingSection(null);
   }
   console.log(response,"response",data)
    // createSection.mutate(data, {
    //   onSuccess: () => {
    //     setShowForm(false);
    //   },
    // });
  };

  const handleUpdate = async (data: UpdateSectionInput) => {
    console.log(data,"handleUpdate updateSection")
    const response = await updateSectionAsync(data);
   console.log(response,"response",data)
   if(response){
     setEditingSection(null);
   }
    // updateSection.mutate(data, {
    //   onSuccess: () => {
    //     setEditingSection(null);
    //   },
    // });
  };


  const handleDelete = async() => {
    if (!deletingSection) return;
    console.log(deletingSection,"deletingSectiondeletingSectiondeletingSection",classId)
    await deleteSectionAsync({
    classId: classId,
    id: deletingSection._id,
  });

  setDeletingSection(null);
    // deleteSection.mutate(
    //   { classId, sectionId: deletingSection.id },
    //   {
    //     onSuccess: () => {
    //       setDeletingSection(null);
    //     },
    //   }
    // );
  };

  return (
    <div className="mt-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-3">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
              <Users className="h-4 w-4" />
              <span className="font-medium">{sections.length} {sections.length === 1 ? "Section" : "Sections"}</span>
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen ? "" : "-rotate-90")} />
            </Button>
          </CollapsibleTrigger>

          <Button variant="ghost" size="sm" onClick={() => setShowForm(true)} className="gap-1">
            <Plus className="h-3.5 w-3.5" />
            Add Section
          </Button>
        </div>

        <CollapsibleContent>
          <div className="space-y-2 pl-2">
            {sections.map((section) => (
              <SectionCard
                key={section._id}
                section={section}
                onEdit={setEditingSection}
                onDelete={setDeletingSection}
              />
            ))}

            {sections.length === 0 && (
              <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-lg">
                No sections yet. Click "Add Section" to create one.
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Create/Edit Section Dialog */}
      <SectionForm
        isOpen={showForm || !!editingSection}
        onClose={() => {
          setShowForm(false);
          setEditingSection(null);
        }}
        onSubmit={async (data) => {
          if (editingSection) {
            await handleUpdate(data as UpdateSectionInput);
          } else {
            await handleCreate(data as CreateSectionInput);
          }
        }}
        classId={classId}
        section={editingSection}
        isLoading={isCreating || isUpdating}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingSection} onOpenChange={() => setDeletingSection(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Section</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deletingSection?.name}</strong>? 
              This will remove {deletingSection?.strength} students from the class total. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Section"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
