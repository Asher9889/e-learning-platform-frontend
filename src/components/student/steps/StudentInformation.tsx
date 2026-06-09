import { useFormContext } from "react-hook-form";
// import { StudentEnrollFormData } from "@/schemas/student.schema";
import { Input } from "@/components/ui/input";
import type { StudentEnrollFormInput } from "@/pages/Student/schema/student.schema";

export default function StudentInformation() {
  const { register ,formState: { errors } } =
    useFormContext<StudentEnrollFormInput>();

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
      <Input
        placeholder="Roll Number"
        {...register(
          "roleInfo.rollNumber"
        )}
      />
       <p className="text-red-500 text-sm">
        {errors.roleInfo?.rollNumber?.message}
      </p>
      </div>
<div>
      <Input
        placeholder="Batch"
        {...register(
          "roleInfo.batch"
        )}
      />
      <p className="text-red-500 text-sm">
        {errors.roleInfo?.batch?.message}
      </p>
      </div>
<div>
      <Input
        type="date"
        {...register(
          "roleInfo.admissionDate"
        )}
      />
          <p className="text-red-500 text-sm">
        {errors.roleInfo?.admissionDate?.message}
      </p>
      </div>
    </div>
  );
}