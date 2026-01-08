import React from "react";

const STATUS_CONFIG: Record<string, { bg: string; text: string }> = {
  Listed: { bg: "bg-state-success/10", text: "text-state-success" },
  Unlisted: { bg: "bg-white/10", text: "text-text-secondary" },
  Pending: { bg: "bg-state-warning/10", text: "text-state-warning" },
  Rejected: { bg: "bg-state-danger/10", text: "text-state-danger" },
};

export function MarketplaceStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG["Unlisted"];
  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text}`}
    >
      {status}
    </span>
  );
}
