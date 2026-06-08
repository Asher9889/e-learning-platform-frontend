import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  currentStep: number;
  steps: string[];
}

export function EnrollmentStepper({
  currentStep,
  steps,
}: Props) {
  return (
    <div className="flex items-center justify-between mb-10">
      {steps.map((step, index) => {
        const completed = index < currentStep;
        const active = index === currentStep;

        return (
          <div
            key={step}
            className="flex-1 flex items-center"
          >
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center border",
                  completed &&
                    "bg-primary text-primary-foreground",
                  active &&
                    "border-primary"
                )}
              >
                {completed ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>

              <span className="text-xs mt-2">
                {step}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="flex-1 h-[1px] bg-border mx-2" />
            )}
          </div>
        );
      })}
    </div>
  );
}