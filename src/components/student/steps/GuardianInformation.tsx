import { useFormContext } from "react-hook-form";
// import { StudentEnrollFormData } from "@/schemas/student.schema";
import { Input } from "@/components/ui/input";
// import type { StudentEnrollFormData } from "@/pages/Student/schema/student.schema";
import type { StudentEnrollFormInput } from "@/pages/Student/schema/student.schema";
export default function GuardianInformation() {
  const { register, formState: { errors } } =
    useFormContext<StudentEnrollFormInput>();

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <Input
          placeholder="Guardian Name"
          {...register(
            "roleInfo.guardianName"
          )}
        />
        <p className="text-red-500 text-sm">
          {errors.roleInfo?.guardianName?.message}
        </p>
      </div>

      <div>
        <Input
          placeholder="Guardian Phone"
          {...register(
            "roleInfo.guardianPhoneNumber"
          )}
        />
        <p className="text-red-500 text-sm">
          {errors.roleInfo?.guardianPhoneNumber?.message}
        </p>
      </div>
    </div>
  );
}