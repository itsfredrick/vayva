import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, CheckCircle2, Clock, Truck } from "lucide-react";
import { redirect, notFound } from "next/navigation";
import { Button } from "@vayva/ui";
import { DisputeDialog } from "@/components/orders/DisputeDialog";
export default async function OrderDetailsPage({ params }) {
    const session = await getServerSession(authOptions);
    if (!session?.user)
        return redirect("/api/auth/signin");
    const order = await prisma.order.findUnique({
        where: { id: params.id },
        include: {
            fulfillmentGroups: {
                include: {
                    store: true
                }
            },
            items: {
                include: {
                    productVariant: {
                        include: {
                            productImage: true,
                            product: {
                                include: {
                                    productImages: true
                                }
                            }
                        }
                    }
                }
            },
            orderTimelineEvents: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });
    if (!order)
        return notFound();
    if (order.customerId !== session.user.id)
        return notFound(); // Basic security
    // Helper to get items for a group
    const getItemsForGroup = (groupId) => {
        return order.items.filter((item) => item.fulfillmentGroupId === groupId);
    };
    return (_jsxs("div", { className: "container mx-auto px-4 py-8 max-w-5xl", children: [_jsxs(Link, { href: "/orders", className: "inline-flex items-center text-sm text-muted-foreground mb-6 hover:text-foreground", children: [_jsx(ChevronLeft, { className: "h-4 w-4 mr-1" }), "Back to Orders"] }), _jsxs("div", { className: "flex flex-col lg:flex-row gap-8", children: [_jsx("div", { className: "flex-1 space-y-6", children: _jsxs("div", { className: "bg-white border rounded-xl overflow-hidden", children: [_jsxs("div", { className: "bg-gray-50 px-6 py-4 border-b flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold", children: order.orderNumber }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Placed on ", new Date(order.createdAt).toLocaleDateString()] })] }), _jsx("div", { className: "bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium", children: order.status })] }), _jsxs("div", { className: "p-6", children: [order.importStatus && (_jsxs("div", { className: "mb-8 p-4 bg-orange-50 rounded-lg border border-orange-100", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx("div", { className: "bg-orange-600 p-1.5 rounded-lg", children: _jsx(Truck, { className: "h-4 w-4 text-white" }) }), _jsx("h2", { className: "font-bold text-orange-900", children: "China Import Journey" })] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4", children: [
                                                        { state: 'CREATED', label: 'Order Created' },
                                                        { state: 'DEPOSIT_PAID', label: 'Deposit Paid' },
                                                        { state: 'SUPPLIER_CONFIRMED', label: 'Confirmed' },
                                                        { state: 'PRODUCTION', label: 'In Production' },
                                                        { state: 'SHIPPED', label: 'Overseas Shipping' },
                                                        { state: 'ARRIVED', label: 'Arrived in Nigeria' },
                                                        { state: 'DELIVERED', label: 'Final Delivery' }
                                                    ].map((milestone, idx) => {
                                                        const states = [
                                                            'CREATED', 'DEPOSIT_PENDING', 'DEPOSIT_PAID',
                                                            'SUPPLIER_CONFIRMED', 'PRODUCTION', 'BALANCE_PENDING',
                                                            'SHIPPED', 'ARRIVED', 'DELIVERED', 'COMPLETED'
                                                        ];
                                                        const isPast = states.indexOf(order.importStatus) >= states.indexOf(milestone.state);
                                                        return (_jsxs("div", { className: "flex flex-col items-center text-center gap-2", children: [_jsx("div", { className: `h-8 w-8 rounded-full flex items-center justify-center border-2 ${isPast ? 'bg-orange-600 border-orange-600 text-white' : 'bg-white border-orange-200 text-orange-200'}`, children: isPast ? _jsx(CheckCircle2, { className: "h-4 w-4" }) : _jsx(Clock, { className: "h-4 w-4" }) }), _jsx("span", { className: `text-[10px] uppercase font-bold tracking-tight ${isPast ? 'text-orange-900' : 'text-orange-300'}`, children: milestone.label })] }, idx));
                                                    }) }), _jsx("div", { className: "mt-4 text-xs text-orange-600 bg-white/50 p-2 rounded italic", children: "* China Import orders undergo strict quality control before shipping. Estimated shipping time is 10-15 days after production." })] })), _jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "font-semibold mb-4", children: "Tracking" }), _jsx("div", { className: "space-y-6 relative pl-4 border-l-2 border-gray-100 ml-2", children: order.orderTimelineEvents?.length > 0 ? (order.orderTimelineEvents.map((event) => (_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-white" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm", children: event.title }), _jsx("p", { className: "text-xs text-muted-foreground", children: event.body }), _jsx("p", { className: "text-xs text-gray-400 mt-1", children: new Date(event.createdAt).toLocaleString() })] })] }, event.id)))) : (_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-white" }), _jsx("p", { className: "font-medium text-sm", children: "Order Placed" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "We have received your order." })] })) })] }), _jsx("hr", { className: "my-6 border-dashed" }), _jsx("h2", { className: "font-semibold mb-4", children: "Packages" }), _jsx("div", { className: "space-y-6", children: order.fulfillmentGroups.map((group) => (_jsxs("div", { className: "border rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3 pb-3 border-b", children: [_jsx(Store, { className: "h-4 w-4 text-gray-500" }), _jsxs("span", { className: "font-medium", children: ["Package from ", group.store.name] }), _jsx("span", { className: "ml-auto text-xs bg-gray-100 px-2 py-1 rounded", children: group.status })] }), _jsx("div", { className: "space-y-3", children: getItemsForGroup(group.id).map(item => (_jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "h-12 w-12 bg-gray-100 rounded relative shrink-0", children: (item.productVariant?.productImage?.url || item.productVariant?.product?.productImages?.[0]?.url) && (_jsx(Image, { src: item.productVariant?.productImage?.url || item.productVariant?.product?.productImages?.[0]?.url || "", alt: item.title, fill: true, className: "object-cover rounded" })) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium line-clamp-1", children: item.title }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["Qty: ", item.quantity, " \u00D7 \u20A6", Number(item.price).toLocaleString()] })] }), _jsxs("div", { className: "text-sm font-medium", children: ["\u20A6", (Number(item.price) * item.quantity).toLocaleString()] })] }, item.id))) })] }, group.id))) })] })] }) }), _jsxs("div", { className: "lg:w-80 space-y-6", children: [_jsxs("div", { className: "bg-white border rounded-xl p-6", children: [_jsx("h3", { className: "font-semibold mb-4", children: "Payment & Totals" }), _jsxs("div", { className: "space-y-3 text-sm border-b pb-4 mb-4", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Subtotal" }), _jsxs("span", { children: ["\u20A6", Number(order.subtotal).toLocaleString()] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Delivery" }), _jsxs("span", { children: ["\u20A6", Number(order.deliveryFee).toLocaleString()] })] }), Number(order.tax) > 0 && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Tax" }), _jsxs("span", { children: ["\u20A6", Number(order.tax).toLocaleString()] })] }))] }), _jsxs("div", { className: "flex justify-between font-bold text-lg mb-4", children: [_jsx("span", { children: "Total" }), _jsxs("span", { children: ["\u20A6", Number(order.total).toLocaleString()] })] }), _jsxs("div", { className: "text-xs text-center text-muted-foreground bg-gray-50 p-2 rounded", children: ["Payment Status: ", _jsx("span", { className: "font-medium text-foreground", children: order.paymentStatus })] })] }), _jsxs("div", { className: "bg-white border rounded-xl p-6", children: [_jsx("h3", { className: "font-semibold mb-4", children: "Need Help?" }), _jsx(DisputeDialog, { orderId: order.id, orderNumber: order.orderNumber, totalAmount: Number(order.total) }), _jsx(Button, { variant: "ghost", className: "w-full text-red-500 hover:text-red-600 hover:bg-red-50", size: "sm", children: "Cancel Order" })] })] })] })] }));
}
// Icon for Store
function Store(props) {
    return (_jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" }), _jsx("path", { d: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" }), _jsx("path", { d: "M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" }), _jsx("path", { d: "M2 7h20" }), _jsx("path", { d: "M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" })] }));
}
