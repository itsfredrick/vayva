"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Copy, PartyPopper, ShoppingCart, Share2, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

export default function StoreLivePage() {
  const [store, setStore] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/merchant/store")
      .then((r) => r.json())
      .then((data) => setStore(data.store));
  }, []);

  const storeUrl = store ? `https://vayva.ng/${store.slug}` : "";

  function copyToClipboard() {
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareOnWhatsApp() {
    const message = `Hi 👋 I'm now taking orders online. Browse and checkout here: ${storeUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center p-6 overflow-hidden">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl w-full bg-white/5 backdrop-blur-2xl rounded-[40px] border border-white/10 shadow-2xl p-12 text-center relative z-10"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl mb-8 shadow-xl shadow-indigo-500/20 rotate-3">
          <PartyPopper className="text-white w-12 h-12" />
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
          Your business is now global!
        </h1>

        <p className="text-lg text-gray-400 mb-10 max-w-lg mx-auto">
          Congratulations! Your storefront is live and ready to take your first order.
        </p>

        {/* Store URL Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Store URL</p>
            <p className="text-xl font-mono text-indigo-400 font-bold">
              {store?.slug ? `vayva.ng/${store.slug}` : "..."}
            </p>

          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              className="flex-1 md:flex-none h-12 rounded-xl bg-white/10 hover:bg-white/20 text-white border-none gap-2"
              onClick={copyToClipboard}
              disabled={!store}
            >
              <Copy size={16} />
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button
              className="flex-1 md:flex-none h-12 rounded-xl bg-green-500 hover:bg-green-600 text-white border-none gap-2"
              onClick={shareOnWhatsApp}
              disabled={!store}
            >
              <Share2 size={16} />
              WhatsApp
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <Button
            size="lg"
            className="h-16 rounded-2xl bg-white text-black hover:bg-gray-100 font-bold text-lg gap-3"
            onClick={() => window.open(`/${store?.slug}`, "_blank")}
            disabled={!store}
          >
            <ShoppingCart size={20} />
            Visit Storefront
          </Button>
          <Button size="lg" variant="outline" className="h-16 rounded-2xl border-white/10 text-white hover:bg-white/5 font-bold text-lg gap-3" asChild>
            <Link href="/dashboard">
              <LayoutDashboard size={20} />
              Go to Dashboard
            </Link>
          </Button>
        </div>

        {/* Next Steps */}
        <div className="pt-8 border-t border-white/10 text-left">
          <h2 className="text-white font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full" />
            Grow your business
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/dashboard/products/new" className="group">
              <h3 className="font-semibold text-gray-300 mb-1 group-hover:text-white transition-colors">Add Products</h3>
              <p className="text-xs text-gray-500">List your catalog items</p>
            </Link>
            <Link href="/dashboard/marketing" className="group">
              <h3 className="font-semibold text-gray-300 mb-1 group-hover:text-white transition-colors">Setup Discounts</h3>
              <p className="text-xs text-gray-500">Create special offers</p>
            </Link>
            <Link href="/dashboard/settings/team" className="group">
              <h3 className="font-semibold text-gray-300 mb-1 group-hover:text-white transition-colors">Invite Team</h3>
              <p className="text-xs text-gray-500">Collaborate with staff</p>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

