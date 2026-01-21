"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@vayva/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
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
            if (!res.ok)
                throw new Error("Failed to delete account");
            const data = await res.json();
            // Force sign out or redirect (implementation depends on auth provider)
            // For now, redirect to public home
            window.location.href = "/";
        }
        catch (error) {
            console.error(error);
            alert("Failed to schedule deletion. Please try again.");
        }
        finally {
            setLoading(false);
            setIsOpen(false);
        }
    };
    return (_jsxs(Card, { className: "border-red-100 bg-red-50/10", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-red-600", children: "Danger Zone" }), _jsx(CardDescription, { children: "Irreversible actions for your account." })] }), _jsx(CardContent, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("h4", { className: "font-medium", children: "Delete Account" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Permanently delete your account and all associated data." })] }), _jsxs(Dialog, { open: isOpen, onOpenChange: setIsOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { variant: "destructive", children: "Delete Account" }) }), _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Are you absolutely sure?" }), _jsx(DialogDescription, { children: "This action schedules your account for permanent deletion in 7 days. You will lose access to the platform immediately." })] }), _jsxs("div", { className: "py-4 space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Why are you leaving?" }), _jsx("textarea", { className: "w-full p-2 border rounded-md text-sm", rows: 3, value: reason, onChange: (e) => setReason(e.target.value), placeholder: "Optional feedback..." })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", id: "confirm-delete", checked: confirmed, onChange: (e) => setConfirmed(e.target.checked), className: "rounded border-gray-300" }), _jsx("label", { htmlFor: "confirm-delete", className: "text-sm", children: "I understand this action is permanent." })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setIsOpen(false), children: "Cancel" }), _jsx(Button, { variant: "destructive", onClick: handleDelete, disabled: !confirmed || loading, isLoading: loading, children: "Confirm Deletion" })] })] })] })] }) })] }));
}
