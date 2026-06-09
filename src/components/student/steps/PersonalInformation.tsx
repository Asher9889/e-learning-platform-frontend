import { useFormContext } from "react-hook-form";
// import { StudentEnrollFormData } from "@/schemas/student.schema";
import { Input } from "@/components/ui/input";
import type { StudentEnrollFormInput } from "@/pages/Student/schema/student.schema";

export default function PersonalInformation() {
  const {
    register,
    formState: { errors },
  } =
    useFormContext<StudentEnrollFormInput>();

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
      <Input
        placeholder="Full Name"
        {...register("personalInfo.name")}
      />
      <p className="text-red-500 text-sm">
        {errors.personalInfo?.name?.message}
      </p>
      </div>
      <div>
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

      <select
        className="border rounded-md px-3 h-10"
        {...register(
          "personalInfo.gender"
        )}
      >
        <option value="male">
          Male
        </option>
        <option value="female">
          Female
        </option>
        <option value="other">
          Other
        </option>
      </select>

      <Input
        placeholder="Profile Image URL"
        {...register(
          "personalInfo.profileImage"
        )}
      />

      {/* <p className="text-red-500 text-sm">
        {
          errors.personalInfo?.name
            ?.message
        }
      </p> */}
    </div>
  );
}