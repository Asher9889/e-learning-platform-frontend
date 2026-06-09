"use client";

import { Check } from "lucide-react";
import { useEffect, useRef } from "react";

interface Props {
  onNext: () => void;
  currentStep: number;
  onPrevious: () => void;
  steps: string[];
}

export default function EnrollmentStepper({ currentStep, steps, onNext,onPrevious }: Props) {
  const prevStep = useRef(currentStep);

  useEffect(() => {
    prevStep.current = currentStep;
  }, [currentStep]);

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const isDone = index < currentStep;
        const isActive = index === currentStep;
        const isNextStep = index === currentStep + 1;
        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              {/* Circle */}
              <div
                onClick={() => {
                  if (isNextStep ) {
                    onNext();
                  }
                  if(index < currentStep){
                    onPrevious();
                  }
                }}
                className={`
                  relative h-10 w-10 rounded-full flex items-center justify-center
                  text-sm font-medium select-none  ${(isNextStep || index < currentStep)
                    ? "cursor-pointer"
                    : "cursor-not-allowed"
                  }
                  transition-all duration-300 ease-in-out
                  ${isDone
                    ? "bg-primary text-primary-foreground scale-100"
                    : isActive
                      ? "border-2 border-primary text-primary scale-105"
                      : "border border-border text-muted-foreground scale-100"
                  }
                `}
              >
                {/* Pulse ring for active step */}
                {isActive && (
                  <span className="absolute inset-0 rounded-full animate-ping border-2 border-primary opacity-30" />
                )}

                {/* Check icon or number */}
                {isDone ? (
                  <Check
                    className="h-4 w-4 animate-[pop_0.25s_ease-out]"
                    strokeWidth={2.5}
                  />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Label */}
              <span
                className={`
                  text-xs mt-2 text-center transition-colors duration-300
                  ${isActive ? "text-primary font-medium" : isDone ? "text-foreground" : "text-muted-foreground"}
                `}
              >
                {step}
              </span>
            </div>

            {/* Connector line */}
            {index !== steps.length - 1 && (
              <div className="relative h-[2px] flex-1 mx-2 bg-border rounded-full overflow-hidden mb-6">
                <div
                  className="absolute left-0 top-0 h-full bg-primary rounded-full transition-[width] duration-500 ease-in-out"
                  style={{ width: index < currentStep ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Keyframes injected via a style tag — remove if you use a global CSS file */}
      <style>{`
        @keyframes pop {
          0%   { transform: scale(0.3); opacity: 0; }
          70%  { transform: scale(1.2); }
          100% { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}