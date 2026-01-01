"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // A2: Badge Row - Environment Pill logic
  const isProd = process.env.NODE_ENV === "production";
  const envLabel = isProd ? "PRODUCTION" : "STAGING";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ops/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Invalid credentials");
      }

      // Success - Handle Redirect
      const next = searchParams.get("next");
      let destination = "/ops";

      if (next) {
        // B2: Reject open redirects
        // Must start with /ops and NOT be absolute
        if (next.startsWith("/ops") && !next.includes("//")) {
          destination = next;
        }
      }

      router.push(destination);
      router.refresh(); // Refresh to update server components/middleware state
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-xl overflow-hidden">

      {/* 2. Badge Row & Title Block */}
      <div className="pt-8 pb-6 px-8 text-center border-b border-gray-100">

        {/* Badge Row */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Vayva Ops</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${isProd
            ? "bg-gray-100 text-gray-600 border-gray-200"
            : "bg-amber-50 text-amber-600 border-amber-200"
            }`}>
            {envLabel}
          </span>
        </div>

        {/* Title Block */}
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Ops Portal</h1>
          <p className="text-sm text-gray-500 mt-1">Authorized personnel only</p>
        </div>
      </div>

      {/* 5. Error Banner */}
      {error && (
        <div className="px-8 mt-6">
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
            <AlertCircle className="shrink-0 mt-0.5" size={16} />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* 3. Form */}
      <div className="p-8">
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:opacity-50 disabled:bg-gray-50"
              placeholder="ops@vayva.ng"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all pr-10 disabled:opacity-50 disabled:bg-gray-50"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Sign In"}
          </button>

          {/* 4. Security Helper Text */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-400">All actions are logged.</p>
          </div>
        </form>
      </div>

      {/* 6. Footer */}
      <div className="bg-gray-50 py-4 border-t border-gray-100 text-center">
        <p className="text-[10px] text-gray-400">© 2025 Vayva Internal Systems</p>
      </div>

    </div>
  );
}

export default function OpsLoginPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
