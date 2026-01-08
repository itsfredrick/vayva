"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@vayva/ui";
import { formatMoneyNGN } from "@/lib/billing/formatters";
import { PLANS } from "@/lib/billing/plans";

export default function BillingPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null); // plan slug

  useEffect(() => {
    fetch("/api/merchant/billing/status")
      .then((res) => res.json())
      .then((data) => {
        setStatus(data);
        setLoading(false);
      });
  }, []);

  const handleSubscribe = async (slug: string) => {
    setProcessing(slug);
    try {
      const res = await fetch("/api/merchant/billing/subscribe", {
        method: "POST",
        body: JSON.stringify({ plan_slug: slug }),
      });
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url; // Redirect to payment
      }
    } catch (e) {
      alert("Error");
      setProcessing(null);
    }
  };

  if (loading) return <div className="p-8">Loading billing...</div>;

  const currentPlan = status?.planSlug || "none";
  const isPastDue = status?.status === "past_due";

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Billing & Plans</h1>

      {isPastDue && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl mb-8 flex items-center gap-4">
          <Icon name={"AlertOctagon" as any} className="text-red-500" />
          <div className="flex-1">
            <h3 className="font-bold text-red-900">Payment Failed</h3>
            <p className="text-sm text-red-700">
              Your subscription is past due. Pro features are restricted.
            </p>
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-12 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400">
          <Icon name={"Info" as any} size={20} />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">Transaction Disclosure</h4>
          <p className="text-sm text-gray-500">
            A 5% transaction fee is applied to every withdrawal from your Vayva
            wallet to your bank account, regardless of your plan tier.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {[PLANS.growth, PLANS.pro].map((plan) => {
          const isCurrent = currentPlan === plan.slug;
          return (
            <div
              key={plan.slug}
              className={`border rounded-2xl p-8 relative ${
                isCurrent
                  ? "border-black ring-1 ring-black bg-gray-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              {isCurrent && (
                <div className="absolute top-4 right-4 bg-black text-white text-xs px-2 py-1 rounded font-bold uppercase">
                  Current Plan
                </div>
              )}

              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <div className="text-3xl font-bold mb-4">
                {formatMoneyNGN(plan.priceNgn)}
                <span className="text-sm font-normal text-gray-500">/mo</span>
              </div>

              <ul className="space-y-3 mb-8 text-sm text-gray-600">
                <li className="flex gap-2">
                  <Icon name={"Check" as any} size={16} />{" "}
                  {plan.limits.teamSeats} Team Seat(s)
                </li>
                <li className="flex gap-2">
                  <Icon name={"Check" as any} size={16} /> Campaign Limit:{" "}
                  {plan.limits.monthlyCampaignSends}
                </li>
                <li className="flex gap-2">
                  <Icon name={"Check" as any} size={16} />{" "}
                  {plan.features.approvals
                    ? "Approvals Included"
                    : "Basic Tools"}
                </li>
              </ul>

              <button
                onClick={() => handleSubscribe(plan.slug)}
                disabled={isCurrent || !!processing}
                className={`w-full py-3 rounded-lg font-bold ${
                  isCurrent
                    ? "bg-gray-200 text-gray-500 cursor-default"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {isCurrent
                  ? "Active"
                  : processing === plan.slug
                    ? "Processing..."
                    : `Switch to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      <h2 className="text-xl font-bold mb-4">Invoice History</h2>
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-bold text-gray-500">Date</th>
              <th className="px-6 py-3 font-bold text-gray-500">Amount</th>
              <th className="px-6 py-3 font-bold text-gray-500">Status</th>
              <th className="px-6 py-3 font-bold text-gray-500"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {status?.invoices?.length > 0 ? (
              status.invoices.map((inv: any) => (
                <tr key={inv.id}>
                  <td className="px-6 py-4">
                    {new Date(inv.issuedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{formatMoneyNGN(inv.amountNgn)}</td>
                  <td className="px-6 py-4 capitalize">{inv.status}</td>
                  <td className="px-6 py-4 text-right">Download</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                  No invoices yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
