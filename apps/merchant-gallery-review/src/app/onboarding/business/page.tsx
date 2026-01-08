"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Icon } from "@vayva/ui";
import { useOnboarding } from "@/context/OnboardingContext";
import { useAuth } from "@/context/AuthContext";

export default function BusinessPage() {
  const { state, updateState, goToStep } = useOnboarding();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "", // Legal/Business Name
    storeName: "", // Public Brand Name
    slug: "",
    description: "",
    city: "Lagos", // Default
    state: "Lagos", // Default
    country: "Nigeria", // Default
  });

  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);

  // Initialize from state
  useEffect(() => {
    if (state?.business) {
      setFormData((prev) => ({
        ...prev,
        name: state.business?.name || "",
        storeName: state.business?.storeName || "",
        slug: state.business?.slug || "",
        description: state.business?.description || "",
        city: state.business?.location?.city || "Lagos",
        state: state.business?.location?.state || "Lagos",
      }));
      if (state.business?.slug) setSlugAvailable(true); // Assume valid if loading
    } else if ((user as any)?.businessName) {
      setFormData((prev) => ({ ...prev, name: (user as any).businessName }));
    }
  }, [state, user]);

  // Handle Slug Generation
  const handleStoreNameChange = (val: string) => {
    setFormData((prev) => {
      // Auto-generate slug if it wasn't manually edited (or is empty) or matches previous auto-gen
      // For simplicity, we just auto-gen if slug is empty or we want to overwrite. 
      // A better UX might be to only auto-gen if slug is untouched.
      // Here we will auto-gen continuously until user manually edits slug field

      const newSlug = val.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
      return { ...prev, storeName: val, slug: newSlug };
    });
    // Trigger check
    checkSlug(val.toLowerCase().replace(/[^a-z0-9]/g, "-"));
  };

  const handleSlugChange = (val: string) => {
    const safeSlug = val.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setFormData((prev) => ({ ...prev, slug: safeSlug }));
    checkSlug(safeSlug);
  };

  const checkSlug = async (slug: string) => {
    if (!slug) {
      setSlugAvailable(null);
      return;
    }
    setIsCheckingSlug(true);
    // Simulate API check
    setTimeout(() => {
      setSlugAvailable(slug !== "admin" && slug !== "vayva");
      setIsCheckingSlug(false);
    }, 500);
  };

  const handleContinue = async () => {
    await updateState({
      business: {
        ...state?.business,
        name: formData.name,
        storeName: formData.storeName,
        slug: formData.slug,
        description: formData.description,
        email: state?.business?.email || user?.email || "",
        category: (state?.intent?.segment as string) || "retail",
        location: {
          city: formData.city,
          state: formData.state,
          country: formData.country,
        },
      },
    });

    await goToStep("communication");
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Business Profile
        </h1>
        <p className="text-gray-500">
          This info appears on invoices and your store footer.
        </p>
      </div>

      <div className="space-y-6 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        {/* Legal Name */}
        <div className="space-y-4">
          <Input
            label="Business Legal Name"
            placeholder="e.g. Vayva Global Limited"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full"
          />
          <p className="text-xs text-gray-400 -mt-2">
            Registered company name or your full name.
          </p>
        </div>

        {/* Store Name & Slug */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <Input
            label="Store Name (Public)"
            placeholder="e.g. Vayva Shop"
            value={formData.storeName}
            onChange={(e) => handleStoreNameChange(e.target.value)}
            required
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Store URL</label>
            <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-black/5 focus-within:border-black transition-all">
              <div className="bg-gray-50 px-3 py-3 text-sm text-gray-500 border-r border-gray-200">
                vayva.shop/
              </div>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="flex-1 px-3 py-3 text-sm outline-none text-black placeholder:text-gray-300"
                placeholder="my-store"
              />
              <div className="px-3 flex items-center justify-center min-w-[40px]">
                {isCheckingSlug ? (
                  <Icon name="Loader" className="animate-spin text-gray-400" size={16} />
                ) : slugAvailable === true ? (
                  <Icon name="Check" className="text-green-500" size={16} />
                ) : slugAvailable === false ? (
                  <Icon name="X" className="text-red-500" size={16} />
                ) : null}
              </div>
            </div>
            {slugAvailable === false && (
              <p className="text-xs text-red-500 font-medium">
                Store URL is taken. Try adding 'ng' or 'shop'.
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="pt-4 border-t border-gray-100">
          <label className="text-sm font-medium text-gray-700 block mb-2">Short Description</label>
          <textarea
            className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-black/5 focus:border-black outline-none min-h-[100px]"
            placeholder="We sell premium..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Action Bar */}
        <div className="pt-6 flex justify-end">
          <Button
            onClick={handleContinue}
            disabled={!formData.name || !formData.storeName || !slugAvailable}
            className="!bg-black text-white px-8 rounded-xl h-12 shadow-lg hover:shadow-xl transition-all"
          >
            Next Step
            <Icon name="ArrowRight" className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
