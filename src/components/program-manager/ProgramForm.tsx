// import { useEffect } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { FormProvider, useForm } from "react-hook-form";

// import type { Program } from "@/pages/Programs/types";
// import { PROGRAM_TYPES, HIGHER_ED_TYPES } from "@/pages/Programs/types";
// import {
//   createProgramSchema,
//   type CreateProgramInput,
//   type UpdateProgramInput,
//   type ProgramFormValues,
// } from "@/pages/Programs/schema/program.schema";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Switch } from "@/components/ui/switch";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { Loader2 } from "lucide-react";

// interface ProgramFormProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (data: CreateProgramInput | UpdateProgramInput) => void;
//   programData?: Program | null;
//   isLoading?: boolean;
// }

// export function ProgramForm({
//   isOpen,
//   onClose,
//   onSubmit,
//   programData,
//   isLoading = false,
// }: ProgramFormProps) {
//   const isEditing = !!programData;

//   const methods = useForm<ProgramFormValues>({
//     resolver: zodResolver(createProgramSchema),
//     mode: "onSubmit",
//     defaultValues: {
//       name: "",
//       programType: undefined,
//       fullName: "",
//       description: "",
//       durationMonths: undefined,
//       isActive: true,
//     },
//   });

//   const {
//     register,
//     handleSubmit,
//     reset,
//     setValue,
//     watch,
//     formState: { errors },
//   } = methods;

//   const programType = watch("programType");
//   const showHigherEdFields = programType
//     ? HIGHER_ED_TYPES.includes(programType)
//     : false;

//  useEffect(() => {
//   if (!isOpen) return;

//   if (programData) {
//     reset({
//       name: programData.name,
//       programType: programData.programType,
//       fullName: programData.fullName ?? "",
//       description: programData.description ?? "",
//       durationMonths: programData.durationMonths ?? undefined,
//       isActive: programData.isActive,
//     });
//   } else {
//     reset({
//       name: "",
//       programType: undefined,
//       fullName: "",
//       description: "",
//       durationMonths: undefined,
//       isActive: true,
//     });
//   }
// }, [isOpen, programData, reset]);

//   const submitHandler = (data: ProgramFormValues) => {
//     if (isEditing && programData) {
//       onSubmit({ id: programData.id, ...data } as CreateProgramInput);
//       return;
//     }
//     onSubmit(data as CreateProgramInput);
//   };

//   const handleDialogClose = () => {
//     if (isLoading) return;
//     onClose();
//     // reset();
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={handleDialogClose}>
//       <DialogContent className="sm:max-w-lg">
//         <FormProvider {...methods}>
//           <form onSubmit={handleSubmit(submitHandler)} autoComplete="off">
//             <DialogHeader>
//               <DialogTitle>
//                 {isEditing ? "Edit Program" : "Create New Program"}
//               </DialogTitle>
//               <DialogDescription>
//                 {isEditing
//                   ? "Update the program information below."
//                   : "Set up a new program with its basic details."}
//               </DialogDescription>
//             </DialogHeader>

//             <div className="grid gap-4 py-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="name">
//                   Program Name <span className="text-destructive">*</span>
//                 </Label>
//                 <Input
//                   id="name"
//                   placeholder="e.g. B.Sc., M.Sc., MBA"
//                   disabled={isLoading}
//                   {...register("name")}
//                 />
//                 {errors.name && (
//                   <p className="text-xs text-destructive">
//                     {errors.name.message}
//                   </p>
//                 )}
//               </div>

//               <div className="grid gap-2">
//                 <Label>
//                   Program Type <span className="text-destructive">*</span>
//                 </Label>
//                 <Select
//                   value={
//                     watch("programType") ? watch("programType") : undefined
//                   }
//                   onValueChange={(value) => {
//                     setValue("programType", value as any);
//                     if (!HIGHER_ED_TYPES.includes(value as any)) {
//                       setValue("fullName", "", { shouldValidate: true });
//                       setValue("durationMonths", undefined as any, {
//                         shouldValidate: true,
//                       });
//                     }
//                   }}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select program type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {PROGRAM_TYPES.map((pt) => (
//                       <SelectItem key={pt.value} value={pt.value}>
//                         {pt.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {errors.programType && (
//                   <p className="text-xs text-destructive">
//                     {errors.programType.message}
//                   </p>
//                 )}
//               </div>

