import { useFormContext } from "react-hook-form";
// import { StudentEnrollFormData } from "@/schemas/student.schema";
import { Input } from "@/components/ui/input";
import type { StudentEnrollFormInput } from "@/pages/Student/schema/student.schema";
import { Label } from "#components/ui/label";

export default function StudentInformation() {
  const { register, formState: { errors } } =
    useFormContext<StudentEnrollFormInput>();

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="RollNumber">Roll Number</Label>
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
      <div className="space-y-2">
        <Label htmlFor="Batch">Batch</Label>
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
      <div className="space-y-2">
        <Label htmlFor="AdmissionDate">Admission Date</Label>
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