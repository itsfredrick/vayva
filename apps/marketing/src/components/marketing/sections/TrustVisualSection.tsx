import React from "react";
import Image from "next/image";
import { Zap, ShieldCheck } from "lucide-react";
import * as motion from "framer-motion/client";

export default function TrustVisualSection() {
    return (
        <section className="pb-24 px-4">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-6xl mx-auto"
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
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-[#22C55E] text-xs font-bold uppercase mb-6">
                                        The Vayva Engine
                                    </div>
                                    <h2 className="text-4xl font-bold text-[#0F172A] mb-8 leading-tight">
                                        How your business
                                        <br />
                                        stays in sync.
                                    </h2>
                                    <div className="space-y-10">
                                        {[
                                            {
                                                num: 1,
                                                title: "Chat natively",
                                                text: "Customers message you on WhatsApp. No new apps for them.",
                                            },
                                            {
                                                num: 2,
                                                title: "Process with AI",
                                                text: "Vayva assists by parsing conversations and extracting order details.",
                                            },
                                            {
                                                num: 3,
                                                title: "Record eternally",
                                                text: "Orders, payments, and delivery statuses are logged in clean records.",
                                            },
                                        ].map((step) => (
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
                                    <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 group-hover:scale-[1.02] transition-transform duration-700">
                                        <Image
                                            src="/images/calm-solution.jpg"
                                            alt="Relaxed merchant managing business on tablet"
                                            width={800}
                                            height={600}
                                            className="w-full h-auto object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                                            <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                                                        <Zap className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-black text-gray-500">
                                                            System Status
                                                        </p>
                                                        <p className="text-sm font-bold text-gray-900">
                                                            All Systems Running
                                                        </p>
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