//               {showHigherEdFields && (
//                 <>
//                   <div className="grid gap-2">
//                     <Label htmlFor="fullName">
//                       Full Program Name{" "}
//                       <span className="text-destructive">*</span>
//                     </Label>
//                     <Input
//                       id="fullName"
//                       placeholder="e.g. Bachelor of Science in Computer Science"
//                       disabled={isLoading}
//                       {...register("fullName")}
//                     />
//                     {errors.fullName && (
//                       <p className="text-xs text-destructive">
//                         {errors.fullName.message}
//                       </p>
//                     )}
//                   </div>

//                   <div className="grid gap-2">
//                     <Label htmlFor="durationMonths">
//                       Duration (months){" "}
//                       <span className="text-destructive">*</span>
//                     </Label>
//                     <Input
//                       id="durationMonths"
//                       type="number"
//                       min={1}
//                       max={120}
//                       placeholder="e.g. 48"
//                       disabled={isLoading}
//                       {...register("durationMonths")}
//                     />
//                     {errors.durationMonths && (
//                       <p className="text-xs text-destructive">
//                         {errors.durationMonths.message}
//                       </p>
//                     )}
//                   </div>
//                 </>
//               )}

//               <div className="grid gap-2">
//                 <Label htmlFor="description">Description</Label>
//                 <Textarea
//                   id="description"
//                   rows={3}
//                   placeholder="Brief description of the program..."
//                   disabled={isLoading}
//                   {...register("description")}
//                 />
//                 {errors.description && (
//                   <p className="text-xs text-destructive">
//                     {errors.description.message}
//                   </p>
//                 )}
//               </div>

//               <div className="flex items-center gap-3">
//                 <Switch
//                   id="isActive"
//                   checked={watch("isActive")}
//                   onCheckedChange={(checked) =>
//                     setValue("isActive", checked, { shouldValidate: true })
//                   }
//                   disabled={isLoading}
//                 />
//                 <Label htmlFor="isActive" className="cursor-pointer">
//                   Active
//                 </Label>
//               </div>
//               {errors.isActive && (
//                 <p className="text-xs text-destructive">
//                   {errors.isActive.message}
//                 </p>
//               )}
//             </div>

//             <DialogFooter>
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={handleDialogClose}
//                 disabled={isLoading}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isLoading}>
//                 {isLoading && (
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 )}
//                 {isEditing ? "Update Program" : "Create Program"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </FormProvider>
//       </DialogContent>
//     </Dialog>
//   );
// }








import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useFieldArray, type Resolver } from "react-hook-form";

