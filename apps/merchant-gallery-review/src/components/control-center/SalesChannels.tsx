import React from "react";
import { SalesChannel } from "@vayva/shared";
import { Icon, cn } from "@vayva/ui";
import { Switch } from "@/components/ui/Switch";

interface SalesChannelsProps {
  channels: SalesChannel[];
}

export const SalesChannels = ({ channels }: SalesChannelsProps) => {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Sales Channels</h2>
          <p className="text-sm text-gray-500">
            Where customers can place orders.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center justify-between hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                  channel.type === "whatsapp"
                    ? "bg-[#25D366]/10 text-[#25D366]"
                    : "bg-indigo-50 text-indigo-600",
                )}
              >
                <Icon
                  name={channel.type === "whatsapp" ? "MessageCircle" : "Globe"}
                  size={24}
                />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{channel.name}</h4>
                <a
                  href={channel.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-gray-500 hover:text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                >
                  Visit Channel <Icon name="ExternalLink" size={10} />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Test Toggle - In real app would handle change */}
              <span
                className={cn(
                  "text-xs font-bold uppercase tracking-wider",
                  channel.status === "enabled"
                    ? "text-green-600"
                    : "text-gray-400",
                )}
              >
                {channel.status}
              </span>
              {/* Using Switch component if available or custom toggle */}
              <div
                className={cn(
                  "w-11 h-6 rounded-full relative transition-colors cursor-pointer",
                  channel.status === "enabled" ? "bg-green-500" : "bg-gray-200",
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform",
                    channel.status === "enabled"
                      ? "left-[calc(100%-1.375rem)]"
                      : "left-0.5",
                  )}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
