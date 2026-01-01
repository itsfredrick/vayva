import React from "react";
import { cn } from "../utils";
import { Icon } from "./Icon";

interface Step {
  id: string | number;
  label?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("flex items-center justify-between w-full", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border transition-colors duration-200",
                  isCompleted
                    ? "bg-[#46EC13] border-[#46EC13] text-black"
                    : isCurrent
                      ? "border-[#46EC13] text-[#46EC13]"
                      : "border-white/20 text-white/40",
                )}
              >
                {isCompleted ? (
                  <Icon name="Check" size={16} />
                ) : (
                  <span className="text-sm font-bold">{index + 1}</span>
                )}
              </div>
              {step.label && (
                <span
                  className={cn(
                    "text-xs font-medium hidden md:block",
                    isCurrent || isCompleted ? "text-white" : "text-white/40",
                  )}
                >
                  {step.label}
                </span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-[1px] mx-4 transition-colors duration-200",
                  index < currentStep ? "bg-[#46EC13]" : "bg-white/10",
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
