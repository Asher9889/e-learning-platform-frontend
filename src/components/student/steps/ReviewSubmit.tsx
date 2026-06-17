import { useFormContext } from "react-hook-form";
import { CheckCircle2, AlertTriangle } from "lucide-react";

import type { StudentEnrollFormInput } from "@/pages/Student/schema/student.schema";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ReviewSubmit() {
  const { getValues } = useFormContext<StudentEnrollFormInput>();
  const data = getValues();

  const sections: SectionConfig[] = [
    {
      value: "account",
      title: "Account information",
      fields: [
        { label: "Email", value: data.email },
        { label: "Phone number", value: data.phoneNumber },
      ],
    },
    {
      value: "personal",
      title: "Personal information",
      fields: [
        { label: "Full name", value: data.personalInfo?.name },
        { label: "Date of birth", value: data.personalInfo?.dateOfBirth },
        { label: "Gender", value: data.personalInfo?.gender },
      ],
    },
    {
      value: "address",
      title: "Address information",
      fields: [
        { label: "Address", value: data.personalInfo?.address?.line1 },
        { label: "City", value: data.personalInfo?.address?.city },
        { label: "State", value: data.personalInfo?.address?.state },
        { label: "Country", value: data.personalInfo?.address?.country },
        { label: "Zip code", value: data.personalInfo?.address?.zipCode },
      ],
    },
    {
      value: "student",
      title: "Student information",
      fields: [
        { label: "Program", value: data.roleInfo?.programId },
        { label: "Roll number", value: data.roleInfo?.rollNumber },
        { label: "Batch", value: data.roleInfo?.batchId },
        { label: "Admission date", value: data.roleInfo?.admissionDate },
        { label: "Guardian name", value: data.roleInfo?.guardianName },
        {
          label: "Guardian phone",
          value: data.roleInfo?.guardianPhoneNumber,
        },
      ],
    },
  ];

  const missingCount = sections.reduce(
    (count, section) =>
      count + section.fields.filter((field) => isEmpty(field.value)).length,
    0,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Review Information</h2>

        {missingCount > 0 && (
          <span className="rounded-md bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-200">
            {missingCount} field{missingCount > 1 ? "s" : ""} missing
          </span>
        )}
      </div>

      <Accordion
  type="multiple"
  defaultValue={sections.map((section) => section.value)}
  className="rounded-lg border"
>
        {sections.map((section) => {
          const sectionMissing = section.fields.some((field) =>
            isEmpty(field.value),
          );

          return (
            <AccordionItem
              key={section.value}
              value={section.value}
              className="border-b last:border-b-0"
            >
              <AccordionTrigger className="bg-muted/50 px-4 hover:bg-muted/70 hover:no-underline">
                <span className="flex items-center gap-2 text-sm font-medium">
                  {sectionMissing ? (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  )}
                  {section.title}
                </span>
              </AccordionTrigger>

              <AccordionContent className="bg-background px-4">
                <table className="w-full table-fixed border-collapse text-sm">
                  <tbody>
                    {section.fields.map((field, index) => (
                      <ReviewRow
                        key={field.label}
                        {...field}
                        isLast={index === section.fields.length - 1}
                      />
                    ))}
                  </tbody>
                </table>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

interface SectionConfig {
  value: string;
  title: string;
  fields: ReviewRowProps[];
}

interface ReviewRowProps {
  label: string;
  value?: string | number;
  isLast?: boolean;
}

function isEmpty(value?: string | number) {
  return value === undefined || value === null || value === "";
}

function ReviewRow({ label, value, isLast }: ReviewRowProps) {
  const missing = isEmpty(value);

  return (
    <tr className={isLast ? "" : "border-b"}>
      <td className="w-1/2 py-2.5 text-muted-foreground">{label}</td>
      <td
        className={
          missing
            ? "py-2.5 text-right font-medium text-red-600 dark:text-red-400"
            : "py-2.5 text-right font-medium"
        }
      >
        {missing ? "Not provided" : value}
      </td>
    </tr>
  );
}