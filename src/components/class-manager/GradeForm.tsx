import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createGradeSchema, type CreateGradeInput } from "@/pages/Classes/schema/grade.schema";



interface Grade {
  id: string;
  name: string;
  description?: string;
}

interface GradeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGradeInput) => void;
  gradeData?: Grade | null;
  isLoading?: boolean;
}

export function GradeForm({
  isOpen,
  onClose,
  onSubmit,
  gradeData,
  isLoading = false,
}: GradeFormProps) {
  const isEditing = !!gradeData;

  const methods = useForm<CreateGradeInput>({
    resolver: zodResolver(createGradeSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (gradeData) {
      reset({
        name: gradeData.name,
        description: gradeData.description ?? "",
      });
    } else {
      reset({
        name: "",
        description: "",
      });
    }
  }, [gradeData, reset]);

  const submitHandler = (data: CreateGradeInput) => {
    onSubmit(data);
  };

  const handleDialogClose = () => {
    if (isLoading) return;

    reset();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleDialogClose}
    >
      <DialogContent className="sm:max-w-md">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(submitHandler)}>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Grade" : "Create Grade"}
              </DialogTitle>

              <DialogDescription>
                {isEditing
                  ? "Update grade details."
                  : "Create a new grade for academic management."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">
                  Grade Name
                  <span className="text-destructive">*</span>
                </Label>

                <Input
                  id="name"
                  placeholder="10th Grade"
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
                <Label htmlFor="description">
                  Description
                </Label>

                <Textarea
                  id="description"
                  rows={3}
                  placeholder="Optional description..."
                  disabled={isLoading}
                  {...register("description")}
                />

                {errors.description && (
                  <p className="text-xs text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>
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

              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}

                {isEditing
                  ? "Update Grade"
                  : "Create Grade"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}