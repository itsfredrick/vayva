"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button, Icon, cn } from "@vayva/ui";
import { useOnboarding } from "@/context/OnboardingContext";
import { OnboardingStepId } from "@/types/onboarding";
import { VayvaLogo } from "@/components/VayvaLogo";
import { telemetry } from "@/lib/telemetry";

interface StepDef {
  id: OnboardingStepId;
  path: string;
  label: string;
}

const STEPS: StepDef[] = [
  { id: "welcome", path: "/onboarding/welcome", label: "Welcome" },
  { id: "business", path: "/onboarding/business", label: "Business Basics" },
  {
    id: "templates",
    path: "/onboarding/templates",
    label: "Operational Model",
  },
  { id: "review", path: "/onboarding/review", label: "Review & Launch" },
];

export function OnboardingClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { loading, handleSaveExit, state } = useOnboarding();

  // Filter steps based on skippedSteps from profile
  const validSteps = STEPS.filter(
    (step) => !state?.skippedSteps?.includes(step.id),
  );

  useEffect(() => {
    const step = validSteps.find((s) => pathname.startsWith(s.path));
    if (step) {
      telemetry.track("ONBOARDING_STEP_VIEWED", {
        step: step.id,
        path: pathname,
        templateSlug: state?.template?.id,
        plan: state?.plan,
        fastPath: !!state?.skippedSteps?.length,
      });
    }
  }, [pathname, validSteps, state?.template?.id, state?.plan]);

  // Find current step index based on valid steps
  const currentStepIndex = validSteps.findIndex((s) =>
    pathname.startsWith(s.path),
  );
  const isFirstStep = currentStepIndex <= 0;

  const handleBack = () => {
    if (currentStepIndex > 0) {
      router.push(validSteps[currentStepIndex - 1].path);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center animate-pulse">
            <VayvaLogo className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-500 font-medium">Loading setup...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col">
      {/* Header */}
      <header className="h-14 md:h-16 px-4 md:px-8 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 md:gap-3">
          <img
            src="/logo-icon.png"
            alt="Vayva Logo"
            className="w-8 h-8 md:w-16 md:h-16 object-contain"
          />
          <span className="font-bold text-base md:text-lg">Vayva</span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {!isFirstStep && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-gray-500 hover:text-black hover:bg-gray-100 flex items-center gap-1 md:gap-2 px-2 md:px-4"
            >
              <Icon name="ArrowLeft" size={16} />
              <span className="hidden md:inline">Back</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-black hover:bg-gray-100 text-xs md:text-sm px-2 md:px-4"
          >
            <span className="hidden md:inline">Having trouble? </span>Help
          </Button>
        </div>
      </header>

      {/* Mobile Progress Bar */}
      <div className="lg:hidden w-full bg-gray-100 h-1">
        <div
          className="h-full bg-black transition-all duration-300 ease-out"
          style={{
            width: `${((currentStepIndex + 1) / validSteps.length) * 100}%`,
          }}
        />
      </div>

      <main className="flex-1 flex max-w-[1440px] mx-auto w-full">
        {/* Sidebar Stepper - Hidden on mobile */}
        <aside className="hidden lg:flex flex-col w-72 py-8 px-6 border-r border-gray-200 h-[calc(100vh-64px)] overflow-y-auto sticky top-16 bg-white/50 backdrop-blur-sm">
          <div className="space-y-1 flex-1">
            {validSteps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;
              const isPending = index > currentStepIndex;

              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-white shadow-sm ring-1 ring-black/5"
                      : "hover:bg-black/5",
                    isPending ? "opacity-50" : "opacity-100",
                  )}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors",
                      isCompleted
                        ? "bg-black text-white"
                        : isActive
                          ? "bg-[#46EC13] text-black"
                          : "bg-gray-200 text-gray-500",
                    )}
                  >
                    {isCompleted ? <Icon name="Check" size={12} /> : index + 1}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isActive ? "text-black" : "text-gray-600",
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {state?.templateSelected &&
            state?.skippedSteps &&
            state.skippedSteps.length > 0 && (
              <div className="mt-6 mb-6 p-3 bg-green-50 rounded-lg border border-green-100">
                <p className="text-xs text-green-700">
                  ✨{" "}
                  <strong>
                    {state.skippedSteps.length} steps automatically likely
                    skipped
                  </strong>{" "}
                  based on your template selection.
                </p>
              </div>
            )}

          <div className="pt-6 mt-6 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-500 hover:text-black"
              onClick={handleSaveExit}
            >
              <Icon name="LogOut" size={16} className="mr-2" />
              Save & Exit
            </Button>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 min-w-0 bg-[#F5F5F7]">
          <div className="w-full mx-auto p-4 md:p-12 pb-32 max-w-lg lg:max-w-none">
            {state?.templateSelected && (
              <div className="mb-6 md:mb-8 p-3 md:p-4 bg-gradient-to-r from-[#46EC13]/10 to-transparent border border-[#46EC13]/20 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#46EC13]/20 flex items-center justify-center text-green-700 shrink-0">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 leading-tight md:leading-normal">
                    We pre-filled this setup for{" "}
                    <strong>{state.template?.name || "your template"}</strong>.
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Some steps have been skipped to get you selling faster.
                  </p>
                </div>
              </div>
            )}

            <Suspense
              fallback={
                <div className="h-64 flex items-center justify-center">
                  <Icon
                    name={"Loader2" as any}
                    className="w-8 h-8 animate-spin text-gray-400"
                  />
                </div>
              }
            >
              {children}
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
