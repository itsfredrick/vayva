"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, Input } from "@vayva/ui";
import { Label } from "@/components/ui/label";
import { DeleteAccountCard } from "@/components/settings/DeleteAccountCard";

export default function ProfileSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                <p className="text-muted-foreground">Manage your personal account settings.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your name and contact details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Full Name</Label>
                        <Input defaultValue="Admin User" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Email</Label>
                        <Input defaultValue="admin@vayva.ng" disabled />
                    </div>
                    <Button>Save Changes</Button>
                </CardContent>
            </Card>

            <DeleteAccountCard />
        </div >
    );
}
