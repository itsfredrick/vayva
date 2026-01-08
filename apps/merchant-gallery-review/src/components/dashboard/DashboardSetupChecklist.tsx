"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, cn, Button } from "@vayva/ui";
import { useAuth } from "@/context/AuthContext";
import { OnboardingStatus } from "@vayva/shared";
import { telemetry } from "@/lib/telemetry";

export function DashboardSetupChecklist() {
  const { merchant } = useAuth();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [isPersistedHidden, setIsPersistedHidden] = useState(false);

  // Detailed progress state
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    // Persistence check
    if (typeof window !== "undefined") {
      const hidden =
        localStorage.getItem("vayva_dashboard_setup_hidden") === "true";
      setIsPersistedHidden(hidden);
    }

    async function loadProgress() {
      try {
        const res = await fetch("/api/merchant/onboarding/state");
        if (res.ok) {
          const data = await res.json();
          setProgress(data.data || {});
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadProgress();
  }, []);

  if (!merchant) return null;

  const shouldShow =
    merchant.onboardingStatus === OnboardingStatus.OPTIONAL_INCOMPLETE ||
    merchant.onboardingStatus === OnboardingStatus.REQUIRED_COMPLETE;

  if (!shouldShow) return null;

  const handleDismissSession = () => setIsVisible(false);

  const handleHideForever = () => {
    setIsPersistedHidden(true);
    localStorage.setItem("vayva_dashboard_setup_hidden", "true");
  };

  const handleShow = () => {
    setIsVisible(true);
    setIsPersistedHidden(false);
    localStorage.removeItem("vayva_dashboard_setup_hidden");
  };

  const items = [
    {
      id: "whatsapp",
      label: "Connect WhatsApp",
      desc: "Enable automated ordering",
      isDone: !!progress?.whatsappConnected,
      path: "/onboarding/whatsapp",
    },
    {
      id: "payments",
      label: "Set Payment Methods",
      desc: "Define how you get paid",
      isDone: !!progress?.payments,
      path: "/onboarding/payments",
    },
    {
      id: "delivery",
      label: "Delivery Settings",
      desc: "Configure shipping zones",
      isDone: !!progress?.delivery,
      path: "/onboarding/delivery",
    },
    {
      id: "team",
      label: "Invite Team",
      desc: "Add staff members",
      isDone: !!progress?.team?.invites?.length,
      path: "/onboarding/team",
    },
    {
      id: "kyc",
      label: "Verify Identity",
      desc: "Required for withdrawals",
      isDone: !!progress?.kycStatus && progress.kycStatus === "verified",
      path: "/onboarding/kyc",
    },
  ];

  const completedCount = items.filter((i) => i.isDone).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  if (completedCount === items.length) return null; // All done

  // Compact Mode (if hidden or dismissed)
  if (!isVisible || isPersistedHidden) {
    return (
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleShow}
          className="group flex items-center gap-3 text-sm font-medium text-gray-600 bg-white border border-gray-200 pl-3 pr-4 py-2 rounded-full hover:border-black hover:text-black hover:shadow-sm transition-all shadow-sm"
        >
          <div className="relative w-5 h-5">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="text-black transition-all duration-500"
                strokeDasharray={`${progressPercent}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
            </svg>
          </div>
          <span>Finish Setup ({items.length - completedCount} left)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8 animate-in slide-in-from-top-4 fade-in duration-500">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900">Finish your setup</h3>
          <p className="text-gray-500 text-sm">
            Complete these steps to get the most out of Vayva.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-gray-900">
            {progressPercent}% Done
          </span>
          <button
            onClick={handleDismissSession}
            title="Dismiss for now"
            className="text-gray-400 hover:text-black transition-colors p-1"
          >
            <Icon name="X" size={20} />
          </button>
        </div>
      </div>

      <div className="w-full bg-gray-100 h-2 rounded-full mb-6 overflow-hidden">
        <div
          className="bg-black h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              if (!item.isDone) {
                telemetry.track("dashboard_checklist_item_clicked", {
                  itemKey: item.id,
                });
                router.push(item.path);
              }
            }}
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 relative group",
              item.isDone
                ? "bg-gray-50 border-gray-100 opacity-75"
                : "bg-white border-gray-200 hover:border-black hover:shadow-md cursor-pointer",
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                item.isDone
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-500 group-hover:bg-black group-hover:text-white transition-colors",
              )}
            >
              {item.isDone ? (
                <Icon name="Check" size={20} />
              ) : (
                <Icon name="ArrowRight" size={20} />
              )}
            </div>
            <div className="flex-1">
              <h4
                className={cn(
                  "font-bold text-sm",
                  item.isDone ? "text-gray-500 line-through" : "text-gray-900",
                )}
              >
                {item.label}
              </h4>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-2 border-t border-gray-100">
        <button
          onClick={handleHideForever}
          className="text-xs text-gray-400 hover:text-gray-600 hover:underline"
        >
          Don't show this again
        </button>
      </div>
    </div>
  );
}
