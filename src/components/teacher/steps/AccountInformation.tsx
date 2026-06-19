import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import type { StudentEnrollFormInput } from "@/pages/Student/schema/student.schema";
import { InputGroup, InputGroupAddon, InputGroupInput } from "#components/ui/input-group";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { Label } from "#components/ui/label";
import { getPasswordScore } from "@/utils/helper";
// import { StudentEnrollFormData } from "@/sche";

export default function AccountInformation() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
 const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
  const {
    register,
    watch,
    formState: { errors },
  } =
    useFormContext<StudentEnrollFormInput>();
const password = watch("password");
  const score = getPasswordScore(password);

  const progressColor =
    score <= 2
      ? "bg-red-500"
      : score <= 4
        ? "bg-yellow-500"
        : "bg-green-500";
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        Account Information
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="Email">Email address</Label>
          <Input
            placeholder="Email"
            {...register("email")}
          />

          <p className="text-red-500 text-sm">
            {errors.email?.message}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="PhoneNumber">Phone Number</Label>
          <Input
            placeholder="Phone Number"
             maxLength={10}
            {...register("phoneNumber")}
          />
          <p className="text-red-500 text-sm">
            {errors.phoneNumber?.message}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="Password">Password</Label>
          {/* <Input
            type="password"
            placeholder="Password"
            {...register("password")}
          /> */}
           <div className="relative">
          <InputGroup>
            <InputGroupInput
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              {...register("password",{
                  pattern: {
                    value: passwordRegex,
                    message:
                      "Password must contain uppercase, lowercase, number and special character",
                  },
                })}
            />

            <InputGroupAddon
              align="inline-end"
              className="cursor-pointer"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </InputGroupAddon>
          </InputGroup>
           {password && (
                        <>
                          <div className="absolute bottom-[1px] left-0 h-0.5 px-[3px] w-full overflow-hidden ">
                            <div
                              className={`h-full transition-all duration-300 ${progressColor} rounded-b-md`}
                              style={{
                                width: `${(score / 5) * 100}%`,
                              }}
                            />
                          </div>
                        </>
                      )}
                      </div>
          <p className="text-red-500 text-sm">
            {errors.password?.message}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ConfirmPassword">Confirm Password</Label>
          {/* <Input
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
          /> */}
          <InputGroup>
            <InputGroupInput
              id="password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Enter password"
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

            <InputGroupAddon
              align="inline-end"
              className="cursor-pointer"
              onClick={() =>
                setShowConfirmPassword((prev) => !prev)
              }
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </InputGroupAddon>
          </InputGroup>
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