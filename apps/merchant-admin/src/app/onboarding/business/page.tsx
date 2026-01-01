"use client";

import React, { useState, useEffect } from "react";
import { Button, Icon, cn, Input } from "@vayva/ui";
import { useOnboarding } from "@/context/OnboardingContext";

export default function BusinessBasicsPage() {
  const { state, updateState, goToStep } = useOnboarding();

  // Helper function to map segment to category label
  const getSegmentLabel = (segment: string | undefined): string => {
    if (!segment) return "";
    const segmentLabel: Record<string, string> = {
      retail: "Retail Store",
      food: "Food & Catering",
      services: "Services & Bookings",
      mixed: "Mixed Business",
    };
    return segmentLabel[segment] || "Business";
  };

  // Initialize form state from context or defaults
  const [formData, setFormData] = useState({
    name: state?.business?.name || "",
    legalName: state?.business?.legalName || "",
    type: state?.business?.type || "individual",
    category:
      state?.business?.category || getSegmentLabel(state?.intent?.segment), // Use helper function
    city: state?.business?.location?.city || "",
    state: state?.business?.location?.state || "",
    country: state?.business?.location?.country || "Nigeria",
    description: state?.business?.description || "",
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(
    state?.business?.logo || null,
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Update category when state loads or segment changes
  useEffect(() => {
    if (state?.intent?.segment) {
      const label = getSegmentLabel(state.intent.segment);
      // Only update if we don't have a category yet or if it's different from the segment label
      if (label && (!formData.category || formData.category !== label)) {
        setFormData((prev) => ({ ...prev, category: label }));
      }
    }
  }, [state?.intent?.segment, state?.business?.category]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    setLogoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleContinue = async () => {
    if (!formData.name) return; // Validation

    // In production, upload logo to cloud storage here
    // For now, we'll store the base64 preview

    // Ensure category is the formatted label, not the raw segment
    const categoryToSave =
      formData.category || getSegmentLabel(state?.intent?.segment);

    await updateState({
      business: {
        name: formData.name,
        legalName: formData.legalName,
        type: formData.type as "individual" | "registered",
        email: state?.business?.email || "", // Preserve logic or fetch from auth
        category: categoryToSave,
        logo: logoPreview || undefined,
        location: {
          city: formData.city,
          state: formData.state,
          country: formData.country,
        },
        description: formData.description,
      },
    });

    await goToStep("templates");
  };

  const isFormValid = !!formData.name;

  return (
    <div className="flex flex-col lg:flex-row h-full gap-8 max-w-6xl mx-auto items-start">
      {/* Left Column: Form */}
      <div className="flex-1 w-full max-w-lg lg:pt-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Business information
          </h1>
          <p className="text-gray-500">Tell us about your business.</p>
        </div>

        <div className="space-y-6">
          {/* Logo Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Business Logo{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl border-2 border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon name="Image" className="text-gray-400" size={32} />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <Icon name="Upload" size={16} />
                  {logoPreview ? "Change Logo" : "Upload Logo"}
                </label>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="businessName"
                className="block text-sm font-medium text-gray-700"
              >
                Business Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="businessName"
                data-testid="onboarding-business-name"
                placeholder="e.g. Lagos Kitchen"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="legalName"
                className="block text-sm font-medium text-gray-700"
              >
                Legal Business Name{" "}
                <span className="text-gray-400 font-normal">
                  (If different)
                </span>
              </label>
              <Input
                id="legalName"
                placeholder="e.g. Lagos Kitchen Ltd"
                value={formData.legalName}
                onChange={(e) => handleChange("legalName", e.target.value)}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Business Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleChange("type", "individual")}
                  className={cn(
                    "p-3 rounded-lg border text-sm font-medium transition-all",
                    formData.type === "individual"
                      ? "border-black bg-gray-50 text-black ring-1 ring-black"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
                  )}
                >
                  Individual
                </button>
                <button
                  type="button"
                  onClick={() => handleChange("type", "registered")}
                  className={cn(
                    "p-3 rounded-lg border text-sm font-medium transition-all",
                    formData.type === "registered"
                      ? "border-black bg-gray-50 text-black ring-1 ring-black"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
                  )}
                >
                  Registered Business
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <Input
              id="category"
              value={formData.category}
              readOnly
              className="bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400">
              Pre-selected based on your choice.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Input
                  id="country"
                  value="Nigeria"
                  readOnly
                  className="bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Short Description{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <Input
              id="description"
              placeholder="What do you do?"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-10">
          <Button
            data-testid="onboarding-business-continue"
            onClick={handleContinue}
            disabled={!isFormValid}
            className="!bg-black text-white h-12 px-8 rounded-xl text-base shadow-lg hover:shadow-xl transition-all w-full md:w-auto"
          >
            Continue
          </Button>
        </div>
      </div>

      {/* Right Column: Live Preview Interactive Element */}
      <div className="hidden lg:block flex-1 w-full sticky top-24">
        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center">
          <div className="text-center mb-6 z-10">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
              Live Preview
            </h3>
            <p className="text-gray-500 text-sm">
              This is how your business card will appear on receipts and
              records.
            </p>
          </div>

          {/* Business Card Component */}
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-300 hover:scale-[1.02] z-10">
            <div className="h-24 bg-gradient-to-r from-gray-900 to-gray-800 relative">
              <div className="absolute -bottom-6 left-6 w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center text-2xl font-bold border-4 border-white overflow-hidden">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : formData.name ? (
                  formData.name.charAt(0).toUpperCase()
                ) : (
                  "?"
                )}
              </div>
            </div>
            <div className="pt-8 px-6 pb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {formData.name || "Your Business Name"}
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                {formData.category} &bull;{" "}
                {formData.city ? `${formData.city}, ` : ""}
                {formData.state || "Location"}
              </p>

              {formData.description && (
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  "{formData.description}"
                </p>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                <span>Vayva ID: #883920</span>
                <span className="flex items-center gap-1">
                  <Icon
                    name="CircleCheck"
                    size={12}
                    className="text-green-500"
                  />{" "}
                  Verified
                </span>
              </div>
            </div>
          </div>

          {/* Decor elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />
        </div>
      </div>
    </div>
  );
}
