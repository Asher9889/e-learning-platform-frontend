import { Button } from "@/components/ui/button";

interface Props {
  step: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
}

export function StepNavigation({
  step,
  totalSteps,
  onNext,
  onPrevious,
  isLastStep,
}: Props) {
  return (
    <div className="flex justify-between pt-8">
      <Button
        variant="outline"
        disabled={step === 0}
        onClick={onPrevious}
        type="button"
      >
        Previous
      </Button>

      {isLastStep ? (
        <Button type="submit">
          Enroll Student
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
        >
          Next
        </Button>
      )}
    </div>
  );
}