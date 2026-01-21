"use client";

import React from "react";
import { Icon, Button } from "@vayva/ui";

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
              {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
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
              <Button variant="primary" size="lg" className="hover:scale-105">
                Share Booking Link
              </Button>
              <Button variant="secondary" size="lg" className="bg-white border border-gray-100 text-gray-900 hover:bg-gray-50">
                Add Manual Booking
              </Button>
            </div>
          </div>
        </div>

        {/* 2. Side Panel */}
        <div className="space-y-6">
          {/* Booking Requests */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm overflow-hidden relative group">
            <h3 className="font-bold text-lg mb-4 flex items-center justify-between">
              Booking Requests
              <span className="w-2 h-2 rounded-full bg-gray-300"></span>
            </h3>
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-gray-500 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm">
                <Icon name="Bell" size={14} />
              </div>
              <p className="text-xs font-bold">No new requests</p>
            </div>
            <Button size="lg" className="w-full mt-4 text-gray-500 hover:text-black">
              Manage availability →
            </Button>
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
              <div className="mt-4 flex -space-x-3 text-sm text-gray-400 italic">
                No recent clients
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
