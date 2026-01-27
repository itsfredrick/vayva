"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button, Input } from "@vayva/ui";
import { BrandLogo } from "@/components/BrandLogo";

function SigninContent(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    if (!res || res.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push(res.url || callbackUrl);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-md mx-auto bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <BrandLogo className="h-7" priority />
          </div>
          <div className="text-2xl font-extrabold text-gray-900">Welcome back</div>
          <div className="text-sm text-gray-500 mt-1">Sign in to continue shopping</div>
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-800">
            {error}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-4">
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
            placeholder="Password"
            required
          />

          <Button type="submit" isLoading={loading} className="w-full h-12 font-extrabold glow-primary">
            Sign in
          </Button>

          <div className="text-center text-sm text-gray-600">
            New here?{" "}
            <Button
              variant="ghost"
              type="button"
              onClick={() => router.push("/signup")}
              className="font-bold text-primary hover:underline"
            >
              Create an account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SigninPage(): React.JSX.Element {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    }>
      <SigninContent />
    </Suspense>
  );
}
