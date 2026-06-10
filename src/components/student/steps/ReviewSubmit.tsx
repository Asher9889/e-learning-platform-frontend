import { useFormContext } from "react-hook-form";

import type { StudentEnrollFormInput } from "@/pages/Student/schema/student.schema";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

export default function ReviewSubmit() {
  const { getValues } =
    useFormContext<StudentEnrollFormInput>();

  const data = getValues();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">
        Review Information
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

      {/* Student Information */}
      <Card>
        <CardHeader>
          <CardTitle>
            Student Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <ReviewRow
            label="Roll Number"
            value={
              data.roleInfo?.rollNumber
            }
          />

          <ReviewRow
            label="Batch"
            value={data.roleInfo?.batch}
          />

          <ReviewRow
            label="Admission Date"
            value={
              data.roleInfo
                ?.admissionDate
            }
          />

          <Separator />

          <ReviewRow
            label="Guardian Name"
            value={
              data.roleInfo
                ?.guardianName
            }
          />

          <ReviewRow
            label="Guardian Phone"
            value={
              data.roleInfo
                ?.guardianPhoneNumber
            }
          />
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
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">
        {label}
      </span>

      <span className="font-medium text-right">
        {value || "-"}
      </span>
    </div>
  );
}