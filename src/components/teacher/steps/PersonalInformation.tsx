import { useFormContext } from "react-hook-form";
// import { StudentEnrollFormData } from "@/schemas/student.schema";
import { Input } from "@/components/ui/input";
import type { StudentEnrollFormInput } from "@/pages/Student/schema/student.schema";
import { AvatarUpload } from "./AvatarUpload";
import { Label } from "#components/ui/label";
import { useEffect } from "react";

export default function PersonalInformation() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } =
    useFormContext<StudentEnrollFormInput>();
  console.log(errors, "errorserrorserrors")
const image = watch("personalInfo.profileImage");

console.log(image);
  useEffect(() => {
  register("personalInfo.profileImage");
}, [register]);
  return (
    <div className="grid md:grid-cols-2 gap-4">


      <div className="md:col-span-2 flex flex-col ">
        <div className="md:col-span-2 flex justify-start ">
          <AvatarUpload
          value={image}
            onFileChange={(file) => {
              const uploadedFile = file?.file;

              if (uploadedFile instanceof File) {
                setValue(
                  "personalInfo.profileImage",
                  uploadedFile,
                  {
                    shouldDirty: true,
                    shouldValidate: true,
                  }
                );
              }
            }}
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
          {...register(
            "personalInfo.dateOfBirth"
          )}
        />
        <p className="text-red-500 text-sm">
          {errors.personalInfo?.dateOfBirth?.message}
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="Gender">Gender</Label>
        <select
          className="border w-full rounded-md px-3 h-10"
          {...register(
            "personalInfo.gender"
          )}
        >
          <option value="MALE">
            Male
          </option>
          <option value="FEMALE">
            Female
          </option>
          <option value="OTHER">
            Other
          </option>
        </select>
      </div>

      {/* <Input
        placeholder="Profile Image URL"
        {...register(
          "personalInfo.profileImage"
        )}
      /> */}


      {/* <p className="text-red-500 text-sm">
        {
          errors.personalInfo?.name
            ?.message
        }
      </p> */}
    </div>
  );
}