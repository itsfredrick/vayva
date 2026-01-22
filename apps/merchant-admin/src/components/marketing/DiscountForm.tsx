
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@vayva/ui";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function DiscountForm({ id }: { id?: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!id);

    // State
    const [method, setMethod] = useState<"CODE" | "AUTOMATIC">("CODE");
    const [type, setType] = useState<"PERCENTAGE" | "FIXED_AMOUNT">("PERCENTAGE");

    const [formData, setFormData] = useState({
        title: "",
        code: "",
        value: "",
        minOrder: "",
        startsAt: new Date().toISOString().slice(0, 16),
        endsAt: "",
        usageLimit: ""
    });

    useEffect(() => {
        if (id) {
            fetch(`/api/marketing/discounts/${id}`)
                .then(res => res.json())
                .then(data => {
                    setFormData({
                        title: data.name || "",
                        code: data.code || "",
                        value: (data.valuePercent || data.valueAmount || "").toString(),
                        minOrder: (data.minOrderAmount || "").toString(),
                        startsAt: data.startsAt ? new Date(data.startsAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
                        endsAt: data.endsAt ? new Date(data.endsAt).toISOString().slice(0, 16) : "",
                        usageLimit: (data.usageLimitTotal || "").toString()
                    });
                    setMethod(data.requiresCoupon ? "CODE" : "AUTOMATIC");
                    setType(data.type || "PERCENTAGE");
                })
                .catch(err => toast.error("Failed to load discount"))
                .finally(() => setFetching(false));
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (method === "CODE" && !formData.code) throw new Error("Code is required");
            if (!formData.title) throw new Error("Title is required");
            if (!formData.value) throw new Error("Discount value is required");

            const payload = {
                name: formData.title,
                code: method === "CODE" ? formData.code.toUpperCase() : undefined,
                type,
                valuePercent: type === "PERCENTAGE" ? formData.value : undefined,
                valueAmount: type === "FIXED_AMOUNT" ? formData.value : undefined,
                minOrderAmount: formData.minOrder || undefined,
                startsAt: formData.startsAt,
                endsAt: formData.endsAt || undefined,
                usageLimitTotal: formData.usageLimit ? parseInt(formData.usageLimit) : undefined
            };

            const res = await fetch(id ? `/api/marketing/discounts/${id}` : "/api/marketing/discounts", {
                method: id ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.error || `Failed to ${id ? "update" : "create"} discount`);

            toast.success(`Discount ${id ? "updated" : "created"} successfully`);
            router.push("/dashboard/marketing/discounts");

        } catch (err: unknown) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">

            {/* 1. Method & Code */}
            <Card>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <Button
                            type="button"
                            variant={method === "CODE" ? undefined : "outline"}
                            onClick={() => setMethod("CODE")}
                        >
                            Discount Code
                        </Button>
                        <Button
                            type="button"
                            variant={method === "AUTOMATIC" ? undefined : "outline"}
                            onClick={() => setMethod("AUTOMATIC")}
                        >
                            Automatic Discount
                        </Button>
                    </div>

                    {method === "CODE" ? (
                        <div>
                            <Label>Discount Code</Label>
                            <Input
                                value={formData.code}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                placeholder="SUMMER2024"
                                className="font-mono uppercase text-lg"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Customers will enter this code at checkout.</p>
                        </div>
                    ) : (
                        <div>
                            <Label>Title</Label>
                            <Input
                                value={formData.title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Summer Sale"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Customers will see this in their cart.</p>
                        </div>
                    )}

                    {method === "CODE" && (
                        <div>
                            <Label>Internal Name (Optional)</Label>
                            <Input
                                value={formData.title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Summer Sale Campaign"
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 2. Value */}
            <Card>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Type</Label>
                            <Select value={type} onValueChange={(v: unknown) => setType(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                                    <SelectItem value="FIXED_AMOUNT">Fixed Amount (₦)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Value</Label>
                            <Input
                                type="number"
                                value={formData.value}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, value: e.target.value })}
                                placeholder={type === "PERCENTAGE" ? "20" : "1000"}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 3. Requirements & Limits */}
            <Card>
                <CardContent className="pt-6 space-y-4">
                    <h3 className="font-medium text-sm text-gray-900 border-b pb-2">Requirements</h3>
                    <div>
                        <Label>Minimum Order Amount (Optional)</Label>
                        <Input
                            type="number"
                            value={formData.minOrder}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, minOrder: e.target.value })}
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <Label>Usage Limit (Total)</Label>
                        <Input
                            type="number"
                            value={formData.usageLimit}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, usageLimit: e.target.value })}
                            placeholder="No limit"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Total number of times this discount can be used.</p>
                    </div>
                </CardContent>
            </Card>

            {/* 4. Schedule */}
            <Card>
                <CardContent className="pt-6 space-y-4">
                    <h3 className="font-medium text-sm text-gray-900 border-b pb-2">Active Dates</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Start Date</Label>
                            <Input
                                type="datetime-local"
                                value={formData.startsAt}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, startsAt: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>End Date (Optional)</Label>
                            <Input
                                type="datetime-local"
                                value={formData.endsAt}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, endsAt: e.target.value })}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {id ? "Update Discount" : "Save Discount"}
                </Button>
            </div>
        </form>
    );
}
