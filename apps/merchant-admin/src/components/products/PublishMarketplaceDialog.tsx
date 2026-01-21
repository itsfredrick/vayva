"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@vayva/ui";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PublishDialogProps {
    isOpen: boolean;
    onClose: () => void;
    productId: string;
    productPrice: number;
    onSuccess: () => void;
}

export function PublishMarketplaceDialog({ isOpen, onClose, productId, productPrice, onSuccess }: PublishDialogProps) {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [loadingCats, setLoadingCats] = useState(true);

    const [form, setForm] = useState({
        categoryId: "",
        mode: "CHECKOUT",
        price: productPrice.toString()
    });

    useEffect(() => {
        if (isOpen && categories.length === 0) {
            fetchCategories();
        }
    }, [isOpen]);

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/marketplace/categories");
            const data = await res.json();
            if (Array.isArray(data)) {
                setCategories(data);
            }
        } catch (err) {
            toast.error("Failed to load categories");
        } finally {
            setLoadingCats(false);
        }
    };

    const handlePublish = async () => {
        if (!form.categoryId) {
            toast.error("Please select a category");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/products/${productId}/publish`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    categoryId: form.categoryId,
                    mode: form.mode,
                    price: parseFloat(form.price)
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Publish failed");

            toast.success("Product published to Marketplace!");
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Publish to Marketplace</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {loadingCats ? (
                        <div className="flex justify-center p-4">
                            <Loader2 className="animate-spin text-gray-400" />
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <Label>Listing Type</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        type="button"
                                        onClick={() => setForm({ ...form, mode: "CHECKOUT" })}
                                        className={`p-3 text-sm font-medium rounded-lg border text-center transition-colors ${form.mode === "CHECKOUT"
                                            ? "border-black bg-black text-white"
                                            : "border-gray-200 hover:bg-gray-50 text-gray-700"
                                            }`}
                                    >
                                        🛒 Checkout
                                        <span className="block text-[10px] font-normal opacity-80 mt-0.5">Buy Now Button</span>
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => setForm({ ...form, mode: "CLASSIFIED" })}
                                        className={`p-3 text-sm font-medium rounded-lg border text-center transition-colors ${form.mode === "CLASSIFIED"
                                            ? "border-blue-600 bg-blue-600 text-white"
                                            : "border-gray-200 hover:bg-gray-50 text-gray-700"
                                            }`}
                                    >
                                        💬 Classified
                                        <span className="block text-[10px] font-normal opacity-80 mt-0.5">Chat / Negotiate</span>
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Category</Label>
                                <select
                                    className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                    value={form.categoryId}
                                    aria-label="Category"
                                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                                >
                                    <option value="">Select a category...</option>
                                    {categories.map((cat) => (
                                        <optgroup key={cat.id} label={cat.name}>
                                            {cat.children?.map((child: any) => (
                                                <option key={child.id} value={child.id}>
                                                    {child.name}
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label>Listing Price (NGN)</Label>
                                <Input
                                    type="number"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                                />
                                <p className="text-xs text-gray-500">You can set a different price for the marketplace.</p>
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handlePublish} disabled={loading || loadingCats}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Publish Listing
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
