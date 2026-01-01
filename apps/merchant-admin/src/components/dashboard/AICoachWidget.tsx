"use client";

import React, { useEffect, useState } from "react";
import { Icon, cn } from "@vayva/ui";
import { AICoachMessage } from "@/app/api/ai/coach/messages/route";
import { useRouter } from "next/navigation";

export const AICoachWidget = () => {
  const [messages, setMessages] = useState<AICoachMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/ai/coach/messages")
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const latestMessage = messages[0];

  if (loading || !latestMessage) return null;

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-6 relative overflow-hidden">
      <div className="flex items-start gap-4 z-10 relative">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-green-200">
          <Icon name="MessageCircle" className="text-white" size={20} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-green-700 uppercase tracking-wide">
              Daily Coach
            </span>
            <span className="text-[10px] text-green-600/70">Just now</span>
          </div>
          <p className="text-gray-900 font-medium text-sm whitespace-pre-line leading-relaxed">
            {latestMessage.content}
          </p>
          {latestMessage.actions && (
            <div className="flex gap-2 mt-3">
              {latestMessage.actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => action.link && router.push(action.link)}
                  className="bg-white text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-green-200 hover:bg-green-50 transition-colors shadow-sm"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="text-green-300 hover:text-green-600 transition-colors p-1">
          <Icon name="X" size={16} />
        </button>
      </div>

      {/* Decoration */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-green-200/20 rounded-full blur-2xl" />
    </div>
  );
};
