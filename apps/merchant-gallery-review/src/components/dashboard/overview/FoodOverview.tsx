"use client";

import React from "react";
import { Icon, cn } from "@vayva/ui";

export const FoodOverview = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Kitchen Order Board */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
        {/* Column: New */}
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-2 mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                New
              </h2>
              <span className="px-2 py-0.5 bg-gray-100 rounded-full text-[10px] font-bold text-gray-600">
                0
              </span>
            </div>
            <Icon name="CircleDot" className="text-gray-300" size={16} />
          </div>
          <div className="flex-1 bg-gray-50/50 rounded-[32px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-200 shadow-sm mb-4">
              <Icon name="ChefHat" size={24} />
            </div>
            <p className="text-sm font-bold text-gray-400">
              Incoming orders appear here
            </p>
          </div>
        </div>

        {/* Column: Preparing */}
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-2 mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Preparing
              </h2>
              <span className="px-2 py-0.5 bg-orange-100 rounded-full text-[10px] font-bold text-orange-600">
                0
              </span>
            </div>
            <Icon name="Flame" className="text-orange-200" size={16} />
          </div>
          <div className="flex-1 bg-gray-50/50 rounded-[32px] border-2 border-dashed border-gray-200"></div>
        </div>

        {/* Column: Ready */}
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-2 mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Ready
              </h2>
              <span className="px-2 py-0.5 bg-green-100 rounded-full text-[10px] font-bold text-green-600">
                0
              </span>
            </div>
            <Icon
              name={"CheckCircle2" as any}
              className="text-green-200"
              size={16}
            />
          </div>
          <div className="flex-1 bg-gray-50/50 rounded-[32px] border-2 border-dashed border-gray-200"></div>
        </div>
      </section>

      {/* 2. Operations & Status */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm col-span-1 md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Prep Time Control</h3>
            <div className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-full border border-green-100">
              Normal Load
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <button className="p-4 rounded-2xl bg-gray-900 text-white flex flex-col items-center gap-2 shadow-lg shadow-black/10 transition-transform active:scale-95">
              <span className="text-xs font-bold">Standard</span>
              <span className="text-lg font-bold">~15m</span>
            </button>
            <button className="p-4 rounded-2xl bg-white border border-gray-100 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors">
              <span className="text-xs font-bold text-gray-500">Busy</span>
              <span className="text-lg font-bold">~30m</span>
            </button>
            <button className="p-4 rounded-2xl bg-white border border-gray-100 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors">
              <span className="text-xs font-bold text-gray-500">Rush</span>
              <span className="text-lg font-bold">~45m+</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-gray-500 mb-4">
            Menu Availability
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-900 font-medium">Active Items</span>
              <span className="font-bold">12</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 font-medium">Sold Out</span>
              <span className="font-bold text-orange-500">2</span>
            </div>
          </div>
          <button className="w-full mt-6 py-2 bg-gray-50 text-gray-900 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors">
            Manage Menu
          </button>
        </div>

        <div className="bg-[#0D1D1E] p-6 rounded-3xl text-white">
          <p className="text-sm font-bold text-white/50 mb-4">Orders Today</p>
          <p className="text-3xl font-bold mb-2">0</p>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest italic">
            Waiting for morning rush
          </p>
        </div>
      </section>
    </div>
  );
};
