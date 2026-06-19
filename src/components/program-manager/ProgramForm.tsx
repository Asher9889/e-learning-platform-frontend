import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import type { Program } from "@/pages/Programs/types";
import { PROGRAM_TYPES, HIGHER_ED_TYPES } from "@/pages/Programs/types";
import {
  createProgramSchema,
  type CreateProgramInput,
  type UpdateProgramInput,
  type ProgramFormValues,
} from "@/pages/Programs/schema/program.schema";

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

interface ProgramFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProgramInput | UpdateProgramInput) => void;
  programData?: Program | null;
  isLoading?: boolean;
}

export function ProgramForm({
  isOpen,
  onClose,
  onSubmit,
  programData,
  isLoading = false,
}: ProgramFormProps) {
  const isEditing = !!programData;

  const methods = useForm<ProgramFormValues>({
    resolver: zodResolver(createProgramSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      programType: undefined,
      fullName: "",
      description: "",
      durationMonths: undefined,
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

  const programType = watch("programType");
  const showHigherEdFields = programType
    ? HIGHER_ED_TYPES.includes(programType)
    : false;

 useEffect(() => {
  if (!isOpen) return;

  if (programData) {
    reset({
      name: programData.name,
      programType: programData.programType,
      fullName: programData.fullName ?? "",
      description: programData.description ?? "",
      durationMonths: programData.durationMonths ?? undefined,
      isActive: programData.isActive,
    });
  } else {
    reset({
      name: "",
      programType: undefined,
      fullName: "",
      description: "",
      durationMonths: undefined,
      isActive: true,
    });
  }
}, [isOpen, programData, reset]);

  const submitHandler = (data: ProgramFormValues) => {
    if (isEditing && programData) {
      onSubmit({ id: programData.id, ...data } as CreateProgramInput);
      return;
    }
    onSubmit(data as CreateProgramInput);
  };

  const handleDialogClose = () => {
    if (isLoading) return;
    onClose();
    // reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-lg">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(submitHandler)} autoComplete="off">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Program" : "Create New Program"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update the program information below."
                  : "Set up a new program with its basic details."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">
                  Program Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. B.Sc., M.Sc., MBA"
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
                <Label>
                  Program Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={
                    watch("programType") ? watch("programType") : undefined
                  }
                  onValueChange={(value) => {
                    setValue("programType", value as any);
                    if (!HIGHER_ED_TYPES.includes(value as any)) {
                      setValue("fullName", "", { shouldValidate: true });
                      setValue("durationMonths", undefined as any, {
                        shouldValidate: true,
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select program type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROGRAM_TYPES.map((pt) => (
                      <SelectItem key={pt.value} value={pt.value}>
                        {pt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.programType && (
                  <p className="text-xs text-destructive">
                    {errors.programType.message}
                  </p>
                )}
              </div>

              {showHigherEdFields && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">
                      Full Program Name{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="e.g. Bachelor of Science in Computer Science"
                      disabled={isLoading}
                      {...register("fullName")}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-destructive">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="durationMonths">
                      Duration (months){" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="durationMonths"
                      type="number"
                      min={1}
                      max={120}
                      placeholder="e.g. 48"
                      disabled={isLoading}
                      {...register("durationMonths")}
                    />
                    {errors.durationMonths && (
                      <p className="text-xs text-destructive">
                        {errors.durationMonths.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  placeholder="Brief description of the program..."
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
                {isEditing ? "Update Program" : "Create Program"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
