import { useFormContext } from "react-hook-form";
// import { StudentEnrollFormData } from "@/schemas/student.schema";
import { Input } from "@/components/ui/input";
import type { StudentEnrollFormInput } from "@/pages/Student/schema/student.schema";

export default function AddressInformation() {
  const { register, formState: { errors }, } =
    useFormContext<StudentEnrollFormInput>();

  return (
    <div className="grid md:grid-cols-2 gap-4">

      <Input
        placeholder="Address"
        {...register(
          "personalInfo.address.line1"
        )}
      />
      <div>
        <Input
          placeholder="City"
          {...register(
            "personalInfo.address.city"
          )}
        />
        <p className="text-red-500 text-sm">
          {errors.personalInfo?.address?.city?.message}
        </p>
      </div>
      <div>
        <Input
          placeholder="State"
          {...register(
            "personalInfo.address.state"
          )}
        />
        <p className="text-red-500 text-sm">
          {errors.personalInfo?.address?.state?.message}
        </p>
      </div>
      <div>
        <Input
          placeholder="Country"
          {...register(
            "personalInfo.address.country"
          )}
        />
        <p className="text-red-500 text-sm">
          {errors.personalInfo?.address?.country?.message}
        </p>
      </div>
      <div>
        <Input
          placeholder="Zip Code"
          {...register(
            "personalInfo.address.zipCode"
          )}
        />
        <p className="text-red-500 text-sm">
          {errors.personalInfo?.address?.zipCode?.message}
        </p>
      </div>
    </div>
  );
}