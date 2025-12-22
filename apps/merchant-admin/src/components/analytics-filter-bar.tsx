'use client';

import React from 'react';
import { GlassPanel , Icon } from '@vayva/ui';

export function AnalyticsFilterBar() {
    return (
        <GlassPanel className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center sticky top-0 z-10 backdrop-blur-xl bg-[#142210]/50 border-white/5">
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {/* Date Range */}
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-white transition-colors whitespace-nowrap">
                    <Icon name="Calendar" size={14} className="text-text-secondary" />
                    Last 30 Days
                    <Icon name="ChevronDown" size={14} className="text-text-secondary" />
                </button>

                {/* Channel */}
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-white transition-colors whitespace-nowrap">
                    <Icon name="Filter" size={14} className="text-text-secondary" />
                    All Channels
                    <Icon name="ChevronDown" size={14} className="text-text-secondary" />
                </button>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                {/* Compare Toggle */}
                <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="toggle toggle-xs toggle-primary" defaultChecked />
                    <span className="text-xs text-text-secondary group-hover:text-white transition-colors">Compare to previous period</span>
                </label>

                {/* Export */}
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/5 text-xs font-bold text-text-secondary hover:text-white transition-colors">
                    <Icon name="Download" size={14} />
                    Export
                </button>
            </div>
        </GlassPanel>
    );
}
