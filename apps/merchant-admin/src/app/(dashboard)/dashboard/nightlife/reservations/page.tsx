"use client";

import React, { useState, useEffect } from "react";
import { Button, Card, Icon } from "@vayva/ui";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Calendar, Users, Wine, Phone, Clock, Check, X } from "lucide-react";
import { format } from "date-fns";

interface Reservation {
    id: string;
    guestName: string;
    guestPhone: string;
    guestEmail: string;
    tableName: string;
    tableType: string;
    date: string;
    time: string;
    partySize: number;
    minimumSpend: number;
    bottles: { name: string; quantity: number; price: number }[];
    totalAmount: number;
    status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
    specialRequests: string;
    createdAt: string;
}

export default function ReservationsPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "tonight" | "upcoming" | "past">("tonight");

    useEffect(() => {
        loadReservations();
    }, [filter]);

    const loadReservations = async () => {
        try {
            const res = await fetch(`/api/nightlife/reservations?filter=${filter}`);
            if (!res.ok) throw new Error("Failed to load");
            const data = await res.json();
            setReservations(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error("Failed to load reservations");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/nightlife/reservations/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error("Failed to update");
            toast.success(`Reservation ${status.toLowerCase()}`);
            loadReservations();
        } catch (error) {
            toast.error("Failed to update reservation");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "CONFIRMED": return "bg-green-100 text-green-800";
            case "PENDING": return "bg-yellow-100 text-yellow-800";
            case "CANCELLED": return "bg-red-100 text-red-800";
            case "COMPLETED": return "bg-blue-100 text-blue-800";
            case "NO_SHOW": return "bg-gray-100 text-gray-600";
            default: return "bg-gray-100 text-gray-600";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Table Reservations</h1>
                    <p className="text-gray-500">Manage table bookings and bottle pre-orders</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-gray-200 pb-4">
                {[
                    { key: "tonight", label: "Tonight" },
                    { key: "upcoming", label: "Upcoming" },
                    { key: "past", label: "Past" },
                    { key: "all", label: "All" },
                ].map((tab) => (
                    <Button
                        key={tab.key}
                        variant={filter === tab.key ? "primary" : "ghost"}
                        size="sm"
                        onClick={() => setFilter(tab.key as any)}
                    >
                        {tab.label}
                    </Button>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="text-sm text-gray-500">Total Reservations</div>
                    <div className="text-2xl font-bold">{reservations.length}</div>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-gray-500">Confirmed</div>
                    <div className="text-2xl font-bold text-green-600">
                        {reservations.filter((r) => r.status === "CONFIRMED").length}
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-gray-500">Pending Approval</div>
                    <div className="text-2xl font-bold text-yellow-600">
                        {reservations.filter((r) => r.status === "PENDING").length}
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-gray-500">Expected Revenue</div>
                    <div className="text-2xl font-bold">
                        ₦{reservations
                            .filter((r) => r.status === "CONFIRMED" || r.status === "PENDING")
                            .reduce((sum, r) => sum + r.totalAmount, 0)
                            .toLocaleString()}
                    </div>
                </Card>
            </div>

            {/* Reservations List */}
            {reservations.length === 0 ? (
                <Card className="p-12 text-center">
                    <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-900 text-lg">No reservations</h3>
                    <p className="text-gray-500 text-sm mt-1">
                        {filter === "tonight" ? "No reservations for tonight" : "No reservations found"}
                    </p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {reservations.map((reservation) => (
                        <Card key={reservation.id} className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                                {/* Guest Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                            <Users size={18} className="text-purple-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{reservation.guestName}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Phone size={12} />
                                                {reservation.guestPhone}
                                            </div>
                                        </div>
                                        <Badge className={getStatusColor(reservation.status)}>
                                            {reservation.status}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">Date</span>
                                            <p className="font-medium">{format(new Date(reservation.date), "EEE, MMM d")}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Time</span>
                                            <p className="font-medium">{reservation.time}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Table</span>
                                            <p className="font-medium">{reservation.tableName} ({reservation.tableType})</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Party Size</span>
                                            <p className="font-medium">{reservation.partySize} guests</p>
                                        </div>
                                    </div>

                                    {reservation.bottles.length > 0 && (
                                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-2 text-sm font-medium mb-2">
                                                <Wine size={14} />
                                                Bottle Pre-Order
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {reservation.bottles.map((bottle, i) => (
                                                    <span key={i} className="text-xs bg-white px-2 py-1 rounded border">
                                                        {bottle.quantity}x {bottle.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {reservation.specialRequests && (
                                        <div className="mt-3 text-sm text-gray-600">
                                            <span className="font-medium">Note:</span> {reservation.specialRequests}
                                        </div>
                                    )}
                                </div>

                                {/* Amount & Actions */}
                                <div className="lg:text-right space-y-4">
                                    <div>
                                        <div className="text-sm text-gray-500">Total Amount</div>
                                        <div className="text-2xl font-bold">₦{reservation.totalAmount.toLocaleString()}</div>
                                        <div className="text-xs text-gray-400">Min. spend: ₦{reservation.minimumSpend.toLocaleString()}</div>
                                    </div>

                                    {reservation.status === "PENDING" && (
                                        <div className="flex gap-2 lg:justify-end">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => updateStatus(reservation.id, "CANCELLED")}
                                                className="text-red-600 border-red-200 hover:bg-red-50"
                                            >
                                                <X size={14} className="mr-1" />
                                                Decline
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => updateStatus(reservation.id, "CONFIRMED")}
                                            >
                                                <Check size={14} className="mr-1" />
                                                Confirm
                                            </Button>
                                        </div>
                                    )}

                                    {reservation.status === "CONFIRMED" && (
                                        <div className="flex gap-2 lg:justify-end">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => updateStatus(reservation.id, "NO_SHOW")}
                                            >
                                                No Show
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => updateStatus(reservation.id, "COMPLETED")}
                                            >
                                                Mark Completed
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
