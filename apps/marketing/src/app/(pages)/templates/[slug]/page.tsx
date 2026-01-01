"use client";

import React from "react";
import { notFound, useRouter } from "next/navigation"; // Correct import for App Router
import { TEMPLATES } from "@/lib/templates-registry";
import { Template } from "@/types/templates";
import { Icon } from "@vayva/ui";

// In Next.js App Router, params are passed as a Promise or directly depend on version.
// For latest Next.js 15+, it's often a Promise. But usually { params }: { params: { slug: string } } works for server components.
// Since this is 'use client', we hook into params differently or receive them if it's a page.
// Actually, Page components even if 'use client' receive params prop.

export default function TemplateDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();

  // Find template (we iterate because slug might differ from ID key, though in registry they are mostly same)
  // Actually registry keys are IDs.
  const template = TEMPLATES.find((t) => t.slug === params.slug);

  if (!template) {
    notFound();
  }

  const {
    name,
    description,
    previewImageDesktop,
    requiredPlan: tier,
    features,
    category,
  } = template;

  const images = [previewImageDesktop].filter(Boolean);
  const setupTime = "5 mins";
  const bestFor = "Standard setup";
  const creates = (template as any)?.onboardingProfile?.initialData || null;

  const handleInteractivePreview = () => {
    router.push(`/templates/${template.slug}/preview`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar Navigation */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            <Icon name="ArrowLeft" size={16} /> Back to Gallery
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={handleInteractivePreview}
              className="text-sm font-bold text-gray-900 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors hidden sm:block"
            >
              View Live Demo
            </button>
            <button className="text-sm font-bold text-white bg-black px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-lg shadow-black/10">
              Use Template
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Col: Validation & Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide bg-gray-100 text-gray-600">
                  {(category || "standard").replace("-", " ")}
                </span>
                {tier !== "free" && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide bg-purple-100 text-purple-700">
                    {tier} Plan
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                {name}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Best For */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Icon name="Users" size={18} /> Best For
              </h3>
              <p className="text-gray-600">{bestFor}</p>
            </div>

            {/* Features List */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-lg">
                Key Features
              </h3>
              <ul className="space-y-3">
                {features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 min-w-[18px]">
                      <Icon name="Check" size={18} className="text-green-500" />
                    </div>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What you get */}
            {creates && (
              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-lg">
                  What's Included
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-gray-100">
                    <div className="text-gray-400 text-xs uppercase font-bold mb-1">
                      Pages
                    </div>
                    <div className="font-medium text-gray-900">
                      {creates.pages.join(", ")}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-gray-100">
                    <div className="text-gray-400 text-xs uppercase font-bold mb-1">
                      Sections
                    </div>
                    <div className="font-medium text-gray-900">
                      {creates.sections.join(", ")}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Col: Images */}
          <div className="lg:col-span-7 space-y-8">
            {images.map((img: string, idx: number) => (
              <div
                key={idx}
                className="rounded-2xl overflow-hidden border border-gray-200 shadow-2xl shadow-gray-200/50 bg-gray-100"
              >
                {/* Simulated Browser Window */}
                <div className="h-8 bg-white border-b border-gray-100 flex items-center px-4 gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
                <img
                  src={img}
                  alt={`${name} Preview ${idx + 1}`}
                  className="w-full h-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/1200x800/f3f4f6/a1a1aa?text=High+Quality+Preview";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
