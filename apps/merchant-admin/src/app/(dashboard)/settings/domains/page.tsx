"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, Input } from "@vayva/ui";

export default function DomainsSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Domains</h1>
                <p className="text-muted-foreground">Manage your custom storefront domains.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Connected Domains</CardTitle>
                    <CardDescription>Add a custom domain for your storefront.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input placeholder="myshop.com" />
                        <Button>Connect</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
