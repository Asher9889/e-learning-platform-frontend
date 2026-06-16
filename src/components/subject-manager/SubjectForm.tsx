import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import type { Subject } from "@/pages/Subjects/types";
import type { Program } from "@/pages/Programs/types";
import {
  createSubjectSchema,
  type CreateSubjectInput,
  type UpdateSubjectInput,
} from "@/pages/Subjects/schema/subject.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Loader2 } from "lucide-react";

interface SubjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSubjectInput | UpdateSubjectInput) => void;
  subjectData?: Subject | null;
  programs: Program[];
  isLoading?: boolean;
}

export function SubjectForm({
  isOpen,
  onClose,
  onSubmit,
  subjectData,
  programs,
  isLoading = false,
}: SubjectFormProps) {
  const isEditing = !!subjectData;

  const methods = useForm<CreateSubjectInput>({
    resolver: zodResolver(createSubjectSchema),
    mode: "onChange",
    defaultValues: {
      programId: "",
      name: "",
      description: "",
      isActive: true,
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (subjectData) {
      reset({
        programId: subjectData.programId,
        name: subjectData.name,
        description: subjectData.description ?? "",
        isActive: subjectData.isActive,
      });
    } else {
      reset({
        programId: "",
        name: "",
        description: "",
        isActive: true,
      });
    }
  }, [subjectData, reset]);

  const submitHandler = (data: CreateSubjectInput) => {
    if (isEditing && subjectData) {
      onSubmit({ id: subjectData.id, ...data });
      return;
    }
    onSubmit(data);
  };

  const handleDialogClose = () => {
    if (isLoading) return;
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-lg">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(submitHandler)} autoComplete="off">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Subject" : "Create New Subject"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update the subject information below."
                  : "Set up a new subject with its details."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>
                  Program <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={watch("programId") || undefined}
                  onValueChange={(value) =>
                    setValue("programId", value, { shouldValidate: true })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a program" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.fullName || p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.programId && (
                  <p className="text-xs text-destructive">
                    {errors.programId.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">
                  Subject Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Mathematics, Physics"
                  disabled={isLoading}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  placeholder="Brief description of the subject..."
                  disabled={isLoading}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-xs text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="isActive"
                  checked={watch("isActive")}
                  onCheckedChange={(checked) =>
                    setValue("isActive", checked, { shouldValidate: true })
                  }
                  disabled={isLoading}
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Active
                </Label>
              </div>
              {errors.isActive && (
                <p className="text-xs text-destructive">
                  {errors.isActive.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleDialogClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? "Update Subject" : "Create Subject"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
