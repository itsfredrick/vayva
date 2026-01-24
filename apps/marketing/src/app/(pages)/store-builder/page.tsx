import React from "react";
import Link from "next/link";
import { APP_URL } from "@/lib/constants";
import {
  Layout,
  Smartphone,
  MousePointerClick,
  RefreshCcw,
  Zap,
  Layers,
  ArrowRight,
} from "lucide-react";
import * as motion from "framer-motion/client";
import { PremiumButton } from "@/components/marketing/PremiumButton";

export const metadata = {
  title: "Store Builder | Design Your Vayva Store",
  description:
    "Build a professional mobile-first online store without writing a single line of code. Choose a template, customize, and launch.",
};

export default function StoreBuilderPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden text-[#0F172A]">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-green-50 rounded-full blur-[120px] opacity-60 animate-pulse" />
        <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[35%] bg-blue-50 rounded-full blur-[100px] opacity-40 animate-pulse delay-1000" />
      </div>

      {/* Section 1: Hero */}
      <section className="pt-32 pb-24 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest mb-8 border border-green-100"
          >
            Visual Commerce Engine
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-[#0F172A] mb-8 leading-[1.1] tracking-tight"
          >
            Build a Store That
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C55E] to-[#16A34A]">Sell While You Sleep</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-[#64748B] mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Design and publish a stunning mobile storefront in minutes.
            Connected to real payments, inventory, and WhatsApp automatically.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href={`${APP_URL}/signup`}>
              <PremiumButton className="px-12 py-6 text-lg rounded-[24px] shadow-[0_20px_40px_-10px_rgba(34,197,94,0.3)]">
                Start Building Your Store
              </PremiumButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Section 2: What the Store Builder Is */}
      <section className="py-32 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#0F172A] mb-8 tracking-tight">
            Your brand, your rules.
          </h2>
          <p className="text-lg text-[#64748B] leading-relaxed max-w-3xl mx-auto font-medium">
            The Vayva Store Builder is a visual editor designed specifically for WhatsApp commerce.
            Every pixel is optimized for mobile customers who shop on their phones.
            No technical hurdles, just pure speed.
          </p>
        </div>
      </section>

      {/* Section 3: Core Capabilities */}
      <section className="py-32 px-4 bg-gray-50/50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Visual Editing", desc: "Click, type, and swap. Change colors and images using a simple control panel.", icon: MousePointerClick, color: "text-blue-500", bg: "bg-blue-50" },
              { title: "Live Preview", desc: "See your changes instantly. Switch between desktop and mobile views in one click.", icon: Layout, color: "text-purple-500", bg: "bg-purple-50" },
              { title: "Mobile Optimized", desc: "Built for speed. Thumb-friendly buttons and seamless one-hand checkout flows.", icon: Smartphone, color: "text-green-500", bg: "bg-green-50" },
              { title: "Section Modules", desc: "Stack blocks like LEGOs. Reorder Heroes, Products, and Reviews easily.", icon: Layers, color: "text-orange-500", bg: "bg-orange-50" },
              { title: "Durable Recovery", desc: "Made a mess? Reset sections or the entire theme back to defaults safely.", icon: RefreshCcw, color: "text-red-500", bg: "bg-red-50" },
              { title: "Instant Update", desc: "Go live instantly. Changes propagate to your public store URL without downtime.", icon: Zap, color: "text-teal-500", bg: "bg-teal-50" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:translate-y-[-4px] transition-all group"
              >
                <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: How Editing Works */}
      <section className="py-40 px-4 relative z-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl font-bold text-[#0F172A] mb-10 tracking-tight">
              Simplified Creative Control.
            </h2>
            <div className="space-y-10">
              {[
                { step: 1, title: "Select Template", desc: "Choose your foundation from the Template Gallery. This sets your structure." },
                { step: 2, title: "Tweak in Draft", desc: "Enter the Control Center. Tweak your design privately without affecting your live site." },
                { step: 3, title: "Publish Live", desc: "Hit Publish. Your new look is live for all customers instantly across the world." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shrink-0 text-sm shadow-xl">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2 tracking-tight">{item.title}</h3>
                    <p className="text-[#64748B] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-100/50 rounded-[48px] p-8 lg:p-12 aspect-square flex items-center justify-center border border-slate-200/60 relative group">
            <div className="absolute inset-0 bg-blue-500/5 blur-[80px] group-hover:bg-blue-500/10 transition-all opacity-0 group-hover:opacity-100" />
            <div className="bg-white w-full h-full rounded-[32px] shadow-2xl flex overflow-hidden border border-white/40 relative z-10">
              <div className="w-1/4 bg-gray-50 border-r border-gray-100 p-4 space-y-3">
                {[1, 2, 3, 4].map(v => <div key={v} className="w-full h-2 bg-gray-200 rounded animate-pulse" />)}
              </div>
              <div className="w-1/2 p-6 flex flex-col items-center justify-center bg-[#F8FAFC]">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-4">Preview Window</div>
                <div className="w-full h-full max-h-[300px] bg-white border-4 border-slate-900 rounded-[24px] shadow-2xl relative">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-slate-900 rounded-full" />
                </div>
              </div>
              <div className="w-1/4 bg-white border-l border-gray-100 p-4">
                <div className="w-full h-8 bg-green-50 rounded-xl mb-4 border border-green-100" />
                {[1, 2].map(v => <div key={v} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl mb-3" />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Built for Growth */}
      <section className="py-40 px-4 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-8 tracking-tight">
            More than just a pretty face.
          </h2>
          <p className="text-slate-400 text-lg mb-20 max-w-2xl mx-auto leading-relaxed">
            Every store built with Vayva is connected to our enterprise core—real-time inventory, secure payments, and global logistics.
          </p>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "Inventory Sync", desc: "Products update automatically when stock changes across channels." },
              { title: "Payment Native", desc: "Secure checkout is baked into the foundation, not added as a plugin." },
              { title: "Logistics Ready", desc: "Delivery partners are plugged in from day one for seamless fulfillment." }
            ].map((item, i) => (
              <div key={i}>
                <h4 className="font-bold text-2xl mb-4 text-[#22C55E] tracking-tight">
                  {item.title}
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Final CTA */}
      <section className="py-40 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent opacity-50" />
        <div className="max-w-2xl mx-auto relative z-10">
          <h2 className="text-5xl font-bold text-slate-900 mb-8 tracking-tight">
            Stop coding. Start selling.
          </h2>
          <Link href={`${APP_URL}/signup`}>
            <PremiumButton className="px-12 py-8 text-xl rounded-[24px] shadow-2xl">
              Launch Your Store Free <ArrowRight className="ml-2 inline-block" size={24} />
            </PremiumButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
