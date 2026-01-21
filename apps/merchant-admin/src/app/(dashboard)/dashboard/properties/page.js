import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";
import { Button } from "@vayva/ui";
import { Building2, Users, Bed, DoorOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CreatePropertyModal } from "@/components/properties/CreatePropertyModal";
import { PropertyListActions } from "@/components/properties/PropertyListActions";
export default async function PropertiesPage() {
    const session = await requireAuth();
    const storeId = session.user.storeId;
    // Fetch Accommodation Products
    const properties = await prisma.accommodationProduct.findMany({
        where: {
            product: {
                storeId: storeId
            }
        },
        include: {
            product: {
                include: {
                    productImages: {
                        orderBy: { position: 'asc' },
                        take: 1
                    }
                }
            }
        },
        orderBy: { product: { createdAt: 'desc' } }
    });
    return (_jsxs("div", { className: "p-6 md:p-8 max-w-7xl mx-auto space-y-8", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight text-gray-900", children: "Properties & Listings" }), _jsx("p", { className: "text-gray-500", children: "Manage your units, rooms, and listings" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Link, { href: "/dashboard/viewings", children: _jsx(Button, { variant: "outline", children: "View Requests" }) }), _jsx(CreatePropertyModal, {})] })] }), properties.length === 0 ? (_jsxs("div", { className: "bg-white rounded-xl border border-dashed border-gray-300 p-16 text-center", children: [_jsx(Building2, { className: "w-16 h-16 text-gray-300 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-semibold text-gray-900", children: "No properties listed" }), _jsx("p", { className: "text-gray-500 mt-2 max-w-md mx-auto", children: "Start by adding your first room, apartment, or villa to accept bookings." }), _jsx("div", { className: "mt-8", children: _jsx(CreatePropertyModal, { isFirst: true }) })] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: properties.map((prop) => (_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group", children: [_jsxs("div", { className: "aspect-video bg-gray-100 relative", children: [prop.product.productImages && prop.product.productImages.length > 0 ? (_jsx("div", { className: "relative w-full h-full", children: _jsx(Image, { src: prop.product.productImages[0].url, alt: prop.product.title, fill: true, className: "object-cover", sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" }) })) : (_jsx("div", { className: "w-full h-full flex items-center justify-center text-gray-400", children: _jsx(Building2, { size: 32 }) })), _jsx("div", { className: "absolute top-2 right-2", children: _jsx("span", { className: `px-2 py-1 rounded-md text-xs font-bold bg-white/90 shadow-sm ${prop.product.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-500'}`, children: prop.product.status }) })] }), _jsxs("div", { className: "p-4 space-y-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs font-medium text-blue-600 mb-1 uppercase tracking-wider", children: prop.type }), _jsx("h3", { className: "font-bold text-gray-900 truncate", children: prop.product.title }), _jsx("p", { className: "text-sm text-gray-500 line-clamp-2 mt-1", children: prop.product.description })] }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-600", children: [_jsxs("div", { className: "flex items-center gap-1", title: "Max Guests", children: [_jsx(Users, { size: 14 }), _jsx("span", { children: prop.maxGuests })] }), _jsxs("div", { className: "flex items-center gap-1", title: "Beds", children: [_jsx(Bed, { size: 14 }), _jsx("span", { children: prop.bedCount })] }), _jsxs("div", { className: "flex items-center gap-1", title: "Units Available", children: [_jsx(DoorOpen, { size: 14 }), _jsx("span", { children: prop.totalUnits })] })] }), _jsxs("div", { className: "pt-4 border-t border-gray-100 flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("span", { className: "text-lg font-bold text-gray-900", children: ["NGN ", Number(prop.product.price).toLocaleString()] }), _jsx("span", { className: "text-xs text-gray-500 ml-1", children: "/ night" })] }), _jsx(PropertyListActions, { property: prop })] })] })] }, prop.id))) }))] }));
}
