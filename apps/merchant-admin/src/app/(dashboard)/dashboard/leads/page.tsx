"use client";

import { useState, useEffect } from "react";
import { Button, Badge } from "@vayva/ui";
import { Plus, User, Phone, Mail, Clock, Tag } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Lead {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    notes: string | null;
    status: string;
    source: string;
    tags: string[];
    createdAt: string;
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        fetchLeads();
    }, [filter]);

    const fetchLeads = async () => {
        try {
            const params = filter !== "all" ? `?status=${filter}` : "";
            const res = await fetch(`/api/leads${params}`);
            if (res.ok) {
                const data = await res.json();
                setLeads(data.leads || []);
            }
        } catch (error) {
            console.error("Failed to fetch leads:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateLeadStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/leads/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                toast.success(`Lead marked as ${status}`);
                fetchLeads();
            }
        } catch (error) {
            toast.error("Failed to update lead");
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "default" | "success" | "warning" | "error"> = {
            new: "default",
            contacted: "warning",
            qualified: "success",
            converted: "success",
            lost: "error",
        };
        return <Badge variant={variants[status] || "default"}>{status}</Badge>;
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
                    <p className="text-gray-500">Track and manage potential customers.</p>
                </div>
                <Button className="bg-vayva-green text-white" onClick={() => setShowAddModal(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Lead
                </Button>
            </div>

            <div className="flex gap-2 flex-wrap">
                {["all", "new", "contacted", "qualified", "converted", "lost"].map((s) => (
                    <Button
                        key={s}
                        variant={filter === s ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setFilter(s)}
                    >
                        {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                    </Button>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-black rounded-full mx-auto" />
                    </div>
                ) : leads.length === 0 ? (
                    <div className="p-12 text-center">
                        <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="font-semibold text-gray-900">No leads yet</h3>
                        <p className="text-gray-500 text-sm mt-1">Add your first lead to start tracking prospects.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {leads.map((lead) => (
                            <div key={lead.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                            <User className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-gray-900">{lead.name || "Unknown"}</h3>
                                                {getStatusBadge(lead.status)}
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                {lead.email && (
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {lead.email}
                                                    </span>
                                                )}
                                                {lead.phone && (
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="h-3 w-3" />
                                                        {lead.phone}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                                <Clock className="h-3 w-3" />
                                                {format(new Date(lead.createdAt), "MMM d, yyyy")}
                                                {lead.source && (
                                                    <span className="flex items-center gap-1 ml-2">
                                                        <Tag className="h-3 w-3" />
                                                        {lead.source}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {lead.status === "new" && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => updateLeadStatus(lead.id, "contacted")}
                                            >
                                                Mark Contacted
                                            </Button>
                                        )}
                                        {lead.status === "contacted" && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => updateLeadStatus(lead.id, "qualified")}
                                            >
                                                Qualify
                                            </Button>
                                        )}
                                        {lead.status === "qualified" && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 text-white"
                                                    onClick={() => updateLeadStatus(lead.id, "converted")}
                                                >
                                                    Convert
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => updateLeadStatus(lead.id, "lost")}
                                                >
                                                    Lost
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
