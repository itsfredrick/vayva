"use client";

import React, { useState } from "react";
import { Button, Icon, cn, Input } from "@vayva/ui";
import { useOnboarding } from "@/context/OnboardingContext";

// Master Prompt Step 9: Team (Expanded)
// Role Simulation: Panel explains permissions
// Invite Deferral: "Skip for now" saves flag
// Guidance: "Start alone, add later"

type Role = "viewer" | "staff" | "admin";

export default function TeamPage() {
  const { updateState, goToStep } = useOnboarding();
  const [invites, setInvites] = useState<{ email: string; role: Role }[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("staff");
  const [activeRolePreview, setActiveRolePreview] = useState<Role>("staff");

  const addInvite = () => {
    if (email && !invites.find((i) => i.email === email)) {
      setInvites([...invites, { email, role }]);
      setEmail("");
    }
  };

  const handleContinue = async () => {
    // Continue even if empty (Solo mode)
    await updateState({
      team: {
        type:
          invites.length > 0
            ? invites.length > 5
              ? "large"
              : "small"
            : "solo",
        invites,
      },
    });
    await goToStep("kyc");
  };

  const handleSkip = async () => {
    // Store intent to invite later
    await updateState({
      team: { type: "solo", invites: [], skipped: true },
    });
    await goToStep("kyc");
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-8 max-w-6xl mx-auto items-start">
      <div className="flex-1 w-full max-w-lg lg:pt-10">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
              Step 9 of 11
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Who else manages this business?
          </h1>
          <p className="text-gray-500 text-sm">
            You can invite team members now or do it later.
          </p>
        </div>

        <div className="space-y-4 mb-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <label className="text-sm font-bold text-gray-900">
            Invite by Email
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50"
            />
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value as Role);
                setActiveRolePreview(e.target.value as Role);
              }}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black font-medium"
            >
              <option value="viewer">Viewer</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <Button
            onClick={addInvite}
            disabled={!email}
            className="w-full bg-black text-white rounded-lg"
          >
            Add Invitation
          </Button>

          {invites.length > 0 && (
            <div className="space-y-2 mt-4 pt-4 border-t border-gray-100">
              {invites.map((inv) => (
                <div
                  key={inv.email}
                  className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-xs">
                      {inv.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{inv.email}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {inv.role}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setInvites(invites.filter((i) => i.email !== inv.email))
                    }
                    className="text-gray-400 hover:text-red-500 p-2"
                  >
                    <Icon name="Trash2" size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleContinue}
            className="!bg-black text-white h-12 px-8 rounded-xl text-base shadow-lg hover:shadow-xl transition-all w-full"
          >
            {invites.length > 0
              ? `Send ${invites.length} Invites & Continue`
              : "Continue as Solo"}
          </Button>

          {invites.length === 0 && (
            <button
              onClick={handleSkip}
              className="text-gray-400 text-sm hover:text-black hover:underline"
            >
              Skip this step
            </button>
          )}
        </div>

        {invites.length === 0 && (
          <p className="text-xs text-gray-400 mt-4 text-center">
            <Icon name="Info" size={12} className="inline mr-1" />
            You can always add staff from Settings later.
          </p>
        )}
      </div>

      {/* Role Simulation Panel */}
      <div className="hidden lg:block flex-1 w-full sticky top-24">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 transition-all">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">
            Permission Preview
          </h3>

          <div className="space-y-4">
            {[
              {
                id: "admin",
                icon: "Shield",
                label: "Admin",
                desc: "Full access to settings, withdrawals, and team management.",
              },
              {
                id: "staff",
                icon: "User",
                label: "Staff",
                desc: "Can manage orders, products, and chat. No withdrawals.",
              },
              {
                id: "viewer",
                icon: "Eye",
                label: "Viewer",
                desc: "Read-only access to orders and reports.",
              },
            ].map((r) => (
              <div
                key={r.id}
                className={cn(
                  "p-4 rounded-xl border transition-all duration-300",
                  activeRolePreview === r.id
                    ? "bg-black text-white border-black scale-105 shadow-lg"
                    : "bg-gray-50 text-gray-400 border-gray-100 opacity-60",
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon
                    name={r.icon as any}
                    size={18}
                    className={
                      activeRolePreview === r.id
                        ? "text-green-400"
                        : "text-gray-400"
                    }
                  />
                  <span className="font-bold">{r.label}</span>
                </div>
                <p className="text-xs opacity-80 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
