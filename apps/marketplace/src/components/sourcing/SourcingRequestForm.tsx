"use client";

import { useState } from "react";
import { Button, Input, Textarea, Label } from "@vayva/ui";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SourcingRequestForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<string[]>([]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            const res = await fetch("/api/sourcing/request", {
                method: "POST",
                body: JSON.stringify({
                    productName: formData.get("productName"),
                    description: formData.get("description"),
                    quantity: Number(formData.get("quantity")),
                    targetPrice: Number(formData.get("targetPrice")),
                    referenceUrl: formData.get("referenceUrl"),
                    images
                }),
                headers: { "Content-Type": "application/json" }
            });

            if (!res.ok) throw new Error("Failed to submit request");

            // Redirect to success / orders page
            router.push("/orders?tab=requests");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border">
            <div>
                <h2 className="text-2xl font-bold mb-2">Request a Product</h2>
                <p className="text-muted-foreground text-sm">Can't find what you're looking for? Tell us, and our team in China will source it for you.</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input id="productName" name="productName" required placeholder="e.g. Wireless Noise Cancelling Headphones" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    required
                    placeholder="Describe the material, color, size, functions, etc."
                    className="min-h-[120px]"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity Needed</Label>
                    <Input id="quantity" name="quantity" type="number" min="1" required placeholder="e.g. 50" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="targetPrice">Target Price (NGN)</Label>
                    <Input id="targetPrice" name="targetPrice" type="number" min="0" placeholder="Optional" />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="referenceUrl">Reference Link (Optional)</Label>
                <Input id="referenceUrl" name="referenceUrl" type="url" placeholder="https://alibaba.com/..." />
            </div>

            {/* Image Upload Component integration planned */}
            <div className="p-4 bg-gray-50 rounded-lg border border-dashed text-center text-sm text-muted-foreground">
                Image upload coming soon. For now, please provide a reference link.
            </div>

            <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Request"}
            </Button>
        </form>
    );
}
