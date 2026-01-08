"use client";

import React, { useState } from "react";
import { Button, Icon, cn, Input } from "@vayva/ui";
import { useOnboarding } from "@/context/OnboardingContext";

type Role = "viewer" | "staff" | "admin";

export default function CommunicationPage() {
    const { state, updateState, goToStep } = useOnboarding();

    // WhatsApp State
    const [waMode, setWaMode] = useState<"connect" | "verify" | "success">("connect");
    const [phoneNumber, setPhoneNumber] = useState(state?.whatsapp?.number || "");
    const [otp, setOtp] = useState("");
    const [isWaConnected, setIsWaConnected] = useState(state?.whatsappConnected || false);

    // Team State
    const [invites, setInvites] = useState<{ email: string; role: Role }[]>(
        state?.team?.invites || []
    );
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState<Role>("staff");

    // WhatsApp Handlers (Real Implementation)
    const handleSendOtp = async () => {
        if (phoneNumber.length > 5) {
            try {
                // Trigger backend to send OTP via Evolution/WhatsApp
                const res = await fetch("/api/integrations/whatsapp/connect", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ phoneNumber })
                });

                if (!res.ok) {
                    throw new Error("Failed to send OTP. Service might be unavailable.");
                }

                // On success, move to verify step
                setWaMode("verify");
            } catch (error) {
                console.error("WhatsApp Connection Error:", error);
                // In a real app we would use toasts here. For now, alert or console.
                // toast.error("Connection to WhatsApp Service failed. Please try again.");
                alert("Connection to WhatsApp Service failed. Please try again.");
            }
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length === 6) {
            try {
                // Verify OTP with backend
                const res = await fetch("/api/integrations/whatsapp/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ phoneNumber, otp })
                });

                if (!res.ok) {
                    throw new Error("Invalid OTP or Verification Failed");
                }

                setWaMode("success");
                setIsWaConnected(true);
            } catch (error) {
                console.error("WhatsApp Verification Error:", error);
                alert("Verification failed. Please check the code and try again.");
            }
        }
    };

    // Team Handlers
    const addInvite = () => {
        if (inviteEmail && !invites.find((i) => i.email === inviteEmail)) {
            setInvites([...invites, { email: inviteEmail, role: inviteRole }]);
            setInviteEmail("");
        }
    };

    const removeInvite = (email: string) => {
        setInvites(invites.filter((i) => i.email !== email));
    };

    const handleContinue = async () => {
        await updateState({
            whatsappConnected: isWaConnected,
            whatsapp: { number: isWaConnected ? phoneNumber : undefined },
            team: {
                type: invites.length > 0 ? (invites.length > 5 ? "large" : "small") : "solo",
                invites,
            },
        });

        await goToStep("visuals");
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Communication & Team
                </h1>
                <p className="text-gray-500">
                    Connect your channels and invite your staff.
                </p>
            </div>

            <div className="space-y-6">
                {/* Section 1: WhatsApp */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <Icon name="MessageCircle" size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">WhatsApp Business</h3>
                            <p className="text-xs text-gray-500">Required for automated order updates</p>
                        </div>
                        {isWaConnected && (
                            <span className="ml-auto bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                                CONNECTED
                            </span>
                        )}
                    </div>

                    {!isWaConnected ? (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            {waMode === "connect" && (
                                <div className="flex gap-2">
                                    <div className="bg-white border border-gray-200 rounded-lg px-3 flex items-center text-gray-500 text-sm font-medium">
                                        +234
                                    </div>
                                    <Input
                                        placeholder="80 1234 5678"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button onClick={handleSendOtp} className="!bg-black text-white">
                                        Send Code
                                    </Button>
                                </div>
                            )}
                            {waMode === "verify" && (
                                <div className="flex gap-2 items-center">
                                    <Input
                                        placeholder="OTP Code"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="flex-1 text-center tracking-widest"
                                        maxLength={6}
                                    />
                                    <Button onClick={handleVerifyOtp} className="!bg-green-600 text-white">
                                        Verify
                                    </Button>
                                    <button onClick={() => setWaMode("connect")} className="text-xs text-gray-400 underline">
                                        Change Number
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex justify-between items-center bg-green-50 p-4 rounded-xl border border-green-100">
                            <span className="text-sm font-medium text-green-900">
                                Connected to +234 {phoneNumber}
                            </span>
                            <button
                                onClick={() => { setIsWaConnected(false); setWaMode("connect"); }}
                                className="text-xs text-red-500 hover:underline"
                            >
                                Disconnect
                            </button>
                        </div>
                    )}
                </div>

                {/* Section 2: Team */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            <Icon name="Users" size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Team Members</h3>
                            <p className="text-xs text-gray-500">Invite staff to manage your store</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-2 items-start">
                            <div className="flex-1 space-y-1">
                                <Input
                                    placeholder="colleague@example.com"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                />
                            </div>
                            <select
                                value={inviteRole}
                                onChange={(e) => setInviteRole(e.target.value as Role)}
                                className="h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-black"
                            >
                                <option value="viewer">Viewer</option>
                                <option value="staff">Staff</option>
                                <option value="admin">Admin</option>
                            </select>
                            <Button onClick={addInvite} disabled={!inviteEmail} className="!bg-gray-100 text-black hover:!bg-gray-200">
                                Invite
                            </Button>
                        </div>

                        {/* List */}
                        {invites.length > 0 && (
                            <div className="space-y-2">
                                {invites.map((inv) => (
                                    <div key={inv.email} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-white border flex items-center justify-center text-xs font-bold">
                                                {inv.email[0].toUpperCase()}
                                            </div>
                                            <span className="font-medium">{inv.email}</span>
                                            <span className="text-xs text-gray-500 capitalize">({inv.role})</span>
                                        </div>
                                        <button onClick={() => removeInvite(inv.email)} className="text-gray-400 hover:text-red-500">
                                            <Icon name="X" size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {invites.length === 0 && (
                            <p className="text-xs text-gray-400 italic">No pending invites. You can add more later.</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        onClick={handleContinue}
                        disabled={!isWaConnected}
                        className={cn(
                            "!bg-black text-white px-8 rounded-xl h-12 shadow-lg hover:shadow-xl transition-all",
                            !isWaConnected && "opacity-50 cursor-not-allowed bg-gray-300"
                        )}
                    >
                        {state?.isEditingMode ? "Update & Return" : "Continue"}
                        <Icon name="ArrowRight" className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
