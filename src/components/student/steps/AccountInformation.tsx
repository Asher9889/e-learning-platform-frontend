import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import type { StudentEnrollFormInput } from "@/pages/Student/schema/student.schema";
// import { StudentEnrollFormData } from "@/sche";

export default function AccountInformation() {
  const {
    register,
    watch,
    formState: { errors },
  } =
    useFormContext<StudentEnrollFormInput>();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        Account Information
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Input
            placeholder="Email"
            {...register("email")}
          />
          <p className="text-red-500 text-sm">
            {errors.email?.message}
          </p>
        </div>

        <div>
          <Input
            placeholder="Phone Number"
            {...register("phoneNumber")}
          />
          <p className="text-red-500 text-sm">
            {errors.phoneNumber?.message}
          </p>
        </div>

        <div>
          <Input
            type="password"
            placeholder="Password"
            {...register("password")}
          />
          <p className="text-red-500 text-sm">
            {errors.password?.message}
          </p>
        </div>

        <div>
          <Input
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              validate: (value) => {
                console.log("VALIDATING", value, watch("password"));

                return (
                  value === watch("password") ||
                  "Passwords do not match"
                );
              }
            })}
          />
          <p className="text-red-500 text-sm">
            {
              errors.confirmPassword
                ?.message
            }
          </p>
        </div>
      </div>
    </div>
  );
}