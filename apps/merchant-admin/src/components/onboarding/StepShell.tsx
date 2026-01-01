import React from "react";
import { motion } from "framer-motion";

interface StepShellProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export function StepShell({ children, title, description }: StepShellProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-xl mx-auto w-full"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#1d1d1f] mb-3">{title}</h2>
        <p className="text-lg text-[#1d1d1f]/60">{description}</p>
      </div>
      <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
        {children}
      </div>
    </motion.div>
  );
}
