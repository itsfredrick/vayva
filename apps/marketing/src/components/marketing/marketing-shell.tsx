import React from "react";

interface MarketingShellProps {
  children: React.ReactNode;
  className?: string;
}

export function MarketingShell({
  children,
  className = "",
}: MarketingShellProps) {
  return (
    <div
      className={`min-h-screen bg-[#F5F5F7] text-[#1d1d1f] font-sans ${className}`}
    >
      {/* Global Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Top-right subtle green glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#46EC13]/5 rounded-full blur-[120px]" />
        {/* Bottom-left subtle blue glow */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
        {/* Soft Vignette / Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent" />
      </div>

      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
