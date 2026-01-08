"use client";

import React, { useState } from "react";
import { Icon, cn } from "@vayva/ui";
import { useRouter } from "next/navigation";

export default function SubmitTemplatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "retail",
    plan: "growth",
    description: "",
    file: null as File | null,
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetch("/api/designer/templates/submit", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      // Simulate AI Review Delay
      setTimeout(() => {
        router.push("/designer");
      }, 1000);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gray-900 p-8 text-white">
          <h1 className="text-2xl font-bold">Submit New Template</h1>
          <p className="text-gray-400 mt-2">Step {step} of 3</p>
        </div>

        {/* Body */}
        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-bold text-gray-900 border-b pb-2">
                Basic Info
              </h2>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border-gray-300 rounded-lg p-3 text-sm focus:ring-black focus:border-black"
                  placeholder="e.g. Modern Retail V1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    className="w-full border-gray-300 rounded-lg p-3 text-sm"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="retail">Retail</option>
                    <option value="food">Food</option>
                    <option value="services">Services</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Plan Level
                  </label>
                  <select
                    className="w-full border-gray-300 rounded-lg p-3 text-sm"
                    value={formData.plan}
                    onChange={(e) =>
                      setFormData({ ...formData, plan: e.target.value })
                    }
                  >
                    <option value="starter">Starter</option>
                    <option value="growth">Growth</option>
                    <option value="pro">Pro</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!formData.name}
                className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-bold text-gray-900 border-b pb-2">
                Upload Bundle
              </h2>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-black transition-colors cursor-pointer bg-gray-50">
                <Icon
                  name="CloudUpload"
                  size={48}
                  className="mx-auto text-gray-400 mb-4"
                />
                <p className="font-bold text-gray-900">
                  Drag & drop your template bundle
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  .zip files only (max 50mb)
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 flex gap-3 text-yellow-800 text-sm">
                <Icon name="TriangleAlert" size={20} className="shrink-0" />
                <p>
                  Our AI will automatically scan your code for security
                  vulnerabilities and performance issues. Make sure to follow
                  the{" "}
                  <a href="#" className="underline font-bold">
                    Vayva Theme Guidelines
                  </a>
                  .
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 text-gray-900 py-3 rounded-xl font-bold"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800"
                >
                  {loading ? "Analyzing..." : "Submit for Review"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
