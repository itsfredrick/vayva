import React from "react";
import Link from "next/link";
import { Button } from "@vayva/ui";
import { ArrowRight } from "lucide-react";
import * as motion from "framer-motion/client";

export default function TemplatesDiscoverySection() {
    return (
        <section className="py-24 px-4 bg-gray-900 border-t border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-500/5 to-transparent pointer-events-none" />
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="max-w-7xl mx-auto"
            >
                <div className="max-w-3xl mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold uppercase mb-6 border border-green-500/20">
                        The Result
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        Your products,
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                            beautifully organized.
                        </span>
                    </h2>
                    <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                        Choose from industry-standard templates. Vayva automatically
                        builds a stunning, mobile-optimized store for you.
                    </p>
                </div>

                {/* Curated Templates Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {[
                        {
                            name: "Fashion Boutique",
                            headline:
                                "Bold, visual-first retail layout for clothing brands.",
                            slug: "Retail",
                        },
                        {
                            name: "Restaurant & Grill",
                            headline:
                                "Fast, mobile-first ordering menu for huge appetites.",
                            slug: "Food",
                        },
                        {
                            name: "Digital Downloads",
                            headline: "Secure delivery for ebooks, courses, and software.",
                            slug: "Digital",
                        },
                        {
                            name: "Consultancy",
                            headline: "Professional booking and scheduling for experts.",
                            slug: "Service",
                        },
                    ].map((cat) => (
                        <Link
                            key={cat.name}
                            href={`/templates?category=${cat.slug}&utm_source=homepage_discovery`}
                            className="group"
                        >
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 h-full hover:bg-white/10 hover:border-green-500/30 transition-all flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-2xl font-bold text-white tracking-tight">
                                            {cat.name}
                                        </h3>
                                        <ArrowRight className="w-6 h-6 text-gray-500 group-hover:text-green-400 transition-colors" />
                                    </div>
                                    <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                                        {cat.headline}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    <span className="text-xs font-bold text-green-500 uppercase tracking-widest group-hover:underline decoration-green-500/50 underline-offset-4">
                                        Preview Template
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/templates">
                        <Button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold transition-all">
                            See all 14 templates
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}
