import React from "react";
import { Domain } from "@vayva/shared";
import { Icon, Button, Badge, cn } from "@vayva/ui";

interface DomainSettingsProps {
  domains: Domain[];
  onAddDomain: () => void;
}

export const DomainSettings = ({
  domains,
  onAddDomain,
}: DomainSettingsProps) => {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Domains & Website</h2>
          <p className="text-sm text-gray-500">
            Control how customers access your store.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddDomain}
          className="gap-2"
        >
          <Icon name="Plus" size={16} /> Add Custom Domain
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
        {domains.map((domain) => (
          <div
            key={domain.id}
            className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                  domain.status === "active"
                    ? "bg-green-50 text-green-600"
                    : domain.status === "connecting"
                      ? "bg-blue-50 text-blue-600 animate-pulse"
                      : "bg-red-50 text-red-600",
                )}
              >
                <Icon
                  name={domain.type === "subdomain" ? "Globe" : "Link"}
                  size={20}
                />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  {domain.name}
                  {domain.type === "subdomain" && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Default
                    </span>
                  )}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-xs">
                  <span
                    className={cn(
                      "flex items-center gap-1 font-medium",
                      domain.status === "active"
                        ? "text-green-600"
                        : "text-amber-600",
                    )}
                  >
                    <div
                      className={cn(
                        "w-1.5 h-1.5 rounded-full bg-current",
                        domain.status !== "active" && "animate-pulse",
                      )}
                    />
                    {domain.status === "active" ? "Active" : "Connecting..."}
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500 flex items-center gap-1">
                    <Icon
                      name={domain.sslStatus === "active" ? "Lock" : "LockOpen"}
                      size={10}
                    />
                    SSL {domain.sslStatus === "active" ? "Secured" : "Pending"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {domain.status === "connecting" && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-blue-600 bg-blue-50 hover:bg-blue-100"
                >
                  Verify DNS
                </Button>
              )}
              <Button size="sm" variant="outline" className="text-gray-500">
                Manage
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
