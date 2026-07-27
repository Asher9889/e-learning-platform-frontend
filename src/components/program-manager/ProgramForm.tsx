import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useFieldArray, type Resolver } from "react-hook-form";

import type { Program, ProgramType } from "@/pages/Programs/types";
import {
  programFormSchema,
  PROGRAM_TYPE_OPTIONS,
  PROGRAM_MODE_OPTIONS,
  PROGRAM_FEE_TYPE_OPTIONS,
  type CreateProgramInput,
  type UpdateProgramInput,
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

import { Loader2, Plus, Trash2 } from "lucide-react";
import { ThumbnailUpload } from "./ThumbnailUpload";
import { useUploadAvatar } from "@/pages/Teacher/hooks/useUploadAvtar";
import { sileo } from "sileo";

interface ProgramFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateProgramInput | UpdateProgramInput,
    thumbnailFile: File | null
  ) => void;
  programData?: Program | null;
  isLoading?: boolean;
}

const DEFAULT_VALUES: CreateProgramInput = {
  name: "",
  fullName: "",
  programType: undefined as unknown as CreateProgramInput["programType"],
  thumbnail: "",
  description: "",
  durationMonths: undefined as unknown as number,
  mode: undefined as unknown as CreateProgramInput["mode"],
  feeAmount: undefined as unknown as number,
  feeType: undefined as unknown as CreateProgramInput["feeType"],
  featured: false,
  benefits: [],
  isActive: true,
};

