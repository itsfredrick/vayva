"use client";

import { use, useEffect, useState } from "react";
import { LocaleKey, LOCALES } from "@/data/locales";
import { Gift, Package, Utensils, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StoreShell } from "@/components/StoreShell";

export default function AccountPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = use(params);
  const lang = (rawLang === "tr" ? "tr" : "en") as LocaleKey;
  const t = LOCALES[lang].account.overview;
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // Auth Guard (Test)
  useEffect(() => {
    const savedUser = localStorage.getItem("vayva_user");
    if (!savedUser) {
      router.push(`/${lang}/account/login`);
    } else {
      setUser(JSON.parse(savedUser));
    }
  }, [lang, router]);

  const handleLogout = () => {
    localStorage.removeItem("vayva_user");
    document.cookie =
      "vayva_storefront_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push(`/${lang}/account/login`);
  };

  if (!user) return null; // Or a loading spinner

  return (
    <StoreShell>
      <div className="min-h-screen bg-gray-50 py-12 md:py-20 bg-noise">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Welcome Card */}
          <div className="bg-[#0B1220] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl transition-transform hover:scale-[1.01]">
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {t.welcome}, {user.name}!
                </h1>
                <p className="opacity-60 font-mono text-sm">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-white/50 hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
            {/* Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Active Plan */}
            <div className="glass-panel p-6 rounded-2xl">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                {t.planTitle}
              </h2>
              <div className="flex items-center gap-3">
                <div className="text-xl font-bold text-gray-900">
                  {t.planDesc}
                </div>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-bold">
                  Active
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-panel p-6 rounded-2xl">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                {t.quickLinks}
              </h2>
              <div className="grid grid-cols-1 gap-3">
                <Link
                  href={`/${lang}/menu`}
                  className="group flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 transition-all"
                >
                  <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                    <Utensils size={18} />
                  </div>
                  <span className="font-bold text-gray-700 group-hover:text-black">
                    {t.menu}
                  </span>
                </Link>
                <Link
                  href={`/${lang}/past-deliveries`}
                  className="group flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <Package size={18} />
                  </div>
                  <span className="font-bold text-gray-700 group-hover:text-black">
                    {t.history}
                  </span>
                </Link>
                <Link
                  href={`/${lang}/favorites`}
                  className="group flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 transition-colors"
                >
                  <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                    <Gift size={18} />
                  </div>
                  <span className="font-bold text-gray-700 group-hover:text-black">
                    {t.gift}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StoreShell>
  );
}
