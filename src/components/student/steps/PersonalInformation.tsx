import { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import type { StudentEnrollFormInput } from "@/pages/Student/schema/student.schema";
import { AvatarUpload } from "./AvatarUpload";
import { Label } from "#components/ui/label";
import { sileo } from "sileo";

interface PersonalInformationProps {
  uploadAvatarAsync: (file: File) => Promise<{ url: string; key: string } | undefined>;
  isUploading: boolean;
}

export default function PersonalInformation({
  uploadAvatarAsync,
  isUploading,
}: PersonalInformationProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<StudentEnrollFormInput>();

  const image = watch("personalInfo.profileImage");
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string>("");

  const handleFileChange = useCallback(
    async (file: { file: File | { url: string; id: string } } | null) => {
      const uploadedFile = file?.file;

      if (uploadedFile instanceof File) {
        try {
          const response = await uploadAvatarAsync(uploadedFile);
          if (response?.key) {
            setValue("personalInfo.profileImage", response.key, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }
          if (response?.url) {
            setAvatarPreviewUrl(response.url);
          }
        } catch (err: any) {
          setValue("personalInfo.profileImage", "", {
            shouldDirty: true,
            shouldValidate: true,
          });
          setAvatarPreviewUrl("");
          const message =
            err?.response?.data?.message ||
            err?.message ||
            "Avatar upload failed. Only JPEG, PNG, and WEBP are allowed.";
          sileo.error({ title: "Upload Failed", description: message });
        }
      } else if (!file) {
        setValue("personalInfo.profileImage", "", {
          shouldDirty: true,
          shouldValidate: true,
        });
        setAvatarPreviewUrl("");
      }
    },
    [uploadAvatarAsync, setValue]
  );

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="md:col-span-2 flex flex-col">
        <div className="md:col-span-2 flex justify-start">
          <AvatarUpload
            value={avatarPreviewUrl || (typeof image === "string" ? image : "")}
            onFileChange={handleFileChange}
            isUploading={isUploading}
          />
        </div>
        <p className="text-red-500 text-sm mt-2">
          {errors.personalInfo?.profileImage?.message as string}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="FullName">Full Name</Label>
        <Input
          placeholder="Full Name"
          {...register("personalInfo.name")}
        />
        <p className="text-red-500 text-sm">
          {errors.personalInfo?.name?.message}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="DOB">D.O.B</Label>
        <Input
          type="date"
          {...register("personalInfo.dateOfBirth")}
        />
        <p className="text-red-500 text-sm">
          {errors.personalInfo?.dateOfBirth?.message}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="Gender">Gender</Label>
        <select
          className="border w-full rounded-md px-3 h-10"
          {...register("personalInfo.gender")}
        >
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
      </div>
    </div>
  );
}
