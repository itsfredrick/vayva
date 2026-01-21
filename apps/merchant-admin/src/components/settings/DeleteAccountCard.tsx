"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@vayva/ui";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export function DeleteAccountCard() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState("");
    const [confirmed, setConfirmed] = useState(false);

    const handleDelete = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/account/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason }),
            });

            if (!res.ok) throw new Error("Failed to delete account");

            const data = await res.json();

            // Force sign out or redirect (implementation depends on auth provider)
            // For now, redirect to public home
            window.location.href = "/";

        } catch (error) {
            console.error(error);
            alert("Failed to schedule deletion. Please try again.");
        } finally {
            setLoading(false);
            setIsOpen(false);
        }
    };

    return (
        <Card className="border-red-100 bg-red-50/10">
            <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                <CardDescription>
                    Irreversible actions for your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h4 className="font-medium">Delete Account</h4>
                        <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all associated data.
                        </p>
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button variant="destructive">Delete Account</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                <DialogDescription>
                                    This action schedules your account for permanent deletion in 7 days.
                                    You will lose access to the platform immediately.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="py-4 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Why are you leaving?</label>
                                    <textarea
                                        className="w-full p-2 border rounded-md text-sm"
                                        rows={3}
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="Optional feedback..."
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="confirm-delete"
                                        checked={confirmed}
                                        onChange={(e) => setConfirmed(e.target.checked)}
                                        className="rounded border-gray-300"
                                    />
                                    <label htmlFor="confirm-delete" className="text-sm">
                                        I understand this action is permanent.
                                    </label>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    disabled={!confirmed || loading}
                                    isLoading={loading}
                                >
                                    Confirm Deletion
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
}
