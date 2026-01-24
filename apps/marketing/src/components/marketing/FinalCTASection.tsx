"use client";

import React from "react";
import Link from "next/link";
import * as motion from "framer-motion/client";
import { PremiumButton } from "@/components/marketing/PremiumButton";
import { APP_URL } from "@/lib/constants";

export function FinalCTASection(): React.JSX.Element {
    return (
        <section className="py-32 px-4 bg-white relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto text-center relative"
            >
                <h2 className="text-5xl md:text-6xl font-bold text-[#0F172A] mb-8 leading-tight">
                    Stop running your business in chat bubbles.
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href={`${APP_URL}/signup`}>
                        <PremiumButton className="px-12 py-6 text-xl rounded-2xl">
                            Create your account
                        </PremiumButton>
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}
