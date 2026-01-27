"use client";

import React, { useState } from "react";
import { Button } from "@vayva/ui";

export function NewsletterForm(): React.JSX.Element {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("submitting");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed to subscribe");

      setStatus("success");
      setEmail("");
    } catch (error) {
      console.error("Newsletter error:", error);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-[#22C55E]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-white font-bold text-lg mb-2">You're subscribed!</p>
        <p className="text-gray-400 text-sm">Check your inbox for a confirmation email.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
      <input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={status === "submitting"}
        className="bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#22C55E] flex-1 disabled:opacity-50"
      />
      <Button
        type="submit"
        disabled={status === "submitting"}
        className="bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl px-8 disabled:opacity-50"
      >
        {status === "submitting" ? "Subscribing..." : "Subscribe"}
      </Button>
      {status === "error" && (
        <p className="text-red-400 text-sm text-center sm:text-left w-full mt-2">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
