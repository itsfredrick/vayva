"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function NotificationsSettingsPage() {
    const [email, setEmail] = useState(true);
    const [marketing, setMarketing] = useState(false);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                <p className="text-muted-foreground">Configure how you want to be notified.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>Choose your preferred notification channels.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>Email Notifications</Label>
                        <Switch checked={email} onCheckedChange={setEmail} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label>Marketing Updates</Label>
                        <Switch checked={marketing} onCheckedChange={setMarketing} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
