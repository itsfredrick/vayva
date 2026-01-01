"use client";

import React from "react";
import { Button, Icon, Drawer } from "@vayva/ui";
import { useRouter } from "next/navigation";

export const DashboardTransitionOverlay = () => {
  const router = useRouter();
  // Simulate check, in reality simpler to just show if param exists
  // const searchParams = useSearchParams();
  // const show = searchParams.get('welcome') === 'true';

  // Since we can't easily hook into dashboard page right now without seeing it,
  // I'll provide this component for the user to place in `app/admin/dashboard/page.tsx`.

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-black text-white p-8">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
            <span className="font-bold text-2xl">V</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Your system is ready.</h1>
          <p className="text-gray-400">Welcome to your new command center.</p>
        </div>

        <div className="p-8 space-y-4">
          <button className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-black hover:bg-gray-50 transition-all flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
              <Icon name="Plus" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">
                Create your first order
              </h3>
              <p className="text-xs text-gray-500">Test the flow manually</p>
            </div>
            <Icon
              name="ArrowRight"
              className="ml-auto text-gray-300 group-hover:text-black"
            />
          </button>

          <button className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-black hover:bg-gray-50 transition-all flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <Icon name="Zap" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Connect to WhatsApp</h3>
              <p className="text-xs text-gray-500">Start automated selling</p>
            </div>
            <Icon
              name="ArrowRight"
              className="ml-auto text-gray-300 group-hover:text-black"
            />
          </button>

          <div className="pt-4 mt-4 border-t border-gray-100 text-center">
            <button
              onClick={() => {
                /* dismiss logic */
              }}
              className="text-sm text-gray-400 hover:text-black"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
