"use client";

import React, { useEffect } from "react";
import {
  TEMPLATE_REGISTRY,
  TemplateCategory,
  getTemplatesByCategory,
  BillingPlan,
  getNormalizedTemplates,
} from "@/lib/templates-registry";
import {
  CATEGORY_MARKETING,
  TEMPLATE_MARKETING,
} from "@/lib/marketing-content";
import { useUserPlan } from "@/hooks/useUserPlan";
import { UpgradePlanModal } from "@/components/billing/UpgradePlanModal";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { captureUrlParams, saveAttribution } from "@/lib/attribution";
import { Modal } from "@vayva/ui";
import { StoreShell } from "@/components/storefront/store-shell";
import { AAFashionHome } from "@/components/storefront/AAFashionHome";
import { GizmoTechHome } from "@/components/storefront/GizmoTechHome";
import { BloomeHome } from "@/components/storefront/BloomeHome";
import { StandardRetailHome } from "@/components/storefront/StandardRetailHome";
import { QuickBitesFood } from "@/components/storefront/QuickBitesFood";
import { GourmetDiningFood } from "@/components/storefront/GourmetDiningFood";
import { WellnessBooking } from "@/components/storefront/WellnessBooking";
import { ProConsultBooking } from "@/components/storefront/ProConsultBooking";
import { SkillAcademyCourses } from "@/components/storefront/SkillAcademyCourses";
import { LearnHubCourses } from "@/components/storefront/LearnHubCourses";
import { DigitalVaultStore } from "@/components/storefront/DigitalVaultStore";

