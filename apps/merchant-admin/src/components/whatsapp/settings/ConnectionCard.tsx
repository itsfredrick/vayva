"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button, Input } from "@vayva/ui";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { RefreshCw, CheckCircle2, AlertCircle, Link as LinkIcon, Unlink } from "lucide-react";
import { format } from "date-fns";

interface ConnectionCardProps {
    channel: unknown;
    onUpdate: (data: unknown) => Promise<void>;
}

export function ConnectionCard({ channel, onUpdate }: ConnectionCardProps) {
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
        } catch (error) {
            toast.error("Failed to connect");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisconnect = async () => {
        if (!confirm("Disconnecting will stop the agent from replying. Continue?")) return;
        setIsLoading(true);
        try {
            await onUpdate({ status: "DISCONNECTED" });
            toast.success("Disconnected");
        } catch (error) {
            toast.error("Failed to disconnect");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            WhatsApp Connection
                            {isConnected ? (
                                <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                            ) : (
                                <Badge variant="secondary">Disconnected</Badge>
                            )}
                        </CardTitle>
                        <CardDescription>
                            Connect your WhatsApp Business Account to enable the AI Agent.
                        </CardDescription>
                    </div>
                    {channel?.updatedAt && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <RefreshCw className="h-3 w-3" />
                            Last sync: {format(new Date(channel.updatedAt), "MMM d, HH:mm")}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {!isConnected ? (
                    <div className="space-y-4">
                        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-md text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 mt-0.5" />
                            <span>
                                You need a Meta Developer Account. Enter your Phone Number ID and WhatsApp Business Account (WABA) ID found in the Meta Dashboard.
                            </span>
                        </div>
                        <div className="grid gap-2">
                            <Label>Phone Number ID</Label>
                            <Input
                                placeholder="e.g. 10452..."
                                value={credentials.phoneNumberId}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCredentials({ ...credentials, phoneNumberId: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>WABA ID</Label>
                            <Input
                                placeholder="e.g. 10833..."
                                value={credentials.wabaId}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCredentials({ ...credentials, wabaId: e.target.value })}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 border rounded-md">
                                <span className="text-xs text-muted-foreground block">Phone Number ID</span>
                                <span className="font-mono text-sm">{channel.phoneNumberId}</span>
                            </div>
                            <div className="p-3 border rounded-md">
                                <span className="text-xs text-muted-foreground block">WABA ID</span>
                                <span className="font-mono text-sm">{channel.wabaId}</span>
                            </div>
                        </div>
                        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-md text-sm text-green-800 dark:text-green-300 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Agent is online and listening for messages.</span>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="justify-end border-t pt-4">
                {!isConnected ? (
                    <Button onClick={handleConnect} disabled={isLoading}>
                        {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <LinkIcon className="mr-2 h-4 w-4" />}
                        Connect Account
                    </Button>
                ) : (
                    <Button variant="destructive" onClick={handleDisconnect} disabled={isLoading}>
                        {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Unlink className="mr-2 h-4 w-4" />}
                        Disconnect
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
