import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import type { StudentEnrollFormInput } from "@/pages/Student/schema/student.schema";
import { AvatarUpload } from "./AvatarUpload";
import { Label } from "#components/ui/label";
import type { FileWithPreview } from "@/hooks/use-file-upload";

interface PersonalInformationProps {
  uploadAvatarAsync?: (file: File) => Promise<any>;
  isUploading?: boolean;
}

export default function PersonalInformation({
  isUploading,
}: PersonalInformationProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<StudentEnrollFormInput>();

  const image = watch("personalInfo.profileImage");
console.log(isUploading,"isUploading")
  const handleFileChange = (fileWithPreview: FileWithPreview | null) => {
    if (!fileWithPreview) {
      setValue("personalInfo.profileImage", undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
      return;
    }

    // FileWithPreview wraps the actual File — adjust accessor if hook's shape differs
    const actualFile =
      fileWithPreview.file instanceof File
        ? fileWithPreview.file
        : (fileWithPreview.file as any)?.file ?? null;

    setValue("personalInfo.profileImage", actualFile, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="md:col-span-2 flex flex-col">
        <div className="md:col-span-2 flex justify-start">
          <AvatarUpload
            value={image}
            onFileChange={handleFileChange}
            // isUploading={isUploading}
          />
        </div>
        <p className="text-red-500 text-sm mt-2">
          {errors.personalInfo?.profileImage?.message as string}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="FullName">Full Name</Label>
        <Input placeholder="Full Name" {...register("personalInfo.name")} />
        <p className="text-red-500 text-sm">
          {errors.personalInfo?.name?.message}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="DOB">D.O.B</Label>
        <Input type="date" {...register("personalInfo.dateOfBirth")} />
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