import { StepProps } from "../types";

export default function ReviewSubmit({
  form,
}: StepProps) {
  const data = form.getValues();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Review Information
      </h2>

      <pre className="bg-muted p-4 rounded-lg overflow-auto">
        {JSON.stringify(
          data,
          null,
          2
        )}
      </pre>
    </div>
  );
}