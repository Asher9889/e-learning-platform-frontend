import type { StudentEnrollFormInput } from "@/pages/Student/schema/student.schema";
import { useFormContext } from "react-hook-form";
// import { StudentEnrollFormData } from "@/schemas/student.schema";

export default function ReviewSubmit() {
  const { getValues } =
    useFormContext<StudentEnrollFormInput>();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Review Information
      </h2>

      <pre className="rounded-lg border p-4 bg-muted">
        {JSON.stringify(
          getValues(),
          null,
          2
        )}
      </pre>
    </div>
  );
}