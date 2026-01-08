"use client";

import React from "react";
import { Icon } from "@vayva/ui";

export const ServicesOverview = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 1. Today's Schedule (Hero) */}
        <div className="lg:col-span-2 space-y-6 text-gray-400">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              Today's Schedule
            </h2>
            <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <Icon name="Calendar" size={16} />
              December 23, 2025
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mb-6">
              <Icon name="CalendarClock" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-950 mb-2">
              Your schedule is open
            </h3>
            <p className="text-gray-500 max-w-[280px] mb-8 leading-relaxed">
              No appointments booked for today. Share your booking link to start
              filling your calendar.
            </p>
            <div className="flex items-center gap-3">
              <button className="px-8 py-3 bg-black text-white rounded-full text-sm font-bold hover:scale-105 transition-transform">
                Share Booking Link
              </button>
              <button className="px-8 py-3 bg-white border border-gray-100 text-gray-900 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors">
                Add Manual Booking
              </button>
            </div>
          </div>
        </div>

        {/* 2. Side Panel */}
        <div className="space-y-6">
          {/* Booking Requests */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm overflow-hidden relative group">
            <h3 className="font-bold text-lg mb-4 flex items-center justify-between">
              Booking Requests
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
            </h3>
            <div className="p-4 rounded-2xl bg-green-50 border border-green-100 text-green-900 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-green-600 shadow-sm">
                <Icon name="Bell" size={14} />
              </div>
              <p className="text-xs font-bold">0 new requests</p>
            </div>
            <button className="w-full mt-4 py-3 text-sm font-bold text-gray-500 hover:text-black transition-colors">
              Manage availability →
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-[#0D1D1E] p-8 rounded-[40px] text-white">
              <p className="text-sm font-bold text-white/50 mb-1">
                Upcoming This Week
              </p>
              <p className="text-3xl font-bold">0</p>
            </div>
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
              <p className="text-sm font-bold text-gray-500 mb-1">
                Recent Clients
              </p>
              <div className="mt-4 flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400"
                  >
                    ?
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400 italic">
                  Empty
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
