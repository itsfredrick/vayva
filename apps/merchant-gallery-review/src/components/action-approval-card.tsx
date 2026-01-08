import React, { useState } from "react";
import { Button, Icon } from "@vayva/ui";

type ActionType = "delivery" | "discount" | "refund" | "general";
type RiskLevel = "low" | "med" | "high";

interface ActionApprovalCardProps {
  type: ActionType;
  title: string;
  description: string;
  risk: RiskLevel;
  onApprove: () => void;
  onReject: () => void;
}

export function ActionApprovalCard({
  type,
  title,
  description,
  risk,
  onApprove,
  onReject,
}: ActionApprovalCardProps) {
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">(
    "pending",
  );

  const handleApprove = () => {
    setStatus("approved");
    onApprove();
  };

  const handleReject = () => {
    setStatus("rejected");
    onReject();
  };

  if (status !== "pending") {
    return (
      <div
        className={`p-4 rounded-lg border ${status === "approved" ? "bg-state-success/10 border-state-success/20" : "bg-state-danger/10 border-state-danger/20"} flex items-center gap-3`}
      >
        <Icon
          name={(status === "approved" ? "CheckCircle" : "X") as any}
          className={
            status === "approved" ? "text-state-success" : "text-state-danger"
          }
        />
        <span
          className={`text-sm font-bold ${status === "approved" ? "text-state-success" : "text-state-danger"}`}
        >
          Action {status === "approved" ? "Approved" : "Rejected"}
        </span>
        <Button
          size="sm"
          variant="ghost"
          className="ml-auto text-xs opacity-50 hover:opacity-100"
          onClick={() => setStatus("pending")}
        >
          Undo
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 relative overflow-hidden group">
      <div
        className={`absolute top-0 left-0 w-1 h-full 
                ${risk === "high" ? "bg-state-danger" : risk === "med" ? "bg-state-warning" : "bg-blue-500"}
            `}
      />

      <div className="flex justify-between items-start pl-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-white text-sm">{title}</span>
            {risk === "high" && (
              <span className="text-[10px] font-bold text-state-danger bg-state-danger/10 px-1.5 rounded uppercase tracking-wider">
                High Risk
              </span>
            )}
          </div>
          <p className="text-xs text-text-secondary">{description}</p>
        </div>
        <div className="p-2 bg-white/5 rounded-lg text-white/50">
          <Icon
            name={
              (type === "refund"
                ? "Banknote"
                : type === "delivery"
                  ? "Truck"
                  : "Tag") as any
            }
            size={20}
          />
        </div>
      </div>

      <div className="flex gap-2 pl-2 pt-1">
        <Button
          size="sm"
          className="flex-1 bg-state-success hover:bg-state-success/80 text-black border-none h-8 text-xs font-bold"
          onClick={handleApprove}
        >
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 h-8 text-xs hover:bg-state-danger/10 hover:text-state-danger hover:border-state-danger/50"
          onClick={handleReject}
        >
          Reject
        </Button>
      </div>
    </div>
  );
}
