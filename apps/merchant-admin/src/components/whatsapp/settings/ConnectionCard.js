"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button, Input } from "@vayva/ui";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { RefreshCw, CheckCircle2, AlertCircle, Link as LinkIcon, Unlink } from "lucide-react";
import { format } from "date-fns";
export function ConnectionCard({ channel, onUpdate }) {
    const isConnected = channel?.status === "CONNECTED";
    const [isLoading, setIsLoading] = useState(false);
    const [credentials, setCredentials] = useState({
        phoneNumberId: channel?.phoneNumberId || "",
        wabaId: channel?.wabaId || "",
    });
    const handleConnect = async () => {
        if (!credentials.phoneNumberId || !credentials.wabaId) {
            toast.error("Please enter both Phone Number ID and WABA ID");
            return;
        }
        setIsLoading(true);
        try {
            await onUpdate({
                ...credentials,
                status: "CONNECTED",
                provider: "meta",
            });
            toast.success("WhatsApp Connected Successfully");
        }
        catch (error) {
            toast.error("Failed to connect");
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleDisconnect = async () => {
        if (!confirm("Disconnecting will stop the agent from replying. Continue?"))
            return;
        setIsLoading(true);
        try {
            await onUpdate({ status: "DISCONNECTED" });
            toast.success("Disconnected");
        }
        catch (error) {
            toast.error("Failed to disconnect");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: ["WhatsApp Connection", isConnected ? (_jsx(Badge, { className: "bg-green-500 hover:bg-green-600", children: "Active" })) : (_jsx(Badge, { variant: "secondary", children: "Disconnected" }))] }), _jsx(CardDescription, { children: "Connect your WhatsApp Business Account to enable the AI Agent." })] }), channel?.updatedAt && (_jsxs("div", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [_jsx(RefreshCw, { className: "h-3 w-3" }), "Last sync: ", format(new Date(channel.updatedAt), "MMM d, HH:mm")] }))] }) }), _jsx(CardContent, { className: "space-y-4", children: !isConnected ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-blue-50 dark:bg-blue-950/20 p-4 rounded-md text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2", children: [_jsx(AlertCircle, { className: "h-4 w-4 mt-0.5" }), _jsx("span", { children: "You need a Meta Developer Account. Enter your Phone Number ID and WhatsApp Business Account (WABA) ID found in the Meta Dashboard." })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Phone Number ID" }), _jsx(Input, { placeholder: "e.g. 10452...", value: credentials.phoneNumberId, onChange: (e) => setCredentials({ ...credentials, phoneNumberId: e.target.value }) })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "WABA ID" }), _jsx(Input, { placeholder: "e.g. 10833...", value: credentials.wabaId, onChange: (e) => setCredentials({ ...credentials, wabaId: e.target.value }) })] })] })) : (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "p-3 border rounded-md", children: [_jsx("span", { className: "text-xs text-muted-foreground block", children: "Phone Number ID" }), _jsx("span", { className: "font-mono text-sm", children: channel.phoneNumberId })] }), _jsxs("div", { className: "p-3 border rounded-md", children: [_jsx("span", { className: "text-xs text-muted-foreground block", children: "WABA ID" }), _jsx("span", { className: "font-mono text-sm", children: channel.wabaId })] })] }), _jsxs("div", { className: "bg-green-50 dark:bg-green-950/20 p-4 rounded-md text-sm text-green-800 dark:text-green-300 flex items-center gap-2", children: [_jsx(CheckCircle2, { className: "h-4 w-4" }), _jsx("span", { children: "Agent is online and listening for messages." })] })] })) }), _jsx(CardFooter, { className: "justify-end border-t pt-4", children: !isConnected ? (_jsxs(Button, { onClick: handleConnect, disabled: isLoading, children: [isLoading ? _jsx(RefreshCw, { className: "mr-2 h-4 w-4 animate-spin" }) : _jsx(LinkIcon, { className: "mr-2 h-4 w-4" }), "Connect Account"] })) : (_jsxs(Button, { variant: "destructive", onClick: handleDisconnect, disabled: isLoading, children: [isLoading ? _jsx(RefreshCw, { className: "mr-2 h-4 w-4 animate-spin" }) : _jsx(Unlink, { className: "mr-2 h-4 w-4" }), "Disconnect"] })) })] }));
}
