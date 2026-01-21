"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
export default function NotificationsSettingsPage() {
    const [email, setEmail] = useState(true);
    const [marketing, setMarketing] = useState(false);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Notifications" }), _jsx("p", { className: "text-muted-foreground", children: "Configure how you want to be notified." })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Preferences" }), _jsx(CardDescription, { children: "Choose your preferred notification channels." })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Label, { children: "Email Notifications" }), _jsx(Switch, { checked: email, onCheckedChange: setEmail })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Label, { children: "Marketing Updates" }), _jsx(Switch, { checked: marketing, onCheckedChange: setMarketing })] })] })] })] }));
}
