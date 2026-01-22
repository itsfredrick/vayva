"use client";

import { useState } from "react";
import { Button, Input, Label, Switch } from "@vayva/ui";
import { Save, User, Globe, Shield, CreditCard, Bell } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [category, setCategory] = useState("retail");

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    supportEmail: email,
                    businessCategory: category
                })
            });
            if (!res.ok) throw new Error("Failed to save");
            // toast.success("Settings saved");
        } catch (error) {
            console.error(error);
            // toast.error("Failed to save");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your store preferences and account details.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
                <Button variant="ghost" className="px-4 py-2 border-b-2 border-black font-medium text-sm rounded-none h-auto hover:bg-transparent hover:text-black">
                    General
                </Button>
                <Link href="/dashboard/settings/team">
                    <Button variant="ghost" className="px-4 py-2 border-b-2 border-transparent text-gray-500 hover:text-black font-medium text-sm whitespace-nowrap rounded-none h-auto">
                        Team
                    </Button>
                </Link>
                <Link href="/dashboard/settings/seo">
                    <Button variant="ghost" className="px-4 py-2 border-b-2 border-transparent text-gray-500 hover:text-black font-medium text-sm whitespace-nowrap rounded-none h-auto">
                        SEO
                    </Button>
                </Link>
                <Link href="/dashboard/settings/store-policies">
                    <Button variant="ghost" className="px-4 py-2 border-b-2 border-transparent text-gray-500 hover:text-black font-medium text-sm whitespace-nowrap rounded-none h-auto">
                        Policies
                    </Button>
                </Link>
            </div>

            {/* General Settings Form */}
            <div className="space-y-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="store-name">Store Name</Label>
                        <Input
                            id="store-name"
                            placeholder="Enter your store name"
                            value={name}
                            onChange={(e: unknown) => setName(e.target.value)}
                        />
                        <p className="text-xs text-gray-500">This is visible to your customers.</p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="support-email">Support Email</Label>
                        <Input
                            id="support-email"
                            placeholder="support@yourstore.com"
                            value={email}
                            onChange={(e: unknown) => setEmail(e.target.value)}
                        />
                        <p className="text-xs text-gray-500">Where customers can reach you.</p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category">Business Category</Label>
                        <select
                            id="category"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            aria-label="Select Business Category"
                        >
                            <option value="retail">Retail</option>
                            <option value="fashion">Fashion</option>
                            <option value="food">Food & Beverage</option>
                            <option value="services">Services</option>
                            <option value="digital">Digital Products</option>
                        </select>
                        <p className="text-xs text-gray-500">Helps us tailor your experience.</p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="space-y-0.5">
                            <Label className="text-base">Store Status</Label>
                            <p className="text-sm text-gray-500">
                                Turn your store on or off.
                            </p>
                        </div>
                        <Switch checked={true} onCheckedChange={() => { }} disabled />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
