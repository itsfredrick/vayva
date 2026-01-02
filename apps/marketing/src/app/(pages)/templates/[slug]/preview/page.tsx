"use client";

import React, { useState, useEffect, use } from "react";
import { notFound, useRouter } from "next/navigation";
import { TEMPLATES } from "@/lib/templates-registry";
import { Icon } from "@vayva/ui";

export default function TemplatePreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const { slug } = use(params);
  const template = TEMPLATES.find((t) => t.slug === slug);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">(
    "desktop",
  );

  if (!template) {
    notFound();
  }

  const demoUrl =
    (template as any).demoStoreUrl || `https://${template.slug}.demo.vayva.app`;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100">
      {/* Value Prop Banner */}
      <div className="bg-black text-white h-16 flex items-center justify-between px-4 sm:px-6 relative z-50 shadow-md flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Back to Details"
          >
            <Icon name="ArrowLeft" size={20} />
          </button>
          <div>
            <div className="font-bold text-sm">{template.name}</div>
            <div className="text-xs text-gray-400">
              Preview Mode — Changes won't be saved
            </div>
          </div>
        </div>

        {/* Device Togglers */}
        <div className="hidden sm:flex bg-gray-800 rounded-lg p-1 gap-1">
          <button
            onClick={() => setPreviewDevice("desktop")}
            className={`p-2 rounded-md transition-all ${previewDevice === "desktop" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"}`}
          >
            <Icon name="Monitor" size={16} />
          </button>
          <button
            onClick={() => setPreviewDevice("mobile")}
            className={`p-2 rounded-md transition-all ${previewDevice === "mobile" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"}`}
          >
            <Icon name="Smartphone" size={16} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="hidden sm:block text-sm font-bold px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => router.push(`/templates/${template.slug}`)}
          >
            View Details
          </button>
          <button className="text-sm font-bold bg-white text-black px-5 py-2 rounded-lg hover:bg-gray-100 transition-colors shadow-lg shadow-white/10">
            Use Template
          </button>
        </div>
      </div>

      {/* Iframe Area */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-200/50 backdrop-blur-sm">
        <div
          className={`bg-white transition-all duration-500 ease-in-out shadow-2xl relative overflow-hidden ${previewDevice === "mobile"
              ? "w-[375px] h-[750px] rounded-[3rem] border-8 border-gray-900 ring-2 ring-gray-900/10"
              : "w-full h-full rounded-xl border border-gray-200"
            }`}
        >
          {/* Safe Area for Mobile */}
          {previewDevice === "mobile" && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-10"></div>
          )}

          <iframe
            src={demoUrl}
            className="w-full h-full bg-white"
            title={`${template.name} Demo`}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
      </div>
    </div>
  );
}
