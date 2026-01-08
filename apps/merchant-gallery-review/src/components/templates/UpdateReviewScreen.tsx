"use client";

import React, { useState } from "react";
import { Button } from "@vayva/ui";

interface UpdateReviewScreenProps {
  templateName: string;
  currentVersion: string;
  newVersion: string;
  whatsNew: string[];
  whatStaysSame: string[];
  whatsOptional: string[];
  onApply: () => void;
  onKeepCurrent: () => void;
}

export function UpdateReviewScreen({
  templateName,
  currentVersion,
  newVersion,
  whatsNew,
  whatStaysSame,
  whatsOptional,
  onApply,
  onKeepCurrent,
}: UpdateReviewScreenProps) {
  const [selectedOption, setSelectedOption] = useState<"keep" | "apply">(
    "keep",
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full bg-white rounded-lg border border-gray-200 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2">
            Update available for {templateName}
          </h1>
          <p className="text-[#64748B]">
            Version {currentVersion} → {newVersion}
          </p>
        </div>

        {/* What's New */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
            What's new
          </h2>
          <ul className="space-y-2">
            {whatsNew.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-1">✓</span>
                <span className="text-[#0F172A]">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What Stays the Same */}
        <div className="mb-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-3">
            What stays the same
          </h3>
          <div className="flex flex-wrap gap-2">
            {whatStaysSame.map((item, i) => (
              <span
                key={i}
                className="text-sm bg-white border border-gray-200 text-[#64748B] px-3 py-1 rounded"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* What's Optional */}
        {whatsOptional.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-[#0F172A] mb-3">
              What's optional
            </h3>
            <ul className="space-y-2">
              {whatsOptional.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">○</span>
                  <span className="text-[#64748B] text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Decision */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-4">
            Your choice
          </h3>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="update-choice"
                value="keep"
                checked={selectedOption === "keep"}
                onChange={() => setSelectedOption("keep")}
                className="mt-1"
              />
              <div>
                <p className="font-semibold text-[#0F172A]">
                  Keep current version
                </p>
                <p className="text-sm text-[#64748B]">
                  Your setup will continue working as it does now
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="update-choice"
                value="apply"
                checked={selectedOption === "apply"}
                onChange={() => setSelectedOption("apply")}
                className="mt-1"
              />
              <div>
                <p className="font-semibold text-[#0F172A]">Apply update</p>
                <p className="text-sm text-[#64748B]">
                  Add new capabilities while keeping your existing setup
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={selectedOption === "apply" ? onApply : onKeepCurrent}
            className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] text-white py-4 text-lg font-semibold"
          >
            {selectedOption === "apply"
              ? "Apply update"
              : "Keep current version"}
          </Button>
          <Button
            onClick={onKeepCurrent}
            variant="outline"
            className="flex-1 border-2 border-gray-300 py-4 text-lg font-semibold"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
