"use client";

import React from "react";
import * as motion from "framer-motion/client";
import { Smartphone, Users, Wifi, ShieldCheck } from "lucide-react";

export function InfrastructureSection(): React.JSX.Element {
    return (
        <section className="py-24 px-4 bg-white">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto"
            >
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold uppercase mb-6">
                        Engineered for Nigeria
                    </div>
                    <h2 className="text-4xl font-bold text-[#0F172A] mb-4">Infrastructure for the local reality.</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    {[
                        { title: "Local payment realities", Icon: Smartphone, color: "text-green-600", bg: "bg-green-100" },
                        { title: "Informal selling norms", Icon: Users, color: "text-orange-600", bg: "bg-orange-100" },
                        { title: "Network constraints", Icon: Wifi, color: "text-blue-600", bg: "bg-blue-100" },
                        { title: "Regulatory awareness", Icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-100" },
                    ].map((item: any) => (
                        <div key={item.title} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:bg-white hover:shadow-xl transition-all group">
                            <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <item.Icon className={`w-6 h-6 ${item.color}`} />
                            </div>
                            <h3 className="font-bold text-[#0F172A] mb-3 text-lg">{item.title}</h3>
                            <p className="text-[#64748B] text-sm leading-relaxed">Built for Nigeria.</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
