
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Switch } from "@vayva/ui";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { FoodProductMetadata } from "@/lib/types/food";

export default function NewMenuItemPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
    });
    const [metadata, setMetadata] = useState<FoodProductMetadata>({
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        spiceLevel: "MILD",
        prepTimeMinutes: 15,
        calories: 0,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/menu-items", {
                method: "POST",
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    metadata
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to create menu item");
            }

            toast.success("Menu item created!");
            router.push("/dashboard/menu-items");
        } catch (error: any) {
            toast.error((error as any).message || "Failed to create menu item");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-10">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Menu
            </Button>

            <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tight">Add Menu Item</h2>
                <p className="text-muted-foreground">Create a new dish for your restaurant menu.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Details</CardTitle>
                        <CardDescription>Dish name, price, and description.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Dish Name</Label>
                            <Input
                                id="name"
                                required
                                value={(formData.name as any)}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Spicy Chicken Burger"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price (NGN)</Label>
                            <Input
                                id="price"
                                type="number"
                                required
                                value={(formData.price as any)}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={(formData.description as any)}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the dish..."
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Food Specifics</CardTitle>
                        <CardDescription>Dietary info, prep time, and spice level.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between border p-4 rounded-lg">
                            <div className="space-y-0.5">
                                <Label>Vegetarian</Label>
                                <p className="text-xs text-muted-foreground">Is this dish vegetarian friendly?</p>
                            </div>
                            <Switch
                                checked={metadata.isVegetarian ?? false}
                                onCheckedChange={(checked) => setMetadata({ ...metadata, isVegetarian: checked })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="prepTime">Prep Time (mins)</Label>
                                <Input
                                    id="prepTime"
                                    type="number"
                                    value={(metadata.prepTimeMinutes as any)}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMetadata({ ...metadata, prepTimeMinutes: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Spice Level</Label>
                                <Select
                                    value={(metadata.spiceLevel as any)}
                                    onValueChange={(val) => setMetadata({ ...metadata, spiceLevel: val as any })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MILD">Mild</SelectItem>
                                        <SelectItem value="MEDIUM">Medium</SelectItem>
                                        <SelectItem value="HOT">Hot</SelectItem>
                                        <SelectItem value="EXTRA_HOT">Extra Hot</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="calories">Calories (kcal)</Label>
                            <Input
                                id="calories"
                                type="number"
                                value={(metadata.calories as any)}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMetadata({ ...metadata, calories: parseInt(e.target.value) })}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Dish
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
