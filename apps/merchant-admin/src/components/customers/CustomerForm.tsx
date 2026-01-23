"use client";

import React, { useState } from "react";
import { Button, Input, Label, Icon } from "@vayva/ui";
import { useRouter } from "next/navigation";

interface CustomerFormProps {
    initialData?: unknown;
    onSuccess: () => void;
}

export function CustomerForm({ initialData, onSuccess }: CustomerFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Split name if initialData exists
    const initialFirstName = initialData?.name?.split(" ")[0] || "";
    const initialLastName = initialData?.name?.split(" ").slice(1).join(" ") || "";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            notes: formData.get("notes"),
        };

        try {
            const url = initialData
                ? `/api/customers/${initialData.id}`
                : "/api/customers";
            const method = initialData ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Something went wrong");
            }

            router.refresh();
            onSuccess();
        } catch (err: any) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                        id="firstName"
                        name="firstName"
                        defaultValue={initialFirstName}
                        placeholder="e.g. Chioma"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                        id="lastName"
                        name="lastName"
                        defaultValue={initialLastName}
                        placeholder="e.g. Okeke"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={initialData?.email}
                    placeholder="customer@example.com"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={initialData?.phone}
                    placeholder="+234 ..."
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Internal Notes</Label>
                <textarea
                    id="notes"
                    name="notes"
                    className="w-full min-h-[100px] p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-sm"
                    placeholder="Add any private notes about this customer..."
                    defaultValue={initialData?.notes}
                />
            </div>

            <div className="pt-4 flex gap-3">
                <Button
                    type="submit"
                    className="flex-1"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Icon name="Loader2" className="animate-spin mr-2" size={16} />
                    ) : null}
                    {initialData ? "Update Customer" : "Create Customer"}
                </Button>
            </div>
        </form>
    );
}
