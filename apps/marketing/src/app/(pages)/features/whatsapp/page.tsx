"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { Button, Icon } from "@vayva/ui";
import { motion } from "framer-motion";
import { APP_URL } from "@/lib/constants";

function WhatsAppContent() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#46EC13] font-bold tracking-wide uppercase mb-4 block">
              WhatsApp AI-Assisted Selling
            </span>
            <h1 className="text-5xl font-bold text-[#1d1d1f] mb-6">
              Master your sales chat.
            </h1>
            <p className="text-xl text-[#1d1d1f]/60 mb-8 leading-relaxed">
              Respond to customers instantly, 24/7. Our AI assistant can answer
              questions, recommend products, and confirm orders directly on
              WhatsApp.
            </p>
            <div className="flex gap-4">
              <Link href={`${APP_URL}/signup`}>
                <Button className="bg-[#46EC13] hover:bg-[#3DD10F] text-black font-bold h-12 px-8 rounded-full shadow-lg shadow-[#46EC13]/20">
                  Get Started
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Chat Testup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto w-full max-w-sm"
          >
            <div className="bg-white rounded-[2.5rem] border border-gray-200 p-4 shadow-2xl">
              <div className="bg-[#E5DDD5] rounded-[2rem] overflow-hidden h-[500px] relative flex flex-col border border-[#d1d7db]">
                {/* Header */}
                <div className="bg-[#075E54] p-4 flex items-center gap-3 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-white/20" />
                  <div className="text-white text-sm font-bold">
                    Vayva AI Assistant
                  </div>
                </div>
                {/* Messages */}
                <div className="p-4 space-y-4 flex-1">
                  <div className="bg-white p-3 rounded-lg rounded-tl-none max-w-[80%] shadow-sm">
                    <p className="text-[#1d1d1f] text-xs">
                      Do you have the Nike sneakers in size 42?
                    </p>
                  </div>
                  <div className="bg-[#dcf8c6] p-3 rounded-lg rounded-tr-none max-w-[80%] ml-auto shadow-sm">
                    <p className="text-[#1d1d1f] text-xs">
                      Yes! We have the Air Jordan 1 High in stock. Would you
                      like to place an order?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function WhatsAppFeaturePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WhatsAppContent />
    </Suspense>
  );
}
