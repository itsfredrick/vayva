import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, CheckCircle2, Clock, Truck, MapPin } from "lucide-react";
import { redirect, notFound } from "next/navigation";
import { Button } from "@vayva/ui";
import { DisputeDialog } from "@/components/orders/DisputeDialog";

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return redirect("/api/auth/signin");

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

    if (!order) return notFound();
    if (order.customerId !== (session.user as any).id) return notFound(); // Basic security

    // Helper to get items for a group
    const getItemsForGroup = (groupId: string) => {
        return (order as any).items.filter((item: any) => item.fulfillmentGroupId === groupId);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <Link href="/orders" className="inline-flex items-center text-sm text-muted-foreground mb-6 hover:text-foreground">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Orders
            </Link>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    <div className="bg-white border rounded-xl overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                            <div>
                                <h1 className="text-xl font-bold">{order.orderNumber}</h1>
                                <p className="text-sm text-muted-foreground">
                                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                {order.status}
                            </div>
                        </div>

                        <div className="p-6">
                            {/* China Import Milestones (if applicable) */}
                            {order.importStatus && (
                                <div className="mb-8 p-4 bg-orange-50 rounded-lg border border-orange-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="bg-orange-600 p-1.5 rounded-lg">
                                            <Truck className="h-4 w-4 text-white" />
                                        </div>
                                        <h2 className="font-bold text-orange-900">China Import Journey</h2>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {[
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
                                            const isPast = states.indexOf(order.importStatus!) >= states.indexOf(milestone.state);

                                            return (
                                                <div key={idx} className="flex flex-col items-center text-center gap-2">
                                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${isPast ? 'bg-orange-600 border-orange-600 text-white' : 'bg-white border-orange-200 text-orange-200'}`}>
                                                        {isPast ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                                    </div>
                                                    <span className={`text-[10px] uppercase font-bold tracking-tight ${isPast ? 'text-orange-900' : 'text-orange-300'}`}>
                                                        {milestone.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-4 text-xs text-orange-600 bg-white/50 p-2 rounded italic">
                                        * China Import orders undergo strict quality control before shipping. Estimated shipping time is 10-15 days after production.
                                    </div>
                                </div>
                            )}

                            {/* Tracking Timeline */}
                            <div className="mb-8">
                                <h2 className="font-semibold mb-4">Tracking</h2>
                                <div className="space-y-6 relative pl-4 border-l-2 border-gray-100 ml-2">
                                    {(order as any).orderTimelineEvents?.length > 0 ? (
                                        (order as any).orderTimelineEvents.map((event: any) => (
                                            <div key={event.id} className="relative">
                                                <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-white" />
                                                <div>
                                                    <p className="font-medium text-sm">{event.title}</p>
                                                    <p className="text-xs text-muted-foreground">{event.body}</p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(event.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="relative">
                                            <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-white" />
                                            <p className="font-medium text-sm">Order Placed</p>
                                            <p className="text-xs text-muted-foreground">We have received your order.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <hr className="my-6 border-dashed" />

                            {/* Shipment Groups */}
                            <h2 className="font-semibold mb-4">Packages</h2>
                            <div className="space-y-6">
                                {((order as any).fulfillmentGroups as any[]).map((group: any) => (
                                    <div key={group.id} className="border rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3 pb-3 border-b">
                                            <Store className="h-4 w-4 text-gray-500" />
                                            <span className="font-medium">Package from {group.store.name}</span>
                                            <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded">
                                                {group.status}
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            {(getItemsForGroup(group.id) as any[]).map(item => (
                                                <div key={item.id} className="flex gap-3">
                                                    <div className="h-12 w-12 bg-gray-100 rounded relative shrink-0">
                                                        {((item as any).productVariant?.productImage?.url || (item as any).productVariant?.product?.productImages?.[0]?.url) && (
                                                            <Image
                                                                src={(item as any).productVariant?.productImage?.url || (item as any).productVariant?.product?.productImages?.[0]?.url || ""}
                                                                alt={item.title}
                                                                fill
                                                                className="object-cover rounded"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                                                        <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₦{Number(item.price).toLocaleString()}</p>
                                                    </div>
                                                    <div className="text-sm font-medium">
                                                        ₦{(Number(item.price) * item.quantity).toLocaleString()}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Summary */}
                <div className="lg:w-80 space-y-6">
                    <div className="bg-white border rounded-xl p-6">
                        <h3 className="font-semibold mb-4">Payment & Totals</h3>
                        <div className="space-y-3 text-sm border-b pb-4 mb-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>₦{Number(order.subtotal).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Delivery</span>
                                <span>₦{Number(order.deliveryFee).toLocaleString()}</span>
                            </div>
                            {Number(order.tax) > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span>₦{Number(order.tax).toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between font-bold text-lg mb-4">
                            <span>Total</span>
                            <span>₦{Number(order.total).toLocaleString()}</span>
                        </div>
                        <div className="text-xs text-center text-muted-foreground bg-gray-50 p-2 rounded">
                            Payment Status: <span className="font-medium text-foreground">{order.paymentStatus}</span>
                        </div>
                    </div>

                    <div className="bg-white border rounded-xl p-6">
                        <h3 className="font-semibold mb-4">Need Help?</h3>
                        <DisputeDialog
                            orderId={order.id}
                            orderNumber={order.orderNumber}
                            totalAmount={Number(order.total)}
                        />
                        <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" size="sm">
                            Cancel Order
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Icon for Store
function Store(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
            <path d="M2 7h20" />
            <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
        </svg>
    )
}
