import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { TeacherEnrollFormInput } from "@/pages/Teacher/schema/teacher.schema";

export default function TeacherInformation() {
  const {
    register,
    formState: { errors },
  } = useFormContext<TeacherEnrollFormInput>();

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="qualification">
          Qualification
        </Label>

        <Input
          id="qualification"
          placeholder="e.g. M.Tech Computer Science"
          {...register(
            "roleInfo.qualification"
          )}
        />

        <p className="text-sm text-red-500">
          {
            errors.roleInfo
              ?.qualification?.message
          }
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialization">
          Specialization
        </Label>

        <Input
          id="specialization"
          placeholder="e.g. Web Development"
          {...register(
            "roleInfo.specialization"
          )}
        />

        <p className="text-sm text-red-500">
          {
            errors.roleInfo
              ?.specialization?.message
          }
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="experienceYears">
          Experience (Years)
        </Label>

        <Input
          id="experienceYears"
          type="number"
          min={0}
          placeholder="Enter experience"
          {...register(
            "roleInfo.experienceYears",
            {
              valueAsNumber: true,
            }
          )}
        />

        <p className="text-sm text-red-500">
          {
            errors.roleInfo
              ?.experienceYears
              ?.message
          }
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="joiningDate">
          Joining Date
        </Label>

        <Input
          id="joiningDate"
          type="date"
          {...register(
            "roleInfo.joiningDate"
          )}
        />

        <p className="text-sm text-red-500">
          {
            errors.roleInfo
              ?.joiningDate?.message
          }
        </p>
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="bio">
          Professional Bio
        </Label>

        <Textarea
          id="bio"
          rows={5}
          placeholder="Write a short professional introduction..."
          {...register("roleInfo.bio")}
        />

        <p className="text-sm text-red-500">
          {errors.roleInfo?.bio?.message}
        </p>
      </div>
    </div>
  );
}