import type { Program } from "@/pages/Programs/types";
import {
  createProgramSchema,
  PROGRAM_CATEGORIES,
  PROGRAM_MODES,
  FEE_TYPES,
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

import { Loader2, Plus, X } from "lucide-react";
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
// Form-only shape: benefits as objects, for useFieldArray's sake
type ProgramFormShape = Omit<CreateProgramInput, "benefits"> & {
  benefits: { value: string }[];
};

const DEFAULT_VALUES: ProgramFormShape = {
  name: "",
  fullName: "",
  programType: undefined as unknown as ProgramFormShape["programType"],
  thumbnail: "",
  description: "",
  durationMonths: undefined as unknown as number,
  mode: undefined as unknown as ProgramFormShape["mode"],
  feeAmount: undefined as unknown as number,
  feeType: undefined as unknown as ProgramFormShape["feeType"],
  featured: false,
  benefits: [],
  isActive: true,
};


const PLACEHOLDERS: Record<
  "SCHOOL" | "UNDERGRADUATE" | "POSTGRADUATE" | "DOCTORATE" | "CERTIFICATION" | "COACHING",
  {
    name: string;
    fullName: string;
  }
> = {
  SCHOOL: {
    name: "e.g. Class 10, Class 12",
    fullName: "e.g. Secondary School Program",
  },

  UNDERGRADUATE: {
    name: "e.g. BCA, B.Tech, B.Sc",
    fullName: "e.g. Bachelor of Computer Applications",
  },

  POSTGRADUATE: {
    name: "e.g. MCA, MBA, M.Sc",
    fullName: "e.g. Master of Computer Applications",
  },

  DOCTORATE: {
    name: "e.g. PhD, Research Program",
    fullName: "e.g. Doctor of Philosophy Program",
  },

  CERTIFICATION: {
    name: "e.g. Data Science Certificate",
    fullName: "e.g. Professional Certification Program",
  },

  COACHING: {
    name: "e.g. JEE, NEET Coaching",
    fullName: "e.g. Competitive Exam Coaching Program",
  },
};
export function ProgramForm({
  isOpen,
  onClose,
  onSubmit,
  programData,
  isLoading = false,
}: ProgramFormProps) {
  const isEditing = !!programData;
  const {
    uploadAvatarAsync,
    // isUploading,
  } = useUploadAvatar();
  const methods = useForm<ProgramFormShape>({
    resolver: zodResolver(createProgramSchema) as unknown as Resolver<ProgramFormShape>,
    mode: "onSubmit",
    defaultValues: DEFAULT_VALUES,
  });

  const { register, handleSubmit, reset, setValue, watch, control, formState: { errors } } = methods;
  const programType = watch("programType");
  const durationInMoths = watch("durationMonths");
  const url = watch("thumbnail")
  const placeholder =
    programType ? PLACEHOLDERS[programType] : undefined;
  console.log(programType, "programType", durationInMoths, "durationInMoths", typeof durationInMoths, url)
  const { fields: benefitFields, append: appendBenefit, remove: removeBenefit } =
    useFieldArray({
      control,
      name: "benefits", // now string[] is { value: string }[] → works cleanly
    });

  // Avatar/thumbnail file ko RHF se bahar track karte hain, kyunki schema
  // mein thumbnail sirf string (URL) hai. Naya file select hone par
  // submit ke time parent ko alag se pass karte hain.
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const handleThumbnailChange = useCallback(
    async (file: { file: File | { url: string; id: string } } | null) => {
      const uploadedFile = file?.file;

      if (uploadedFile instanceof File) {
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
  // = (file: FileWithPreview | null) => {
  //   if (file && file.file instanceof File) {
  //     setThumbnailFile(file.file);
  //   } else {
  //     setThumbnailFile(null);
  //   }
  //   // URL field ko clear kar dete hain jab nayi file select ho,
  //   // taaki schema validation ke liye placeholder reh jaye; actual URL
  //   // upload ke baad parent se aayega.
  //   setValue("thumbnail", "", { shouldValidate: false });
  // };

  useEffect(() => {
    if (!isOpen) return;

    setThumbnailFile(null);

    if (programData) {
      reset({
        name: programData.name ?? "",
        fullName: programData.fullName ?? "",
        programType: programData.programType as unknown as never,
        thumbnail: programData.thumbnail ?? "",
        description: programData.description ?? "",
        durationMonths: programData.durationMonths ?? undefined,
        mode: programData.mode,
        feeAmount: programData.feeAmount,
        feeType: programData.feeType,
        featured: programData.featured ?? false,
        benefits: (programData.benefits ?? []).map((b) => ({ value: b })),
        isActive: programData.isActive,
      });
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [isOpen, programData, reset]);

  // const submitHandler = (data: ProgramFormValues) => {
  //   // empty benefit strings ko hata do submit se pehle
  //   const cleanedBenefits = (data.benefits ?? []).filter(
  //     (b) => b.trim().length > 0
  //   );

  //   // Agar naya file select nahi hua, to existing thumbnail URL retain karo
  //   // (jo programData se aaya tha), kyunki handleThumbnailChange usko clear
  //   // kar deta hai sirf jab koi naya file select hota hai.
  //   const thumbnail =
  //     !thumbnailFile && isEditing
  //       ? ((programData as any)?.thumbnail ?? data.thumbnail)
  //       : data.thumbnail;

  //   const payload = { ...data, thumbnail, benefits: cleanedBenefits };
  //   if (isEditing && programData) {
  //     onSubmit(
  //       { id: programData.id, ...payload } as UpdateProgramInput,
  //       thumbnailFile
  //     );
  //     return;
  //   }
  //   onSubmit(payload as CreateProgramInput, thumbnailFile);
  // };
  const submitHandler = (data: ProgramFormShape) => {
    const cleanedBenefits = data.benefits
      .map((b) => b.value.trim())
      .filter((v) => v.length > 0);

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
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
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

              {/* Program Type / Category */}
              <div className="grid gap-2">
                <Label>
                  Program Type <span className="text-destructive">*</span>
                </Label>
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
                    {PROGRAM_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={(cat?.toUpperCase())}>
                        {cat}
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
              {/* Name */}
              <div className="grid gap-2">
                <Label htmlFor="name">
                  Program Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder={placeholder?.name || "e.g. B.Sc., M.Sc., MBA"}
                  disabled={isLoading}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Full Name */}
              <div className="grid gap-2">
                <Label htmlFor="fullName">
                  Full Program Name{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  placeholder={
                    placeholder?.fullName ||
                    "e.g. Bachelor of Science in Computer Science"
                  }
                  disabled={isLoading}
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-xs text-destructive">
                    {errors.fullName.message}
                  </p>
                )}
              </div>



              {/* Thumbnail */}
              <div className="grid gap-2">
                <Label>Thumbnail</Label>
                <ThumbnailUpload
                  value={
                    thumbnailFile ||
                    (typeof watch("thumbnail") === "string"
                      ? watch("thumbnail")
                      : "")
                  }
                  onFileChange={handleThumbnailChange}
                  isUploading={false}
                />
                {errors.thumbnail && (
                  <p className="text-xs text-destructive">
                    {errors.thumbnail.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  rows={3}
                  placeholder="Brief description of the program... (min 20 characters)"
                  disabled={isLoading}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-xs text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Duration + Mode */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="durationMonths">
                    Duration <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="durationMonths"
                    type="number"
                    min={1}
                    placeholder="e.g. 48 months"
                    disabled={isLoading}
                    {...register("durationMonths", { valueAsNumber: true })}
                  />
                  {errors.durationMonths && (
                    <p className="text-xs text-destructive">
                      {errors.durationMonths.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label>
                    Mode <span className="text-destructive">*</span>
                  </Label>
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
                      {PROGRAM_MODES.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.mode && (
                    <p className="text-xs text-destructive">
                      {errors.mode.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Eligibility */}
              {/* <div className="grid gap-2">
                <Label htmlFor="eligibility">
                  Eligibility <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="eligibility"
                  placeholder="e.g. 12th pass with 50% marks"
                  disabled={isLoading}
                  {...register("eligibility")}
                />
                {errors.eligibility && (
                  <p className="text-xs text-destructive">
                    {errors.eligibility.message}
                  </p>
                )}
              </div> */}

              {/* Fee Amount + Fee Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="feeAmount">
                    Fee Amount <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="feeAmount"
                    type="number"
                    min={1}
                    step="0.01"
                    placeholder="e.g. 50000"
                    disabled={isLoading}
                    {...register("feeAmount")}
                  />
                  {errors.feeAmount && (
                    <p className="text-xs text-destructive">
                      {errors.feeAmount.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label>
                    Fee Type <span className="text-destructive">*</span>
                  </Label>
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
                      {FEE_TYPES.map((ft) => (
                        <SelectItem key={ft} value={ft}>
                          {ft}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.feeType && (
                    <p className="text-xs text-destructive">
                      {errors.feeType.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Benefits - dynamic list */}
              <div className="grid gap-2">
                <Label>Benefits</Label>
                <div className="flex flex-col gap-2">
                  {benefitFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Input
                        placeholder={`Benefit ${index + 1}`}
                        disabled={isLoading}
                        {...register(`benefits.${index}.value` as const)}
                      />
                      <Button type="button" variant="ghost" size="icon" disabled={isLoading} onClick={() => removeBenefit(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" className="w-fit" disabled={isLoading} onClick={() => appendBenefit({ value: "" })}>
                    <Plus className="mr-2 h-4 w-4" />
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

              {/* Featured + Active toggles */}
              <div className="flex items-center gap-6">
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