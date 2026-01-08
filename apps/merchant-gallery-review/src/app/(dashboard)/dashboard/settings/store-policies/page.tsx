"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type PolicyType =
  | "terms"
  | "privacy"
  | "returns"
  | "refunds"
  | "shipping_delivery";

interface Policy {
  id: string;
  type: PolicyType;
  title: string;
  contentMd: string;
  status: "DRAFT" | "PUBLISHED";
  publishedAt?: string;
  lastUpdatedLabel?: string;
}

const POLICY_TYPES: { type: PolicyType; label: string }[] = [
  { type: "terms", label: "Store Terms" },
  { type: "privacy", label: "Privacy Notice" },
  { type: "returns", label: "Returns Policy" },
  { type: "refunds", label: "Refund Policy" },
  { type: "shipping_delivery", label: "Shipping & Delivery" },
];

export default function StorePoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedType, setSelectedType] = useState<PolicyType>("terms");
  const [currentPolicy, setCurrentPolicy] = useState<Policy | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPolicies();
  }, []);

  useEffect(() => {
    if (selectedType) {
      loadPolicy(selectedType);
    }
  }, [selectedType]);

  async function loadPolicies() {
    try {
      const res = await fetch("/api/merchant/policies");
      const data = await res.json();
      setPolicies(data.policies || []);
    } catch (error) {
      console.error("Error loading policies:", error);
    }
  }

  async function loadPolicy(type: PolicyType) {
    setLoading(true);
    try {
      const res = await fetch(`/api/merchant/policies/${type}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentPolicy(data.policy);
        setTitle(data.policy.title);
        setContent(data.policy.contentMd);
      } else {
        setCurrentPolicy(null);
        setTitle("");
        setContent("");
      }
    } catch (error) {
      console.error("Error loading policy:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    if (
      !confirm(
        "Generate default policies? This will overwrite any existing drafts.",
      )
    )
      return;

    setLoading(true);
    try {
      const res = await fetch("/api/merchant/policies/generate", {
        method: "POST",
      });
      if (res.ok) {
        await loadPolicies();
        await loadPolicy(selectedType);
        alert("Policies generated successfully!");
      }
    } catch (error) {
      console.error("Error generating policies:", error);
      alert("Failed to generate policies");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/merchant/policies/${selectedType}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, contentMd: content }),
      });

      if (res.ok) {
        await loadPolicies();
        await loadPolicy(selectedType);
        alert("Policy saved!");
      }
    } catch (error) {
      console.error("Error saving policy:", error);
      alert("Failed to save policy");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (!confirm("Publish this policy? It will be visible on your storefront."))
      return;

    setSaving(true);
    try {
      const res = await fetch(
        `/api/merchant/policies/${selectedType}/publish`,
        { method: "POST" },
      );
      if (res.ok) {
        await loadPolicies();
        await loadPolicy(selectedType);
        alert("Policy published!");
      }
    } catch (error) {
      console.error("Error publishing policy:", error);
      alert("Failed to publish policy");
    } finally {
      setSaving(false);
    }
  }

  const selectedPolicyData = policies.find((p) => p.type === selectedType);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Store Policies</h1>
        <p className="text-slate-600 mt-1">Manage your storefront policies</p>
      </div>

      {/* Warning Card */}
      <Card className="bg-amber-50 border-amber-200 p-4 mb-6">
        <p className="text-sm text-amber-900">
          <strong>Note:</strong> These are templates. Review and customize them
          to match your business before publishing.
        </p>
      </Card>

      {/* Generate Button */}
      {policies.length === 0 && (
        <div className="mb-6">
          <Button onClick={handleGenerate} disabled={loading}>
            Generate Default Policies
          </Button>
        </div>
      )}

      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        {/* Sidebar */}
        <div className="space-y-2">
          {POLICY_TYPES.map(({ type, label }) => {
            const policy = policies.find((p) => p.type === type);
            const isSelected = selectedType === type;

            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  isSelected
                    ? "bg-[#22C55E]/10 text-[#22C55E] font-medium"
                    : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{label}</span>
                  {policy && (
                    <Badge
                      variant={
                        (policy.status === "PUBLISHED"
                          ? "default"
                          : "secondary") as any
                      }
                    >
                      {policy.status === "PUBLISHED" ? "Published" : "Draft"}
                    </Badge>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Editor */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading...</div>
          ) : currentPolicy ? (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title
                </label>
                <Input
                  value={title}
                  onChange={(e: any) => setTitle(e.target.value)}
                  placeholder="Policy Title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Content (Markdown)
                </label>
                <Textarea
                  value={content}
                  onChange={(e: any) => setContent(e.target.value)}
                  placeholder="Policy content in markdown..."
                  rows={20}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Draft"}
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={saving}
                  variant="primary"
                >
                  Publish
                </Button>
              </div>

              {selectedPolicyData?.lastUpdatedLabel && (
                <p className="text-sm text-slate-500">
                  Last published: {selectedPolicyData.lastUpdatedLabel}
                </p>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500 mb-4">No policy found</p>
              <Button onClick={handleGenerate}>Generate Policies</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
