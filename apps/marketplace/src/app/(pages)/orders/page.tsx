import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Package, ChevronRight, Clock, HelpCircle } from "lucide-react";
import { redirect } from "next/navigation";

export default async function OrdersPage({ searchParams }: { searchParams: { tab?: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return redirect("/api/auth/signin");

    const tab = searchParams.tab || "orders";

    const orders = tab === "orders" ? await prisma.order.findMany({
        where: { customerId: (session.user as any).id },
        orderBy: { createdAt: "desc" },
        include: {
            _count: { select: { items: true } }
        }
    }) : [];

    const requests = tab === "requests" ? await prisma.sourcingRequest.findMany({
        where: { userId: (session.user as any).id },
        orderBy: { createdAt: "desc" }
    }) : [];

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">Activity</h1>

            <div className="flex gap-4 border-b mb-6">
                <Link 
                    href="/orders?tab=orders" 
                    className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${tab === "orders" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-black"}`}
                >
                    My Orders
                </Link>
                <Link 
                    href="/orders?tab=requests" 
                    className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${tab === "requests" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-black"}`}
                >
                    Sourcing Requests
                </Link>
            </div>

            {tab === "orders" && (
                <>
                    {orders.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-xl border">
                            <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium">No orders yet</h3>
                            <p className="text-muted-foreground mb-6">Start shopping to see your orders here.</p>
                            <Link href="/" className="text-primary hover:underline font-medium">
                                Browse Marketplace
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <Link
                                    href={`/orders/${order.id}`}
                                    key={order.id}
                                    className="block bg-white border rounded-lg p-4 hover:border-black transition-colors hover:shadow-sm"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold">{order.orderNumber}</span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-muted-foreground flex items-center gap-4">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </span>
                                                <span>•</span>
                                                <span>{order._count.items} items</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold">₦{Number(order.total).toLocaleString()}</div>
                                            <div className="text-xs text-muted-foreground">View details</div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            )}

            {tab === "requests" && (
                <>
                    {requests.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-xl border">
                            <HelpCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium">No requests yet</h3>
                            <p className="text-muted-foreground mb-6">Need something from China? Submit a request.</p>
                            <Link href="/sourcing/request" className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors">
                                Create Request
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {requests.map((request) => (
                                <div
                                    key={request.id}
                                    className="bg-white border rounded-lg p-4 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold">{request.productName}</span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                                    request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                    request.status === 'QUOTED' ? 'bg-green-100 text-green-700' :
                                                    request.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {request.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{request.description}</p>
                                            <div className="text-xs text-muted-foreground flex items-center gap-4">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(request.createdAt).toLocaleDateString()}
                                                </span>
                                                <span>•</span>
                                                <span>Qty: {request.quantity}</span>
                                            </div>
                                        </div>
                                        {request.status === 'QUOTED' && (
                                            <Link 
                                                href={`/sourcing/request/${request.id}`}
                                                className="text-sm font-bold text-blue-600 hover:underline"
                                            >
                                                View Quote
                                            </Link>
                                        )}
                                    </div>
                                    {request.adminNote && (
                                        <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-600 italic">
                                            "{request.adminNote}"
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            <div className="pt-6 border-t mt-8 text-center">
                                <Link href="/sourcing/request" className="text-sm font-medium text-primary hover:underline">
                                    + Submit another request
                                </Link>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
