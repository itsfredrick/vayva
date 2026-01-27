"use client";

import React, { useState } from "react";
import { Button, Modal, Input, Label, Textarea } from "@vayva/ui";
import { AlertCircle, ShieldAlert } from "lucide-react";

interface DisputeDialogProps {
    orderId: string;
    orderNumber: string;
    totalAmount: number;
}

export function DisputeDialog({ orderId, orderNumber, totalAmount }: DisputeDialogProps): React.JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!reason || !description) {
            setError("Please provide a reason and description");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/disputes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId,
                    reason,
                    amount: totalAmount,
                    evidenceText: description
                })
            });

            if (res.ok) {
                setIsOpen(false);
                alert("Dispute opened successfully. A support agent will review your case.");
                window.location.reload(); // Refresh to show timeline update
            } else {
                const data = await res.json();
                setError(data.error || "Failed to open dispute");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button variant="outline" className="w-full mb-3 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary" size="sm" onClick={() => setIsOpen(true)}>
                <ShieldAlert className="w-4 h-4 mr-2" />
                Open Dispute
            </Button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Open Dispute">
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Opening a dispute for order <strong>{orderNumber}</strong>. Funds will be held until resolved.
                    </p>

                    {error && (
                        <div className="bg-gray-100 text-gray-800 p-3 rounded-md text-sm flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason for Dispute</Label>
                        <Input
                            id="reason"
                            name="reason"
                            placeholder="e.g. Items not received, Damaged goods"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Details & Evidence</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Please describe the issue in detail..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={loading}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={loading} className="glow-primary">
                            {loading ? "Opening..." : "Open Dispute"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
