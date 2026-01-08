"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@vayva/ui";

// Fallback Modal UI components since we don't have a standardized Modal yet in this context,
// using a simple fixed overlay for now or we could use Dialog if available.
// Assuming we might not have a global Modal, I'll build a simple one here.

const PlanOption = ({
  name,
  price,
  features,
  recommended,
  current,
  onSelect,
  disabled,
}: any) => (
  <div
    className={`p-6 rounded-2xl border ${recommended ? "border-primary-500 bg-primary-50/50 ring-2 ring-primary-200" : "border-gray-200"} relative flex flex-col`}
  >
    {recommended && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
        Recommended
      </div>
    )}
    <h3 className="text-lg font-bold text-gray-900">{name}</h3>
    <div className="mt-2 mb-4">
      <span className="text-3xl font-extrabold text-gray-900">{price}</span>
      {price !== "Free" && (
        <span className="text-gray-500 text-sm">/month</span>
      )}
    </div>
    <ul className="space-y-3 mb-6 flex-1">
      {features.map((f: string, i: number) => (
        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
          <Icon
            name={"CheckCircle" as any}
            size={16}
            className="text-green-600 flex-shrink-0"
          />
          {f}
        </li>
      ))}
    </ul>
    <Button
      onClick={() => onSelect(name)}
      disabled={current || disabled}
      variant={current ? "outline" : recommended ? "primary" : "secondary"}
      className="w-full"
    >
      {current ? "Current Plan" : "Select Plan"}
    </Button>
  </div>
);

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: string) => void;
  currentPlan: string;
  processing?: boolean; // Added optional prop
}

export const PlanSelectionModal = ({
  isOpen,
  onClose,
  onSelectPlan,
  currentPlan,
  processing,
}: PlanSelectionModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200 relative p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Icon name={"X" as any} size={20} />
        </button>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Choose the perfect plan
          </h2>
          <p className="text-gray-500 text-lg">
            Scale your business with powerful tools and insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PlanOption
            name="STARTER"
            price="Free"
            current={currentPlan === "STARTER" || currentPlan === "Free Trial"}
            features={[
              "5 Days Free Trial",
              "Basic Storefront",
              "Up to 50 Products",
              "Standard Analytics",
              "Email Support",
            ]}
            onSelect={onSelectPlan}
            disabled={processing}
          />
          <PlanOption
            name="GROWTH"
            price="₦30,000"
            recommended={true}
            current={currentPlan === "GROWTH"}
            features={[
              "Everything in Starter",
              "Unlimited Products",
              "Advanced Analytics",
              "Priority Support",
              "Custom Domain",
            ]}
            onSelect={onSelectPlan}
            disabled={processing}
          />
          <PlanOption
            name="PRO"
            price="₦45,000"
            current={currentPlan === "PRO"}
            features={[
              "Everything in Growth",
              "Dedicated Account Manager",
              "API Access",
              "Whitelabeling",
              "Multiple Staff Accounts",
            ]}
            onSelect={onSelectPlan}
            disabled={processing}
          />
        </div>
      </div>
    </div>
  );
};
