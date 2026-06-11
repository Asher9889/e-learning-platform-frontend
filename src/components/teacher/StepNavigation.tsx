import { Button } from "@/components/ui/button";

interface Props {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
}

export default function StepNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
}: Props) {
  return (
    <div className="flex justify-between">
      <Button
        variant="outline"
        type="button"
        disabled={currentStep === 0}
        onClick={onPrevious}
      >
        Previous
      </Button>

      {currentStep === totalSteps - 1 ? (
        <Button type="submit">
          Enroll Student
        </Button>
      ) : (
        <Button
          type="button"
           onClick={(e) => {
             e.preventDefault();
            onNext();
            }}
        >
          Next
        </Button>
      )}
    </div>
  );
}