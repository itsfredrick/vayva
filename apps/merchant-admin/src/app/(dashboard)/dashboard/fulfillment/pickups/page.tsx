"use client";

import { useState } from "react";
import { Button } from "@vayva/ui";
import { PackageCheck, MapPin, Search } from "lucide-react";

export default function PickupsPage() {
    const [activeTab, setActiveTab] = useState("READY");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pickups</h1>
                    <p className="text-slate-500">Manage orders waiting for customer collection.</p>
                </div>
            </div>

            <div className="flex items-center gap-4 border-b border-slate-200">
                <Tab label="Ready for Pickup" active={activeTab === "READY"} onClick={() => setActiveTab("READY")} count={0} />
                <Tab label="Completed" active={activeTab === "COMPLETED"} onClick={() => setActiveTab("COMPLETED")} />
                <Tab label="Cancelled" active={activeTab === "CANCELLED"} onClick={() => setActiveTab("CANCELLED")} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[300px] flex flex-col items-center justify-center p-12 text-center">
                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <PackageCheck className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">No pickups found</h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                    {activeTab === "READY"
                        ? "There are no orders currently waiting for pickup. New pickup orders will appear here."
                        : `No ${activeTab.toLowerCase()} pickup orders found.`
                    }
                </p>
            </div>
        </div>
    );
}

interface TabProps {
    label: string;
    active: boolean;
    onClick: () => void;
    count?: number;
}

function Tab({ label, active, onClick, count }: TabProps) {
    return (
        <Button
            onClick={onClick}
            variant="ghost"
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 rounded-none h-auto hover:bg-transparent ${active
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
        >
            {label}
            {count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${active ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"}`}>
                    {count}
                </span>
            )}
        </Button>
    )
}
