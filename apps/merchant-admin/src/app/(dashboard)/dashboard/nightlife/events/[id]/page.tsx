"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Card, Input, Label, Textarea } from "@vayva/ui";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, Loader2, Calendar, Ticket, Users } from "lucide-react";
import { FileUpload } from "@/components/ui/FileUpload";
import { format } from "date-fns";

interface TicketType {
    id?: string;
    name: string;
    price: number;
    quantity: number;
    sold: number;
    description: string;
}

interface EventData {
    id: string;
    title: string;
    description: string;
    eventDate: string;
    eventTime: string;
    venue: string;
    address: string;
    dressCode: string;
    ageLimit: string;
    musicGenre: string;
    images: string[];
    ticketTypes: TicketType[];
    status: string;
    ticketsSold: number;
    revenue: number;
}

export default function EventDetailPage() {
    const router = useRouter();
    const params = useParams();
    const eventId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [event, setEvent] = useState<EventData | null>(null);
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
    const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);

    useEffect(() => {
        loadEvent();
    }, [eventId]);

    const loadEvent = async () => {
        try {
            const res = await fetch(`/api/nightlife/events/${eventId}`);
            if (!res.ok) throw new Error("Failed to load event");
            const data = await res.json();
            setEvent(data);
            setFormData({
                title: data.title || "",
                description: data.description || "",
                eventDate: data.eventDate?.split("T")[0] || "",
                eventTime: data.eventTime || "",
                venue: data.venue || "",
                address: data.address || "",
                dressCode: data.dressCode || "",
                ageLimit: data.ageLimit || "18+",
                musicGenre: data.musicGenre || "",
                images: data.images || [],
            });
            setTicketTypes(data.ticketTypes || []);
        } catch (error) {
            toast.error("Failed to load event");
            router.push("/dashboard/nightlife/events");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const addTicketType = () => {
        setTicketTypes([...ticketTypes, { name: "", price: 0, quantity: 50, sold: 0, description: "" }]);
    };

    const updateTicketType = (index: number, field: keyof TicketType, value: any) => {
        const updated = [...ticketTypes];
        updated[index] = { ...updated[index], [field]: value };
        setTicketTypes(updated);
    };

    const removeTicketType = (index: number) => {
        if (ticketTypes.length > 1 && ticketTypes[index].sold === 0) {
            setTicketTypes(ticketTypes.filter((_, i) => i !== index));
        } else if (ticketTypes[index].sold > 0) {
            toast.error("Cannot remove ticket type with sales");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`/api/nightlife/events/${eventId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, ticketTypes }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to update event");
            }

            toast.success("Event updated successfully!");
            loadEvent();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!event) {
        return null;
    }

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto">
            <Button variant="ghost" onClick={() => router.push("/dashboard/nightlife/events")} className="mb-6">
                <ArrowLeft size={18} className="mr-2" />
                Back to Events
            </Button>

            {/* Event Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Ticket size={20} className="text-purple-600" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Tickets Sold</div>
                            <div className="text-xl font-bold">{event.ticketsSold}</div>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Users size={20} className="text-green-600" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Revenue</div>
                            <div className="text-xl font-bold">₦{(event.revenue || 0).toLocaleString()}</div>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Calendar size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Event Date</div>
                            <div className="text-xl font-bold">
                                {event.eventDate ? format(new Date(event.eventDate), "MMM d") : "TBD"}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Edit Event</h1>
                <Badge className={event.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}>
                    {event.status}
                </Badge>
            </div>

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
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm text-gray-500">Ticket Type {index + 1}</span>
                                        {ticket.sold > 0 && (
                                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                                                {ticket.sold} sold
                                            </Badge>
                                        )}
                                    </div>
                                    {ticketTypes.length > 1 && ticket.sold === 0 && (
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
                                            min={ticket.sold}
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
                    <Button type="button" variant="outline" onClick={() => router.push("/dashboard/nightlife/events")}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={saving}>
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}
