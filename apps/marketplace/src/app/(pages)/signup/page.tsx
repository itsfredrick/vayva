"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button, Input } from "@vayva/ui";
import { BrandLogo } from "@/components/BrandLogo";

export default function SignupPage(): React.JSX.Element {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const payload = await res.json();

      if (!res.ok || !payload?.success) {
        setError(payload?.error?.message || "Failed to create account");
        setLoading(false);
        return;
      }

      const login = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      });

      if (!login || login.error) {
        router.push("/signin");
        return;
      }

      router.push(login.url || "/");
      router.refresh();
    } catch {
      setError("Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-md mx-auto bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <BrandLogo className="h-7" priority />
          </div>
          <div className="text-2xl font-extrabold text-gray-900">Create your account</div>
          <div className="text-sm text-gray-500 mt-1">Start browsing deals and verified merchants</div>
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-800">
            {error}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
            />
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
            />
          </div>

          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />

          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 8 chars)"
            required
          />

          <Button type="submit" isLoading={loading} className="w-full h-12 font-extrabold glow-primary">
            Create account
          </Button>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Button
              variant="ghost"
              type="button"
              onClick={() => router.push("/signin")}
              className="font-bold text-primary hover:underline"
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
