"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, Input } from "@vayva/ui";
import { Label } from "@/components/ui/label";
import { DeleteAccountCard } from "@/components/settings/DeleteAccountCard";
export default function ProfileSettingsPage() {
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Profile" }), _jsx("p", { className: "text-muted-foreground", children: "Manage your personal account settings." })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Personal Information" }), _jsx(CardDescription, { children: "Update your name and contact details." })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Full Name" }), _jsx(Input, { defaultValue: "Admin User" })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Email" }), _jsx(Input, { defaultValue: "admin@vayva.ng", disabled: true })] }), _jsx(Button, { children: "Save Changes" })] })] }), _jsx(DeleteAccountCard, {})] }));
}
