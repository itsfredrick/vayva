"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@vayva/ui";

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  workflows: string[];
  configures: string[];
  customizable: string[];
}

interface TemplateConfirmationProps {
  template: Template;
  onContinue: () => void;
  onGoBack: () => void;
}

export function TemplateConfirmation({
  template,
  onContinue,
  onGoBack,
}: TemplateConfirmationProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-lg border border-gray-200 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0F172A] mb-4">
            You're about to set up your business using the{" "}
            <span className="text-[#22C55E]">{template.name}</span> template.
          </h1>
          <p className="text-lg text-[#64748B]">
            This will configure your workflows so you can start selling on
            WhatsApp with structure.
          </p>
        </div>

        {/* What Will Be Set Up */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
            This template will:
          </h2>
          <ul className="space-y-3">
            {template.configures.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#22C55E]/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#22C55E] text-sm">✓</span>
                </div>
                <span className="text-[#0F172A]">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What You Can Change Later */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-3">
            You can change at any time:
          </h3>
          <div className="flex flex-wrap gap-2">
            {template.customizable.map((item, i) => (
              <span
                key={i}
                className="text-sm bg-white border border-blue-200 text-[#64748B] px-3 py-1 rounded"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={onContinue}
            className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] text-white py-4 text-lg font-semibold"
          >
            Continue to setup
          </Button>
          <Button
            onClick={onGoBack}
            variant="outline"
            className="flex-1 border-2 border-gray-300 py-4 text-lg font-semibold"
          >
            Go back to templates
          </Button>
        </div>
      </div>
    </div>
  );
}