const PLACEHOLDERS: Record<ProgramType, { name: string; fullName: string }> = {
  SCHOOL: {
    name: "e.g. Class 10, Class 12",
    fullName: "e.g. Secondary School Program",
  },
  DIPLOMA: {
    name: "e.g. Diploma in Engineering",
    fullName: "e.g. Polytechnic Diploma Program",
  },
  UNDERGRADUATE: {
    name: "e.g. BCA, B.Tech, B.Sc",
    fullName: "e.g. Bachelor of Computer Applications",
  },
  POSTGRADUATE: {
    name: "e.g. MCA, MBA, M.Sc",
    fullName: "e.g. Master of Computer Applications",
  },
  PROFESSIONAL: {
    name: "e.g. CA, CS, CMA",
    fullName: "e.g. Professional Certification Program",
  },
};

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5 pb-4">
      <Label>
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      <div className="relative">
        {children}
        {error && (
          <p className="absolute top-full left-0 pt-1 text-xs text-destructive">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export function ProgramForm({
  isOpen,
  onClose,
  onSubmit,
  programData,
  isLoading = false,
}: ProgramFormProps) {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const isEditing = !!programData;
  const { uploadAvatarAsync } = useUploadAvatar();

  const methods = useForm<CreateProgramInput>({
    resolver: zodResolver(programFormSchema) as unknown as Resolver<CreateProgramInput>,
    mode: "onChange",
    defaultValues: DEFAULT_VALUES,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = methods;

  const programType = watch("programType");
  const placeholder = programType ? PLACEHOLDERS[programType] : undefined;

  const {fields: benefitFields, append: appendBenefit, remove: removeBenefit } = useFieldArray({ control: control, name: "benefits" as never} as any);

  const handleThumbnailChange = useCallback(
    async (file: { file: File | { url: string; id: string } } | null) => {
      const uploadedFile = file?.file;

      if (uploadedFile instanceof File) {
        setIsUploading(true);
        try {
          const response = await uploadAvatarAsync(uploadedFile);
          if (response?.key) {
            setValue("thumbnail", response.key, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }
          if (response?.url) {
            setThumbnailFile(response.url);
          }
        } catch (err: any) {
          setValue("thumbnail", "", {
            shouldDirty: true,
            shouldValidate: true,
          });
          setThumbnailFile(null);
          const message =
            err?.response?.data?.message ||
            err?.message ||
            "Avatar upload failed. Only JPEG, PNG, and WEBP are allowed.";
          sileo.error({ title: "Upload Failed", description: message });
        } finally {
          setIsUploading(false);
        }
      } else if (!file) {
        setValue("thumbnail", "", {
          shouldDirty: true,
          shouldValidate: true,
        });
        setThumbnailFile(null);
      }
    },
    [uploadAvatarAsync, setValue]
  );

  useEffect(() => {
    if (!isOpen) return;

    setThumbnailFile(null);
    if (programData) {
      reset({
        name: programData.name ?? "",
        fullName: programData.fullName ?? "",
        programType: programData.programType,
        thumbnail: programData.thumbnail ?? "",
        description: programData.description ?? "",
        durationMonths: programData.durationMonths ?? undefined,
        mode: programData.mode,
        feeAmount: programData.feeAmount,
        feeType: programData.feeType,
        featured: programData.featured ?? false,
        benefits: programData.benefits ?? [],
        isActive: programData.isActive,
      });
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [isOpen, programData, reset]);

  const submitHandler = (data: CreateProgramInput) => {
    const cleanedBenefits = (data.benefits ?? []).filter(
      (b) => b.trim().length > 0
    );

    const thumbnail =
      !thumbnailFile && isEditing
        ? ((programData as any)?.thumbnail ?? data.thumbnail)
        : data.thumbnail;

    const payload = { ...data, thumbnail, benefits: cleanedBenefits };

    if (isEditing && programData) {
      onSubmit({ id: programData.id, ...payload } as UpdateProgramInput, thumbnailFile);
      return;
    }

    onSubmit(payload as CreateProgramInput, thumbnailFile);
  };

  const handleDialogClose = () => {
    if (isLoading) return;
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose} >
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" onInteractOutside={(e) => e.preventDefault()}>
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

            <div className="grid gap-5 py-4">
              {/* Basic Information */}
              <div className="grid gap-4">


                <div className="grid grid-cols-2 gap-4">

                  <FormField
                    label="Program Type"
                    required
                    error={errors.programType?.message}
                  >
                    <Select
                      value={watch("programType") || undefined}
                      onValueChange={(value) =>
                        setValue("programType", value as any, {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select program category" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROGRAM_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>


                  <FormField
                    label="Program Name"
                    required
                    error={errors.name?.message}
                  >
                    <Input
                      id="name"
                      placeholder={placeholder?.name || "e.g. B.Sc., M.Sc., MBA"}
                      disabled={isLoading}
                      {...register("name")}
                    />
                  </FormField>




                </div>

                <FormField
                  label="Full Program Name"
                  required
                  error={errors.fullName?.message}
                >
                  <Input
                    id="fullName"
                    placeholder={
                      placeholder?.fullName ||
                      "e.g. Bachelor of Science in Computer Science"
                    }
                    disabled={isLoading}
                    {...register("fullName")}
                  />
                </FormField>

                <FormField label="Thumbnail">
                  <ThumbnailUpload
                    value={ thumbnailFile || (typeof watch("thumbnail") === "string" ? watch("thumbnail") : undefined)}
                    onFileChange={handleThumbnailChange}
                    isUploading={isUploading}
                  />
                </FormField>

                <FormField
                  label="Description"
                  required
                  error={errors.description?.message}
                >
                  <Textarea
                    id="description"
                    rows={3}
                    placeholder="Brief description of the program... (min 20 characters)"
                    disabled={isLoading}
                    {...register("description")}
                  />
                </FormField>
              </div>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Program Details */}
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Duration (months)"
                    required
                    error={errors.durationMonths?.message}
                  >
                    <Input
                      id="durationMonths"
                      type="number"
                      min={1}
                      placeholder="e.g. 48"
                      disabled={isLoading}
                      {...register("durationMonths", { valueAsNumber: true })}
                    />
                  </FormField>

                  <FormField
                    label="Mode"
                    required
                    error={errors.mode?.message}
                  >
                    <Select
                      value={watch("mode") || undefined}
                      onValueChange={(value) =>
                        setValue("mode", value as any, {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROGRAM_MODE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Fee Amount"
                    required
                    error={errors.feeAmount?.message}
                  >
                    <Input
                      id="feeAmount"
                      type="number"
                      min={1}
                      max={500000}
                      step="1"
                      placeholder="e.g. 50000"
                      disabled={isLoading}
                      {...register("feeAmount", { valueAsNumber: true })}
                    />
                  </FormField>

                  <FormField
                    label="Fee Type"
                    required
                    error={errors.feeType?.message}
                  >
                    <Select
                      value={watch("feeType") || ""}
                      onValueChange={(value) =>
                        setValue("feeType", value as any, {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select fee type" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROGRAM_FEE_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Benefits */}
              <div className="grid gap-3">
                <Label>Benefits</Label>
                <div className="flex flex-col gap-2">
                  {benefitFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Input
                        placeholder={`Benefit ${index + 1}`}
                        disabled={isLoading}
                        {...register(`benefits.${index}`)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={isLoading}
                        onClick={() => removeBenefit(index)}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-fit"
                    disabled={isLoading}
                    onClick={() => appendBenefit("")}
                  >
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Add Benefit
                  </Button>
                </div>
                {errors.benefits && (
                  <p className="text-xs text-destructive">
                    {(errors.benefits as any)?.message ||
                      "Please check benefit entries"}
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Status Toggles */}
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <Switch
                    id="featured"
                    checked={watch("featured")}
                    onCheckedChange={(checked) =>
                      setValue("featured", checked, { shouldValidate: true })
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor="featured" className="cursor-pointer">
                    Featured
                  </Label>
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
              <Button type="submit" disabled={isLoading || isSubmitting}>
                {(isLoading || isSubmitting) && (
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
