"use client";

import React, { useState, useEffect } from "react";
import { Icon, Button, EmptyState } from "@vayva/ui";
import Link from "next/link";
import { toast } from "sonner";

export default function PropertiesPage() {
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            // Using generic product API with type filter for now
            const res = await fetch("/api/products?type=REAL_ESTATE");
            const data = await res.json();
            if (Array.isArray(data)) {
                setProperties(data);
            }
        } catch (error) {
            toast.error("Failed to load properties");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-gray-500">Loading properties...</div>;
    }

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
                    <p className="text-gray-500">Manage your real estate listings.</p>
                </div>
                <Link href="/dashboard/products/new?type=REAL_ESTATE">
                    <Button><Icon name="Plus" size={16} className="mr-2" /> New Property</Button>
                </Link>
            </div>

            {properties.length === 0 ? (
                <EmptyState
                    title="No properties listed"
                    description="Add your first property to start accepting inquiries."
                    icon="Home"
                    action={
                        <Link href="/dashboard/products/new?type=REAL_ESTATE">
                            <Button>Add Property</Button>
                        </Link>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <div key={property.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                            <div className="h-48 bg-gray-100 relative">
                                {/* Image Placeholder or Actual Image */}
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    <Icon name="Image" size={32} />
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-900 truncate pr-4">{property.name}</h3>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Active</span>
                                </div>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{property.description || "No description provided."}</p>

                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center gap-1"><Icon name="BedDouble" size={14} /> 3</div>
                                    <div className="flex items-center gap-1"><Icon name="Bath" size={14} /> 2</div>
                                    <div className="flex items-center gap-1"><Icon name="Maximize" size={14} /> 150m²</div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="font-bold text-lg">₦{property.price?.toLocaleString()}</span>
                                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">Edit</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
