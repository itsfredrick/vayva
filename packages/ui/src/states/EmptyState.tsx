"use client";

import * as React from "react";
import { Icon, IconName } from "../components/Icon";
import { Button } from "../components/Button";
import { GlassPanel } from "../components/GlassPanel";
import { motion, scaleIn } from "../motion";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  icon?: IconName;
}

export function EmptyState({
  title,
  description,
  action,
  actionLabel,
  onAction,
  icon = "info",
}: EmptyStateProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={scaleIn}
      className="w-full"
    >
      <GlassPanel className="flex flex-col items-center justify-center p-12 text-center min-h-[400px] border-white/5 bg-white/2 backdrop-blur-xl rounded-3xl">
        <div className="w-20 h-20 bg-gradient-to-tr from-white/10 to-white/5 rounded-2xl flex items-center justify-center mb-8 shadow-2xl border border-white/10 rotate-3 group-hover:rotate-0 transition-transform">
          <Icon name={icon} className="w-10 h-10 text-white opacity-90" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{title}</h3>
        <p className="text-gray-400 max-w-sm mb-10 leading-relaxed">{description}</p>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {action ? (
            action
          ) : (
            actionLabel && onAction && (
              <Button onClick={onAction} size="lg" className="px-10 h-14 rounded-2xl">
                {actionLabel}
              </Button>
            )
          )}
        </div>
      </GlassPanel>
    </motion.div>
  );
}


