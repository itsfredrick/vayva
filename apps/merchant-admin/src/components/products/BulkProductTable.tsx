"use client";

import { useState } from "react";
import { Button, Input } from "@vayva/ui";
import { toast } from "sonner";
import { Loader2, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Product {
    id: string;
    name: string;
    price: number;
    status: string;
    currency: string;
}

interface BulkProductTableProps {
    initialProducts: Product[];
}

export function BulkProductTable({ initialProducts }: BulkProductTableProps) {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [edits, setEdits] = useState<Record<string, Partial<Product>>>({});
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (id: string, field: keyof Product, value: any) => {
        setEdits((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));

        setProducts((prev) => prev.map(p =>
            p.id === id ? { ...p, [field]: value } : p
        ));
    };

    const hasChanges = Object.keys(edits).length > 0;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const itemsToUpdate = Object.entries(edits).map(([id, changes]) => ({
                id,
                data: changes
            }));

            const res = await fetch("/api/products/bulk", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: itemsToUpdate })
            });

            if (!res.ok) throw new Error("Bulk update failed");

            const result = await res.json();
            toast.success(result.message);
            setEdits({});
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Failed to save changes");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDiscard = () => {
        setProducts(initialProducts);
        setEdits({});
        toast.info("Changes discarded");
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <div className="flex items-center gap-2 text-yellow-800">
                    <span className="font-semibold">Bulk Edit Mode</span>
                    <span className="text-sm">• {Object.keys(edits).length} unsaverd changes</span>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDiscard}
                        disabled={!hasChanges || isSaving}
                    >
                        Discard
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving}
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 w-[40%]">Product Name</th>
                            <th className="px-6 py-4 w-[20%]">Price</th>
                            <th className="px-6 py-4 w-[20%]">Status</th>
                            <th className="px-6 py-4 w-[20%]">Currency</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((p) => {
                            const isDirty = !!edits[p.id];
                            return (
                                <tr key={p.id} className={`transition-colors ${isDirty ? "bg-blue-50/50" : "hover:bg-gray-50"}`}>
                                    <td className="px-6 py-3">
                                        <Input
                                            value={p.name}
                                            onChange={(e) => handleChange(p.id, "name", e.target.value)}
                                            className="h-8 bg-transparent border-transparent hover:border-gray-200 focus:bg-white"
                                        />
                                    </td>
                                    <td className="px-6 py-3">
                                        <Input
                                            type="number"
                                            value={p.price}
                                            onChange={(e) => handleChange(p.id, "price", e.target.value)}
                                            className="h-8 bg-transparent border-transparent hover:border-gray-200 focus:bg-white"
                                        />
                                    </td>
                                    <td className="px-6 py-3">
                                        <select
                                            aria-label="Status"
                                            value={p.status}
                                            onChange={(e) => handleChange(p.id, "status", e.target.value)}
                                            className="h-8 bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer"
                                        >
                                            <option value="ACTIVE">ACTIVE</option>
                                            <option value="DRAFT">DRAFT</option>
                                            <option value="ARCHIVED">ARCHIVED</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-3 text-gray-500">
                                        {p.currency}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
