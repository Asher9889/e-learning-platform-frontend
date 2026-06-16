import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import type { Batch } from "@/pages/Batches/types";
import { ACADEMIC_SESSIONS } from "@/pages/Batches/types";
import type { Program } from "@/pages/Programs/types";
import {
  createBatchSchema,
  type CreateBatchInput,
  type UpdateBatchInput,
} from "@/pages/Batches/schema/batch.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface BatchFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBatchInput | UpdateBatchInput) => void;
  batchData?: Batch | null;
  programs: Program[];
  isLoading?: boolean;
}

export function BatchForm({
  isOpen,
  onClose,
  onSubmit,
  batchData,
  programs,
  isLoading = false,
}: BatchFormProps) {
  const isEditing = !!batchData;

  const methods = useForm<CreateBatchInput>({
    resolver: zodResolver(createBatchSchema),
    mode: "onChange",
    defaultValues: {
      programId: "",
      academicSession: "",
      name: "",
      maxStudents: undefined,
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
    if (batchData) {
      reset({
        programId: batchData.programId,
        academicSession: batchData.academicSession,
        name: batchData.name,
        maxStudents: batchData.maxStudents ?? undefined,
        isActive: batchData.isActive,
      });
    } else {
      reset({
        programId: "",
        academicSession: "",
        name: "",
        maxStudents: undefined,
        isActive: true,
      });
    }
  }, [batchData, reset]);

  const submitHandler = (data: CreateBatchInput) => {
    if (isEditing && batchData) {
      onSubmit({ id: batchData.id, ...data });
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
                {isEditing ? "Edit Batch" : "Create New Batch"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update the batch information below."
                  : "Set up a new batch with its details."}
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

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>
                    Academic Session{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={watch("academicSession") || undefined}
                    onValueChange={(value) =>
                      setValue("academicSession", value, {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select session" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACADEMIC_SESSIONS.map((session) => (
                        <SelectItem key={session} value={session}>
                          {session}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.academicSession && (
                    <p className="text-xs text-destructive">
                      {errors.academicSession.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="maxStudents">Max Students</Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    min={0}
                    placeholder="e.g. 60"
                    disabled={isLoading}
                    {...register("maxStudents")}
                  />
                  {errors.maxStudents && (
                    <p className="text-xs text-destructive">
                      {errors.maxStudents.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">
                  Batch Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Batch A, Morning Batch"
                  disabled={isLoading}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
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
                {isEditing ? "Update Batch" : "Create Batch"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
