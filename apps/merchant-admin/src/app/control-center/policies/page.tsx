"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PolicyEditor } from "@/components/policies/PolicyEditor";

// Test fetch
const fetchPolicies = async () => {
  const res = await fetch("/api/store/policies");
  return res.json();
};

const savePolicies = async (data: any) => {
  await fetch("/api/store/policies", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

function PoliciesContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "returns"; // default to returns
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolicies().then((data) => {
      setStoreData(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (content: string) => {
    const field =
      tab === "returns"
        ? "returnsMarkdown"
        : tab === "shipping"
          ? "shippingMarkdown"
          : tab === "privacy"
            ? "privacyMarkdown"
            : "termsMarkdown";

    await savePolicies({ [field]: content });
    // Optimistic update
    setStoreData({ ...storeData, [field]: content });
  };

  if (loading)
    return (
      <div className="p-12 text-center text-gray-400">Loading editor...</div>
    );

  const content =
    tab === "returns"
      ? storeData.returnsMarkdown
      : tab === "shipping"
        ? storeData.shippingMarkdown
        : tab === "privacy"
          ? storeData.privacyMarkdown
          : storeData.termsMarkdown;

  return (
    <PolicyEditor
      key={tab} // Force re-mount on tab change to reset state
      type={tab as any}
      initialContent={content}
      onSave={handleSave}
      storeSlug={storeData.slug || "demo-store"}
    />
  );
}

export default function PoliciesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-gray-400">Loading...</div>
      }
    >
      <PoliciesContent />
    </Suspense>
  );
}
