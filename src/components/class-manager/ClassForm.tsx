import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import type {
  Class,
} from "@/pages/Classes/types";

import {
  createClassSchema,
  
  type ClassFormData,
  type CreateClassInput,
  type UpdateClassInput,
} from "@/pages/Classes/schema/class.schema";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Loader2 } from "lucide-react";

interface ClassFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClassInput | UpdateClassInput) => void;
  classData?: Class | null;
  isLoading?: boolean;
}

const GRADES = [
  "1st Grade",
  "2nd Grade",
  "3rd Grade",
  "4th Grade",
  "5th Grade",
  "6th Grade",
  "7th Grade",
  "8th Grade",
  "9th Grade",
  "10th Grade",
  "11th Grade",
  "12th Grade",
  "Undergraduate",
  "Postgraduate",
];

const ACADEMIC_YEARS = [
  "2024-2025",
  "2025-2026",
  "2026-2027",
  "2027-2028",
];

export function ClassForm({
  isOpen,
  onClose,
  onSubmit,
  classData,
  isLoading = false,
}: ClassFormProps) {
  const isEditing = !!classData;


  const methods = useForm<CreateClassInput>({
    resolver: zodResolver(createClassSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      grade: "",
      academicYear: "",
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
    if (classData) {
      reset({
        name: classData.name,
        description: classData.description,
        grade: classData.grade,
        academicYear: classData.academicYear,
      });
    } else {
      reset({
        name: "",
        description: "",
        grade: "",
        academicYear: "",
      });
    }
  }, [classData, reset]);

  const submitHandler = (data: ClassFormData) => {

    console.log(data,"classes data")
    // await createClassAsync(values)
    if (isEditing && classData) {
      onSubmit({
        id: classData.id,
        ...data,
      });
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
          <form
            onSubmit={handleSubmit(submitHandler, (errors) => {
              console.log("ERRORS:", errors);
            })}
            autoComplete="off"
          >
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Class" : "Create New Class"}
              </DialogTitle>

              <DialogDescription>
                {isEditing
                  ? "Update the class information below."
                  : "Set up a new class with its basic details."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Name */}

              <div className="grid gap-2">
                <Label htmlFor="name">
                  Class Name <span className="text-destructive">*</span>
                </Label>

                <Input
                  id="name"
                  placeholder="Computer Science"
                  disabled={isLoading}
                  {...register("name")}
                />

                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Grade */}

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>
                    Grade <span className="text-destructive">*</span>
                  </Label>

                  <Select
                    value={watch("grade")}
                    onValueChange={(value) =>
                      setValue("grade", value, {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Grade" />
                    </SelectTrigger>

                    <SelectContent>
                      {GRADES.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {errors.grade && (
                    <p className="text-xs text-destructive">
                      {errors.grade.message}
                    </p>
                  )}
                </div>

                {/* Academic Year */}

                <div className="grid gap-2">
                  <Label>
                    Academic Year{" "}
                    <span className="text-destructive">*</span>
                  </Label>

                  <Select
                    value={watch("academicYear")}
                    onValueChange={(value) =>
                      setValue("academicYear", value, {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>

                    <SelectContent>
                      {ACADEMIC_YEARS.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {errors.academicYear && (
                    <p className="text-xs text-destructive">
                      {errors.academicYear.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}

              <div className="grid gap-2">
                <Label htmlFor="description">
                  Description
                </Label>

                <Textarea
                  id="description"
                  rows={3}
                  placeholder="Brief description..."
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
                  ? "Update Class"
                  : "Create Class"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}