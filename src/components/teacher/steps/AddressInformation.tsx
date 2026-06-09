import { useFormContext } from "react-hook-form";
// import { StudentEnrollFormData } from "@/schemas/student.schema";
import { Input } from "@/components/ui/input";
import type { StudentEnrollFormInput } from "@/pages/Student/schema/student.schema";
import { Label } from "#components/ui/label";

export default function AddressInformation() {
  const { register, formState: { errors }, } =
    useFormContext<StudentEnrollFormInput>();

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="Address">Address</Label>
        <Input
          placeholder="Address"
          {...register(
            "personalInfo.address.line1"
          )}
        />
      </div>
       <div className="space-y-2">
        <Label htmlFor="City">City</Label>
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
      <div className="space-y-2">
        <Label htmlFor="State">State</Label>
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
       <div className="space-y-2">
        <Label htmlFor="Country">Country</Label>
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
       <div className="space-y-2">
        <Label htmlFor="ZipCode">Zip Code</Label>
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