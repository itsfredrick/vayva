
"use client";

import { useState, useEffect } from "react";
import { Button } from "@vayva/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, MapPin, Trash2, Edit } from "lucide-react";
import { PickupLocationForm } from "./pickup-location-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function PickupPage() {
    const [locations, setLocations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState<unknown>(null);

    const fetchLocations = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/settings/pickup");
            const data = await res.json();
            setLocations(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleSubmit = async (data: unknown) => {
        try {
            const url = editingLocation
                ? `/api/settings/pickup/${editingLocation.id}`
                : "/api/settings/pickup";

            const method = editingLocation ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed");

            toast.success(editingLocation ? "Updated" : "Created");
            setIsOpen(false);
            setEditingLocation(null);
            fetchLocations();
        } catch (e) {
            toast.error("Error saving location");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await fetch(`/api/settings/pickup/${id}`, { method: "DELETE" });
            toast.success("Deleted");
            fetchLocations();
        } catch (e) {
            toast.error("Failed to delete");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-medium">Pickup Locations</h3>
                    <p className="text-sm text-muted-foreground">Manage addresses where customers can pick up orders.</p>
                </div>
                <Dialog open={isOpen} onOpenChange={(open) => {
                    setIsOpen(open);
                    if (!open) setEditingLocation(null);
                }}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Add Location</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingLocation ? "Edit Location" : "Add Pickup Location"}</DialogTitle>
                            <DialogDescription>
                                Enter details for this pickup point.
                            </DialogDescription>
                        </DialogHeader>
                        <PickupLocationForm
                            initialData={editingLocation}
                            onSubmit={handleSubmit}
                            isSubmitting={false} // Todo state
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {locations.map((loc) => (
                    <Card key={loc.id}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    {loc.name}
                                </CardTitle>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => {
                                        setEditingLocation(loc);
                                        setIsOpen(true);
                                    }}>
                                        <Edit className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(loc.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                            <CardDescription>{loc.address}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground">
                                {loc.city}, {loc.state}
                            </div>
                            {loc.isDefault && <div className="mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded w-fit">Default</div>}
                        </CardContent>
                    </Card>
                ))}
                {locations.length === 0 && !isLoading && (
                    <div className="col-span-2 text-center py-12 text-muted-foreground border rounded-lg border-dashed">
                        No pickup locations yet.
                    </div>
                )}
            </div>
        </div>
    );
}
