"use client";

import { Button, Card, StatusChip } from "@vayva/ui";
import { format } from "date-fns";
import { Check, X, Calendar, User, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ViewingRequest {
    id: string;
    service: { title: string }; // Property
    startsAt: string;
    status: string; // PENDING, CONFIRMED, REJECTED
    metadata: {
        customerName: string;
        customerEmail: string;
        customerPhone?: string;
        type?: string;
    };
    customer?: { firstName: string; lastName: string; email: string; phone?: string };
}

interface ViewingRequestCardProps {
    request: ViewingRequest;
    onUpdate: () => void;
}

export function ViewingRequestCard({ request, onUpdate }: ViewingRequestCardProps) {
    const [isLoading, setIsLoading] = useState(false);

    const updateStatus = async (status: string) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/properties/viewings/${request.id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });

            if (!res.ok) throw new Error("Failed to update status");
            toast.success(status === "CONFIRMED" ? "Tour Confirmed" : "Request Declined");
            onUpdate();
        } catch (e) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const customerName = request.metadata?.customerName || (request.customer ? `${request.customer.firstName} ${request.customer.lastName}` : "Unknown Guest");
    const customerEmail = request.metadata?.customerEmail || request.customer?.email;
    const customerPhone = request.metadata?.customerPhone || request.customer?.phone;

    return (
        <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-md transition-shadow bg-white">
            <div className="flex items-start gap-4">
                {/* Date Box */}
                <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-700 rounded-lg w-16 h-16 shrink-0 border border-blue-100">
                    <span className="text-xs font-bold uppercase">{format(new Date(request.startsAt), "MMM")}</span>
                    <span className="text-xl font-bold">{format(new Date(request.startsAt), "d")}</span>
                </div>

                {/* Details */}
                <div className="space-y-1">
                    <h4 className="font-semibold text-gray-900 text-lg">{request.service.title}</h4>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                            <ClockIcon className="w-4 h-4" />
                            {format(new Date(request.startsAt), "h:mm a")}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <User className="w-4 h-4" />
                            {customerName}
                        </div>
                    </div>

                    {/* Expandable Contact Info (Simplified for now) */}
                    <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
                        {customerEmail && (
                            <div className="flex items-center gap-1">
                                <Mail size={12} /> {customerEmail}
                            </div>
                        )}
                        {customerPhone && (
                            <div className="flex items-center gap-1">
                                <Phone size={12} /> {customerPhone}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 self-end sm:self-center">
                {request.status === "PENDING" ? (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-50 text-red-600 border-red-100 hover:bg-red-100 hover:text-red-700"
                            onClick={() => updateStatus("CANCELLED")}
                            disabled={isLoading}
                        >
                            <X size={16} className="mr-1" /> Decline
                        </Button>
                        <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
                            onClick={() => updateStatus("CONFIRMED")}
                            disabled={isLoading}
                        >
                            <Check size={16} className="mr-1" /> Approve
                        </Button>
                    </>
                ) : (
                    <StatusChip status={request.status} />
                )}
            </div>
        </Card>
    );
}

function ClockIcon(props: unknown) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}
