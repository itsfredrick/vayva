"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@vayva/ui";

export default function PaymentsSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
                <p className="text-muted-foreground">Manage how your store receives payments.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Configure Paystack or other providers.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">You are currently using Paystack for all transactions.</p>
                    <Button variant="outline">Manage Paystack Account</Button>
                </CardContent>
            </Card>
        </div>
    );
}
