"use client";

import React from "react";
import Link from "next/link";
import { Button, Card, Icon } from "@vayva/ui";
import { PrimaryObject } from "@/lib/templates/types";
import { usePathname } from "next/navigation";

interface ResourceListPageProps {
    primaryObject: PrimaryObject;
    title: string;
}

export const ResourceListPage = ({ primaryObject, title }: ResourceListPageProps) => {
    const pathname = usePathname();
    const [items, setItems] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setLoading(true);
        fetch(`/api/resources/list?type=${primaryObject}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setItems(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [primaryObject]);

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto py-6 px-4">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">{title}</h1>
                <Link href={`${pathname}/new`}>
                    <Button>
                        <Icon name="Plus" className="mr-2" size={18} />
                        Add {title.slice(0, -1)}
                    </Button>
                </Link>
            </div>

            {items.length === 0 ? (
                <Card className="p-12 flex flex-col items-center justify-center text-center">
                    <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                        <Icon name="PackageOpen" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No {title.toLowerCase()} yet</h3>
                    <p className="text-gray-500 max-w-sm mb-6">
                        Get started by adding your first item. It will appear on your storefront immediately.
                    </p>
                    <Link href={`${pathname}/new`}>
                        <Button variant="outline">Create {title.slice(0, -1)}</Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => (
                        <Link key={item.id} href={`${pathname}/${item.id}`}>
                            <Card className="p-4 hover:border-black transition-colors cursor-pointer group">
                                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-300">
                                            <Icon name="Image" size={32} />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="bg-white/80 backdrop-blur px-2 py-1 rounded text-xs font-bold">Edit</span>
                                    </div>
                                </div>
                                <h3 className="font-bold truncate">{item.name}</h3>
                                <p className="text-sm text-gray-500">{item.price ? `$${item.price}` : 'Free'}</p>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