// Helper for plan badges
function PlanBadge({ plan }: { plan: BillingPlan }) {
  const styles = {
    free: "bg-gray-100 text-gray-700",
    growth: "bg-blue-50 text-blue-700",
    pro: "bg-black text-white",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[plan]}`}
    >
      {plan}
    </span>
  );
}

// Component map for previews
const PREVIEW_COMPONENTS: Record<string, React.ComponentType<any>> = {
  StoreShell: StandardRetailHome,
  AAFashionHome: AAFashionHome,
  GizmoTechHome: GizmoTechHome,
  BloomeHomeLayout: BloomeHome,
  QuickBitesFood: QuickBitesFood,
  GourmetDiningFood: GourmetDiningFood,
  WellnessBooking: WellnessBooking,
  ProConsultBooking: ProConsultBooking,
  SkillAcademyCourses: SkillAcademyCourses,
  LearnHubCourses: LearnHubCourses,
  DigitalVaultStore: DigitalVaultStore,
};

const DEMO_SLUGS: Record<string, string> = {
  StoreShell: "demo-retail",
  QuickBitesFood: "demo-food",
  GourmetDiningFood: "demo-food",
  AAFashionHome: "demo-retail",
  GizmoTechHome: "demo-retail",
  BloomeHomeLayout: "demo-retail",
  // Fallback others to demo-retail
};

export default function TemplatesLandingPage() {
  return <TemplatesLandingPageContent />;
}

function TemplatesLandingPageContent() {
  const { tier: userPlan, isAuthenticated } = useUserPlan();
  const router = useRouter();
  const [upgradeModalOpen, setUpgradeModalOpen] = React.useState(false);
  const [targetUpgradePlan, setTargetUpgradePlan] =
    React.useState<BillingPlan>("free");
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] = React.useState<any>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;

    captureUrlParams(searchParams, "templates_landing");

    console.log("[TELEMETRY] TEMPLATES_LANDING_VIEWED", {
      category: searchParams.get("category"),
      source: searchParams.get("utm_source"),
    });

    const categorySlug = searchParams.get("category");
    if (categorySlug) {
      const targetId = Object.values(TemplateCategory).find(
        (c) => c.toLowerCase() === categorySlug.toLowerCase(),
      );
      if (targetId) {
        setTimeout(() => {
          const el = document.getElementById(`category-${targetId}`);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [searchParams]);

  const handleUnlock = (plan: BillingPlan, templateId: string) => {
    console.log(
      `[TELEMETRY] TEMPLATE_UNLOCK_CLICKED id=${templateId} required=${plan}`,
    );
    setTargetUpgradePlan(plan);
    setUpgradeModalOpen(true);
  };

  const handlePreview = (template: any) => {
    console.log(`[TELEMETRY] TEMPLATE_PREVIEW_OPENED id=${template.id}`);
    setSelectedTemplate(template);
    setPreviewOpen(true);
  };

  const handleUse = (templateId: string) => {
    console.log(`[TELEMETRY] TEMPLATE_SELECTED id=${templateId}`);
    saveAttribution({ initial_template: templateId });
    router.push(`/signup?template=${templateId}`);
  };

  const categories = Object.values(TemplateCategory);
  const PLAN_HIERARCHY: Record<BillingPlan, number> = {
    free: 0,
    growth: 1,
    pro: 2,
  };
  const canAccess = (req: BillingPlan) =>
    (PLAN_HIERARCHY[userPlan!] || 0) >= PLAN_HIERARCHY[req];

  // Get the preview component
  const PreviewComponent = selectedTemplate?.layoutComponent
    ? PREVIEW_COMPONENTS[selectedTemplate.layoutComponent]
    : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <UpgradePlanModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        currentPlan={userPlan}
        requiredPlan={targetUpgradePlan}
      />

      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={selectedTemplate?.name || "Template Preview"}
        className="max-w-6xl"
      >
        <div className="flex flex-col">
          <div className="w-full h-[70vh] border border-gray-200 rounded-xl overflow-auto bg-white shadow-inner">
            {PreviewComponent ? (
              <PreviewComponent
                storeName={selectedTemplate?.name || "Demo Store"}
                storeSlug={
                  DEMO_SLUGS[selectedTemplate.layoutComponent] || "demo-retail"
                }
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <p className="text-sm">Preview not available</p>
                  <p className="text-xs mt-2">
                    This template is still being built
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 w-full mt-6">
            <button
              onClick={() => setPreviewOpen(false)}
              className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Back to Gallery
            </button>
            <button
              onClick={() => handleUse(selectedTemplate?.id)}
              className="flex-1 px-6 py-3 bg-[#10B981] text-white rounded-xl font-bold hover:bg-[#059669] transition-all shadow-lg shadow-green-100"
            >
              Use This Template
            </button>
          </div>
          <p className="mt-4 text-xs text-gray-400 font-medium text-center">
            Previewing {selectedTemplate?.name}. No account required to view.
          </p>
        </div>
      </Modal>

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mb-6">
            Choose a template built for your business
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-10">
            Start fast with templates designed for how you sell, book, or
            deliver.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() =>
                document
                  .getElementById("categories")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all"
            >
              Browse templates
            </button>
          </div>
        </div>
      </div>

      {/* Category Sections */}
      <div
        id="categories"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-24"
      >
        {categories.map((cat) => {
          const templates = getTemplatesByCategory(cat).filter((t) => t.isFree);
          if (templates.length === 0) return null;

          const copy = CATEGORY_MARKETING[cat];

          return (
            <section key={cat} id={`category-${cat}`} className="scroll-mt-24">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  {copy.headline}
                </h2>
                <p className="text-lg text-gray-500 mt-2">{copy.subheadline}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {templates.map((t) => {
                  const marketing = TEMPLATE_MARKETING[t.id];

                  return (
                    <div
                      key={t.id}
                      className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
                    >
                      {/* Live Preview */}
                      <div
                        className="aspect-[16/10] bg-gray-100 relative group cursor-pointer overflow-hidden"
                        onClick={() => handlePreview(t)}
                      >
                        <div className="absolute inset-0 scale-[0.3] origin-top-left pointer-events-none">
                          <div style={{ width: "333%", height: "333%" }}>
                            {PREVIEW_COMPONENTS[t.layoutComponent || ""] ? (
                              React.createElement(
                                PREVIEW_COMPONENTS[t.layoutComponent || ""],
                                {
                                  storeName: t.name,
                                  storeSlug:
                                    DEMO_SLUGS[t.layoutComponent || ""] ||
                                    "demo-retail",
                                },
                              )
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <div className="text-gray-400 text-6xl">
                                  Preview
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute top-3 left-3">
                          <PlanBadge plan={(t.requiredPlan || "free") as any} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-1">
                        <div className="mb-4">
                          <h3 className="font-bold text-gray-900 leading-tight">
                            {t.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {t.description}
                          </p>
                        </div>

                        <div className="mt-auto grid grid-cols-2 gap-3 pt-4">
                          <button
                            onClick={() => handlePreview(t)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => handleUse(t.id)}
                            className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800"
                          >
                            Use Template
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Why Templates Section */}
      <div className="bg-gray-900 text-white mt-24 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Why start with a template?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Skip the months of development. Launch with a storefront that's
              already optimized for conversion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">
                🚀
              </div>
              <h3 className="text-xl font-bold mb-2">Launch Faster</h3>
              <p className="text-gray-400">
                Go from idea to first sale in days, not months. Visual setup,
                zero code.
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">
                📈
              </div>
              <h3 className="text-xl font-bold mb-2">Proven Flows</h3>
              <p className="text-gray-400">
                Designed with checkout flows that convert. Built on years of
                e-commerce data.
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">
                🎨
              </div>
              <h3 className="text-xl font-bold mb-2">Fully Brandable</h3>
              <p className="text-gray-400">
                Customize colors, fonts, and layouts to match your unique brand
                identity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-indigo-600 text-white py-24 text-center">
        <h2 className="text-3xl font-bold mb-8">
          Ready to build your business?
        </h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all"
          >
            See all templates
          </button>
        </div>
      </div>
    </div>
  );
}
