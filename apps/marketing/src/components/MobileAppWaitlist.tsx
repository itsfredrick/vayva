"use client";

import { useState, useEffect } from "react";
import { Button, Input, Label } from "@vayva/ui";
import { X } from "lucide-react";

export function MobileAppWaitlist() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Show popup after 3 seconds if not dismissed before
        const hasSeenWaitlist = localStorage.getItem("vayva_mobile_waitlist_seen");
        if (!hasSeenWaitlist) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("vayva_mobile_waitlist_seen", "true");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch("/api/waitlist/mobile-app", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error("Failed to join waitlist");
            }

            setIsSuccess(true);
            setEmail("");

            // Auto-close after 2 seconds
            setTimeout(() => {
                handleClose();
            }, 2000);
        } catch (err) {
            setError("Failed to join waitlist. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-in slide-in-from-bottom-4 duration-300">
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-vayva-green to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                </div>

                {!isSuccess ? (
                    <>
                        {/* Title */}
                        <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
                            Download Vayva App
                        </h3>
                        <p className="text-center text-gray-600 mb-6">
                            Coming to App Store and Google Play Store soon. Join the waitlist to be notified!
                        </p>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="waitlist-email">Email address</Label>
                                <Input
                                    id="waitlist-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-red-600">{error}</p>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-vayva-green hover:bg-vayva-green/90"
                                isLoading={isSubmitting}
                            >
                                Join Waitlist
                            </Button>
                        </form>

                        <p className="text-xs text-center text-gray-500 mt-4">
                            We'll notify you when the app is ready to download.
                        </p>
                    </>
                ) : (
                    <div className="text-center py-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            You're on the list!
                        </h3>
                        <p className="text-gray-600">
                            We'll email you when the app is ready.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
