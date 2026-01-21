"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, Input } from "@vayva/ui";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function BrandingPage() {
    const handleSave = () => {
        toast.success("Branding settings saved successfully!");
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Branding</h1>
                <p className="text-muted-foreground">
                    Customize your store's visual identity.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Logo & Colors</CardTitle>
                    <CardDescription>
                        Update your brand logo and primary accents.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="store-name">Store Name</Label>
                        <Input id="store-name" placeholder="Enter your store name" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="primary-color">Primary Color</Label>
                        <div className="flex gap-2">
                            <Input id="primary-color" type="color" className="w-12 p-1 h-10" defaultValue="#000000" />
                            <Input placeholder="#000000" className="flex-1" defaultValue="#000000" />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
