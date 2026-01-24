"use client";

import React from "react";
import Image from "next/image";
import * as motion from "framer-motion/client";

export function ProblemSection(): React.JSX.Element {
    return (
        <section className="py-24 px-4 bg-gray-50/50">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center"
            >
                <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-gray-200 rotate-2 hover:rotate-0 transition-all duration-500 group-hover:scale-[1.02]">
                    <Image
                        src="/images/chaos-problem.jpg"
                        alt="Chaos without Vayva"
                        width={800}
                        height={600}
                        className="w-full h-auto object-cover"
                    />
                </div>
                <div>
                    <h2 className="text-4xl font-bold text-[#0F172A] mb-8 leading-tight">
                        WhatsApp is chaotic.
                        <br />
                        <span className="text-red-500">Business shouldn't be.</span>
                    </h2>
                    <div className="space-y-6">
                        {[
                            "Orders get lost in chat threads",
                            "Prices change mid-conversation",
                            "No records of what was sold",
                            "No accountability or audit trail",
                        ].map((item: any) => (
                            <div key={item} className="flex items-center gap-4 text-[#64748B] text-lg font-medium">
                                <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-red-500">×</div>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
