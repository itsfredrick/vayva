"use client";

import React from "react";
import { Zap, ShieldCheck } from "lucide-react";
import * as motion from "framer-motion/client";

export default function TrustVisualSection(): React.JSX.Element {
    return (
        <section className="pb-12 md:pb-24 px-4">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-[1760px] mx-auto"
            >
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-[32px] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                    <div className="relative bg-white border border-gray-200 rounded-[32px] shadow-2xl overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#22C55E] to-blue-500" />
                        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                            <div className="flex gap-1.5 ml-2">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="mx-auto bg-white px-4 py-1 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-gray-200">
                                Yourstore.vayva.ng
                            </div>
                        </div>
                        <div className="p-8 lg:p-12">
                            <div className="grid lg:grid-cols-[1fr_0.65fr] gap-12 items-center">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-[#22C55E] text-xs font-bold uppercase mb-6">
                                        Business Control Package
                                    </div>
                                    <h2 className="text-4xl font-bold text-[#0F172A] mb-8 leading-tight">
                                        WhatsApp on the front.
                                        <br />
                                        Proper operations at the back.
                                    </h2>
                                    <div className="space-y-10">
                                        {[
                                            {
                                                num: 1,
                                                title: "Sell on WhatsApp",
                                                text: "Your customers keep chatting the way they already do. You don’t force anyone to download a new app.",
                                            },
                                            {
                                                num: 2,
                                                title: "Control from your dashboard",
                                                text: "Orders, payments, inventory, delivery — organized in one place so you’re not searching 200 chats for one customer.",
                                            },
                                            {
                                                num: 3,
                                                title: "Operate with clean records",
                                                text: "Track status, performance, and customer history with clean records you can trust (even when things get busy).",
                                            },
                                        ].map((step: any) => (
                                            <div
                                                key={step.num}
                                                className="flex items-start gap-6 group"
                                            >
                                                <div className="flex-shrink-0 w-10 h-10 bg-white border-2 border-green-100 text-[#22C55E] rounded-full flex items-center justify-center text-sm font-bold group-hover:bg-[#22C55E] group-hover:text-white transition-all shadow-sm">
                                                    {step.num}
                                                </div>
                                                <div className="pt-1">
                                                    <p className="text-lg font-bold text-[#0F172A] mb-1">
                                                        {step.title}
                                                    </p>
                                                    <p className="text-[#64748B] text-sm leading-relaxed">
                                                        {step.text}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 group-hover:scale-[1.02] transition-transform duration-700 bg-white">
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50" />
                                        <div className="relative p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Vayva Dashboard</div>
                                                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-gray-700 border border-gray-200">
                                                    <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full" />
                                                    Live
                                                </div>
                                            </div>

                                            <div className="mt-5 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                                                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                                                    <div className="text-xs font-bold text-gray-700">Today</div>
                                                    <div className="text-xs font-extrabold text-[#22C55E]">₦847,500</div>
                                                </div>
                                                <div className="p-4 grid grid-cols-3 gap-3">
                                                    <div className="rounded-xl bg-gray-50 p-3">
                                                        <div className="text-[10px] font-bold text-gray-500 uppercase">Orders</div>
                                                        <div className="mt-1 text-lg font-extrabold text-gray-900">47</div>
                                                    </div>
                                                    <div className="rounded-xl bg-gray-50 p-3">
                                                        <div className="text-[10px] font-bold text-gray-500 uppercase">Paid</div>
                                                        <div className="mt-1 text-lg font-extrabold text-gray-900">39</div>
                                                    </div>
                                                    <div className="rounded-xl bg-gray-50 p-3">
                                                        <div className="text-[10px] font-bold text-gray-500 uppercase">Delivered</div>
                                                        <div className="mt-1 text-lg font-extrabold text-gray-900">22</div>
                                                    </div>
                                                </div>
                                                <div className="px-4 pb-4">
                                                    <div className="rounded-2xl border border-gray-100 p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                                                                <Zap className="w-5 h-5 text-white" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-[10px] uppercase font-black text-gray-400">System status</p>
                                                                <p className="text-sm font-bold text-gray-900">All systems running</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Floating Badge */}
                                    <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-2xl border border-gray-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                                                <ShieldCheck className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-black text-gray-400">
                                                    Peace of Mind
                                                </p>
                                                <p className="text-sm font-bold text-gray-900">
                                                    100% Audit Ready
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
