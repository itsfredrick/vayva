"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input, Label, Textarea } from "@vayva/ui";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { FileUpload } from "@/components/ui/FileUpload";

interface TicketType {
    name: string;
    price: number;
    quantity: number;
    description: string;
}

export default function NewEventPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        eventDate: "",
        eventTime: "",
        venue: "",
        address: "",
        dressCode: "",
        ageLimit: "18+",
        musicGenre: "",
        images: [] as string[],
    });
    const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
        { name: "Regular", price: 0, quantity: 100, description: "General admission" },
    ]);

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const addTicketType = () => {
        setTicketTypes([...ticketTypes, { name: "", price: 0, quantity: 50, description: "" }]);
    };

    const updateTicketType = (index: number, field: keyof TicketType, value: any) => {
        const updated = [...ticketTypes];
        updated[index] = { ...updated[index], [field]: value };
        setTicketTypes(updated);
    };

    const removeTicketType = (index: number) => {
        if (ticketTypes.length > 1) {
            setTicketTypes(ticketTypes.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/nightlife/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, ticketTypes }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to create event");
            }

            toast.success("Event created successfully!");
            router.push("/dashboard/nightlife/events");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto">
            <Button variant="ghost" onClick={() => router.back()} className="mb-6">
                <ArrowLeft size={18} className="mr-2" />
                Back
            </Button>

            <h1 className="text-2xl font-bold mb-8">Create New Event</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <Card className="p-6">
                    <h2 className="font-bold text-lg mb-4">Event Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <Label>Event Name *</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                placeholder="e.g., Saturday Night Live"
                                required
                            />
                        </div>
                        <div className="col-span-2">
                            <Label>Description *</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                placeholder="Describe your event..."
                                rows={4}
                                required
                            />
                        </div>
                        <div>
                            <Label>Event Date *</Label>
                            <Input
                                type="date"
                                value={formData.eventDate}
                                onChange={(e) => handleChange("eventDate", e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label>Start Time *</Label>
                            <Input
                                type="time"
                                value={formData.eventTime}
                                onChange={(e) => handleChange("eventTime", e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label>Venue Name *</Label>
                            <Input
                                value={formData.venue}
                                onChange={(e) => handleChange("venue", e.target.value)}
                                placeholder="e.g., Club Noir"
                                required
                            />
                        </div>
                        <div>
                            <Label>Address</Label>
                            <Input
                                value={formData.address}
                                onChange={(e) => handleChange("address", e.target.value)}
                                placeholder="Full address"
                            />
                        </div>
                        <div>
                            <Label>Dress Code</Label>
                            <Input
                                value={formData.dressCode}
                                onChange={(e) => handleChange("dressCode", e.target.value)}
                                placeholder="e.g., Smart Casual"
                            />
                        </div>
                        <div>
                            <Label>Age Limit</Label>
                            <select
                                value={formData.ageLimit}
                                onChange={(e) => handleChange("ageLimit", e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-lg"
                                title="Age Limit"
                            >
                                <option value="18+">18+</option>
                                <option value="21+">21+</option>
                                <option value="All Ages">All Ages</option>
                            </select>
                        </div>
                        <div>
                            <Label>Music Genre</Label>
                            <Input
                                value={formData.musicGenre}
                                onChange={(e) => handleChange("musicGenre", e.target.value)}
                                placeholder="e.g., Afrobeats, Hip-Hop"
                            />
                        </div>
                    </div>
                </Card>

                {/* Event Images */}
                <Card className="p-6">
                    <h2 className="font-bold text-lg mb-4">Event Images</h2>
                    <FileUpload
                        value={formData.images[0] || ""}
                        onChange={(url) => handleChange("images", [url])}
                        label="Upload Event Flyer"
                        accept="image/*"
                    />
                </Card>

                {/* Ticket Types */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-lg">Ticket Types</h2>
                        <Button type="button" variant="outline" size="sm" onClick={addTicketType}>
                            <Plus size={16} className="mr-1" />
                            Add Ticket Type
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {ticketTypes.map((ticket, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-medium text-sm text-gray-500">Ticket Type {index + 1}</span>
                                    {ticketTypes.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeTicketType(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <Label>Name</Label>
                                        <Input
                                            value={ticket.name}
                                            onChange={(e) => updateTicketType(index, "name", e.target.value)}
                                            placeholder="e.g., VIP"
                                        />
                                    </div>
                                    <div>
                                        <Label>Price (₦)</Label>
                                        <Input
                                            type="number"
                                            value={ticket.price}
                                            onChange={(e) => updateTicketType(index, "price", Number(e.target.value))}
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <Label>Quantity</Label>
                                        <Input
                                            type="number"
                                            value={ticket.quantity}
                                            onChange={(e) => updateTicketType(index, "quantity", Number(e.target.value))}
                                            placeholder="100"
                                        />
                                    </div>
                                    <div>
                                        <Label>Description</Label>
                                        <Input
                                            value={ticket.description}
                                            onChange={(e) => updateTicketType(index, "description", e.target.value)}
                                            placeholder="What's included"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Submit */}
                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={loading}>
                        Create Event
                    </Button>
                </div>
            </form>
        </div>
    );
}
