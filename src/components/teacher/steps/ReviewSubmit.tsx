import { useFormContext } from "react-hook-form";

import type { TeacherEnrollFormInput } from "@/pages/Teacher/schema/teacher.schema";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

export default function ReviewSubmit() {
  const { getValues } =
    useFormContext<TeacherEnrollFormInput>();

  const data = getValues();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">
        Review Teacher Information
      </h2>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>
            Account Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <ReviewRow
            label="Email"
            value={data.email}
          />

          <ReviewRow
            label="Phone Number"
            value={data.phoneNumber}
          />
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>
            Personal Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <ReviewRow
            label="Full Name"
            value={data.personalInfo?.name}
          />

          <ReviewRow
            label="Date of Birth"
            value={
              data.personalInfo
                ?.dateOfBirth
            }
          />

          <ReviewRow
            label="Gender"
            value={
              data.personalInfo?.gender
            }
          />
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle>
            Address Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <ReviewRow
            label="Address"
            value={
              data.personalInfo?.address
                ?.line1
            }
          />

          <ReviewRow
            label="City"
            value={
              data.personalInfo?.address
                ?.city
            }
          />

          <ReviewRow
            label="State"
            value={
              data.personalInfo?.address
                ?.state
            }
          />

          <ReviewRow
            label="Country"
            value={
              data.personalInfo?.address
                ?.country
            }
          />

          <ReviewRow
            label="Zip Code"
            value={
              data.personalInfo?.address
                ?.zipCode
            }
          />
        </CardContent>
      </Card>

      {/* Teacher Information */}
      <Card>
        <CardHeader>
          <CardTitle>
            Teacher Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <ReviewRow
            label="Qualification"
            value={
              data.roleInfo
                ?.qualification
            }
          />

          <ReviewRow
            label="Specialization"
            value={
              data.roleInfo
                ?.specialization
            }
          />

          <ReviewRow
            label="Experience"
            value={`${data.roleInfo?.experienceYears ?? 0} Years`}
          />

          <ReviewRow
            label="Joining Date"
            value={
              data.roleInfo
                ?.joiningDate
            }
          />

          <Separator />

          <div className="space-y-2">
            <p className="text-sm font-medium">
              Bio
            </p>

            <div className="rounded-md border p-3 bg-muted/30 text-sm">
              {data.roleInfo?.bio ||
                "No bio provided"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ReviewRowProps {
  label: string;
  value?: string | number;
}

function ReviewRow({
  label,
  value,
}: ReviewRowProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground">
        {label}
      </span>

      <span className="font-medium text-right">
        {value || "-"}
      </span>
    </div>
  );
}