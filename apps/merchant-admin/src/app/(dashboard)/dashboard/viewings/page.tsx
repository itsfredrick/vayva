"use client";

import { ViewingRequestCard } from "@/components/properties/ViewingRequestCard";
import { Button } from "@vayva/ui";
import { Home, Loader2, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

export default function ViewingsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchViewings = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/properties/viewings");
            const data = await res.json();
            if (data.viewings) {
                setRequests(data.viewings);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchViewings();
    }, []);

    const pendingRequests = requests.filter(r => r.status === "PENDING");
    const upcomingRequests = requests.filter(r => r.status === "CONFIRMED");

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tour Requests</h1>
                    <p className="text-gray-500">Manage incoming property viewing requests.</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchViewings} disabled={isLoading}>
                    <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
                </Button>
            </div>

            {/* Pending Requests Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <h2 className="text-lg font-semibold text-gray-900">New Requests ({pendingRequests.length})</h2>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-gray-400" /></div>
                ) : pendingRequests.length === 0 ? (
                    <div className="text-sm text-gray-500 italic pl-4">No new requests pending approval.</div>
                ) : (
                    <div className="grid gap-4">
                        {pendingRequests.map(req => (
                            <ViewingRequestCard key={req.id} request={req} onUpdate={fetchViewings} />
                        ))}
                    </div>
                )}
            </div>

            <div className="h-px bg-gray-100" />

            {/* Upcoming Tours Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <h2 className="text-lg font-semibold text-gray-900">Upcoming Tours ({upcomingRequests.length})</h2>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-gray-400" /></div>
                ) : upcomingRequests.length === 0 ? (
                    <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-8 text-center">
                        <Home className="mx-auto text-gray-300 mb-2" size={32} />
                        <p className="text-gray-500 font-medium">No upcoming tours scheduled.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {upcomingRequests.map(req => (
                            <ViewingRequestCard key={req.id} request={req} onUpdate={fetchViewings} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
