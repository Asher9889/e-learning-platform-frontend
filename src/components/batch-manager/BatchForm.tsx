import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import type { Batch } from "@/pages/Batches/types";
import { ACADEMIC_SESSIONS } from "@/pages/Batches/types";
import type { Program } from "@/pages/Programs/types";

import {
  createBatchSchema,
  type CreateBatchInput,
  type UpdateBatchInput,
  type BatchFormValues,
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


import {
  Check,
  ChevronsUpDown,
  Loader2,
  Search,
} from "lucide-react";

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

  const [programOpen, setProgramOpen] = useState(false);
  const [programSearch, setProgramSearch] = useState("");

  const methods = useForm<BatchFormValues>({
    resolver: zodResolver(createBatchSchema),
    mode: "onSubmit",
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
        programId: batchData.program?.id,
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

    setProgramSearch("");
  }, [batchData, reset]);

  const submitHandler = (data: BatchFormValues) => {
    if (isEditing && batchData) {
      onSubmit({
        id: batchData.id,
        ...data,
      } as CreateBatchInput);

      return;
    }

    onSubmit(data as CreateBatchInput);

    reset({
      programId: "",
      academicSession: "",
      name: "",
      maxStudents: undefined,
      isActive: true,
    });

    setProgramSearch("");
  };

  const handleDialogClose = () => {
    if (isLoading) return;

    setProgramOpen(false);
    setProgramSearch("");
    onClose();
  };

  const selectedProgram = programs.find(
    (program) => program.id === watch("programId")
  );

  const filteredPrograms = programs.filter((program) => {
    const programName = program.fullName || program.name;

    return programName
      .toLowerCase()
      .includes(programSearch.toLowerCase());
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-lg">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(submitHandler)}
            autoComplete="off"
          >
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
              {/* Program */}
              <div className="grid gap-2">
                <Label>
                  Program <span className="text-destructive">*</span>
                </Label>

                <div className="relative">
                  {/* Program Selector */}
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={programOpen}
                    disabled={isEditing || isLoading}
                    className="w-full justify-between font-normal"
                    onClick={() => {
                      setProgramOpen((prev) => !prev);
                      setProgramSearch("");
                    }}
                  >
                    <span className="truncate">
                      {selectedProgram
                        ? selectedProgram.fullName || selectedProgram.name
                        : "Select a program"}
                    </span>

                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>

                  {/* Program Dropdown */}
                  {programOpen && !isEditing && (
                    <div className="absolute left-0 right-0 top-full z-[100] mt-1 rounded-md border bg-background p-2 shadow-lg">

                      {/* Search Input */}
                      <div className="relative mb-2">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                          type="text"
                          value={programSearch}
                          onChange={(event) => {
                            setProgramSearch(event.target.value);
                          }}
                          placeholder="Search programs..."
                          className="pl-9"
                          autoComplete="off"
                        />
                      </div>

                      {/* Program List */}
                      <div className="max-h-60 overflow-y-auto">
                        {filteredPrograms.length === 0 ? (
                          <div className="py-6 text-center text-sm text-muted-foreground">
                            No program found.
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {filteredPrograms.map((program) => {
                              const programName =
                                program.fullName || program.name;

                              const isSelected =
                                watch("programId") === program.id;

                              return (
                                <button
                                  key={program.id}
                                  type="button"
                                  onClick={() => {
                                    setValue("programId", program.id, {
                                      shouldValidate: true,
                                      shouldDirty: true,
                                    });

                                    setProgramOpen(false);
                                    setProgramSearch("");
                                  }}
                                  className="flex w-full items-center rounded-md px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 shrink-0 ${isSelected
                                        ? "opacity-100"
                                        : "opacity-0"
                                      }`}
                                  />

                                  <span className="truncate">
                                    {programName}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {errors.programId && (
                  <p className="text-xs text-destructive">
                    {errors.programId.message}
                  </p>
                )}
              </div>

              {/* Academic Session + Max Students */}
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
                        <SelectItem
                          key={session}
                          value={session}
                        >
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
                  <Label htmlFor="maxStudents">
                    Max Students
                  </Label>

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

              {/* Batch Name */}
              <div className="grid gap-2">
                <Label htmlFor="name">
                  Batch Name{" "}
                  <span className="text-destructive">*</span>
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

              {/* Active */}
              <div className="flex items-center gap-3">
                <Switch
                  id="isActive"
                  checked={watch("isActive")}
                  onCheckedChange={(checked) =>
                    setValue("isActive", checked, {
                      shouldValidate: true,
                    })
                  }
                  disabled={isLoading}
                />

                <Label
                  htmlFor="isActive"
                  className="cursor-pointer"
                >
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