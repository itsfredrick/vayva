"use client";

import React from "react";

export const TrustVisual = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square lg:aspect-video bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden p-8 flex flex-col items-center justify-center gap-8">
      <div className="flex items-center justify-between w-full h-full relative">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-green-50 to-green-500 via-green-200" />

        {/* Step 1: Chat */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-white border-2 border-green-100 shadow-xl flex items-center justify-center transition-transform hover:scale-110">
            <svg
              className="w-8 h-8 text-[#22C55E]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            WhatsApp Chat
          </span>
        </div>

        {/* Processing Indicator */}
        <div className="relative z-10 w-12 h-12 rounded-full bg-green-500 shadow-lg shadow-green-200 flex items-center justify-center animate-pulse">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>

        {/* Step 2: Record */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-white border-2 border-green-100 shadow-xl flex items-center justify-center transition-transform hover:scale-110">
            <svg
              className="w-8 h-8 text-[#22C55E]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Clean Records
          </span>
        </div>
      </div>

      {/* Float Labels */}
      <div className="absolute top-1/4 left-1/4 bg-white px-3 py-1 rounded-full shadow-lg border border-gray-50 text-[10px] font-bold text-[#22C55E] animate-bounce">
        Syncing...
      </div>
      <div className="absolute bottom-1/4 right-1/4 bg-white px-3 py-1 rounded-full shadow-lg border border-gray-50 text-[10px] font-bold text-blue-500">
        Verified!
      </div>
    </div>
  );
};
