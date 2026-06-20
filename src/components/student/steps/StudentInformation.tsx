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
  programOptions: Options[];
  batchesOptions: Options[];
}
export default function StudentInformation({
  programOptions = [],
  batchesOptions =[],
}: Props) {
  const { register, setValue,watch, formState: { errors } } =
    useFormContext<StudentEnrollFormInput>();
const selectedProgram = watch("roleInfo.programId");
const selectedBatch = watch("roleInfo.batchId");

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="programId">Program</Label>

        <Select
        value={selectedProgram}
          onValueChange={(value) =>
           {
             setValue("roleInfo.programId", value, {
              shouldValidate: true,
            })
            setValue("roleInfo.batchId", "", {
              shouldValidate: true,
            })
           }
          }
          // className={"w-full"}

        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Program" />
          </SelectTrigger>

          <SelectContent>
            {programOptions.map((program) => (
              <SelectItem
                key={program.value}
                value={program.value}
              >
                {program.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className="text-red-500 text-sm">
          {errors.roleInfo?.programId?.message}
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

      {/* <div className="space-y-2">
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
      </div> */}

         <div className="space-y-2">
        <Label htmlFor="programId">Batch</Label>

        <Select
        value={selectedBatch}
          onValueChange={(value) =>
            setValue("roleInfo.batchId", value, {
              shouldValidate: true,
            })

          }
          // className={"w-full"}

        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Batch" />
          </SelectTrigger>

          <SelectContent>
            {batchesOptions.map((batch) => (
              <SelectItem
                key={batch.value}
                value={batch.value}
              >
                {batch.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className="text-red-500 text-sm">
          {errors.roleInfo?.batchId?.message}
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