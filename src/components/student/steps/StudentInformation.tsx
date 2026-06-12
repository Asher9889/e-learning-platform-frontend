import { useFormContext } from "react-hook-form";
// import { StudentEnrollFormData } from "@/schemas/student.schema";
import { Input } from "@/components/ui/input";
import type { StudentEnrollFormInput } from "@/pages/Student/schema/student.schema";
import { Label } from "#components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#components/ui/select";
import type { Options } from "@/pages/Teacher/schema/teacher.schema";
interface Props {
  gradeOptions: Options[];
}
export default function StudentInformation({
  gradeOptions = [],
}: Props) {
  const { register, setValue, formState: { errors } } =
    useFormContext<StudentEnrollFormInput>();

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="gradeId">Grade</Label>

        <Select
          onValueChange={(value) =>
            setValue("roleInfo.gradeId", value, {
              shouldValidate: true,
            })
          }
          // className={"w-full"}

        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Grade" />
          </SelectTrigger>

          <SelectContent>
            {gradeOptions.map((grade) => (
              <SelectItem
                key={grade.value}
                value={grade.value}
              >
                {grade.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className="text-red-500 text-sm">
          {errors.roleInfo?.gradeId?.message}
        </p>
      </div>
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