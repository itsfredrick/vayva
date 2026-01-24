"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, Input } from "@vayva/ui";
import { Label } from "@/components/ui/label";
import { DeleteAccountCard } from "@/components/settings/DeleteAccountCard";
import { toast } from "sonner";

export default function ProfileSettingsPage() {
    const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "", phone: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch("/api/settings/profile")
            .then(res => res.json())
            .then(data => {
                setProfile(data);
                setLoading(false);
            })
            .catch(() => toast.error("Failed to load profile"));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/settings/profile", {
                method: "POST",
                body: JSON.stringify(profile)
            });
            if (res.ok) toast.success("Profile updated");
            else throw new Error();
        } catch {
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-12">Loading...</div>;

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
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>First Name</Label>
                            <Input
                                value={(profile.firstName as any)}
                                onChange={(e: any) => setProfile({ ...profile, firstName: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Last Name</Label>
                            <Input
                                value={(profile.lastName as any)}
                                onChange={(e: any) => setProfile({ ...profile, lastName: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label>Email</Label>
                        <Input value={(profile.email as any)} disabled />
                    </div>
                    <div className="grid gap-2">
                        <Label>Phone Number</Label>
                        <Input
                            value={(profile.phone as any)}
                            onChange={(e: any) => setProfile({ ...profile, phone: e.target.value })}
                        />
                    </div>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </CardContent>
            </Card>

            <DeleteAccountCard />
        </div >
    );
}
