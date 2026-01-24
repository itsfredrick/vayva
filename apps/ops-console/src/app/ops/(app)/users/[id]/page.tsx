import { prisma } from "@vayva/db";
import { notFound } from "next/navigation";
import { Card, Badge, Button } from "@vayva/ui";
import { ExternalLink, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default async function UserDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = await params;

    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            memberships: {
                include: {
                    store: {
                        include: {
                            merchantCosts: {
                                orderBy: { date: 'desc' },
                                take: 1
                            }
                        }
                    }
                },
            },
        },
    });

    if (!user) {
        notFound();
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Merchant Health</h1>
                    <p className="text-gray-500">
                        {user.firstName} {user.lastName} ({user.email})
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {await Promise.all(user.memberships.map(async (membership) => {
                    const store = membership.store;

                    // Analytics Aggregation (Last 30 Days)
                    const trafficCount = await prisma.telemetryEvent.count({
                        where: {
                            merchantId: store.id,
                            eventName: "PAGE_VIEW",
                            createdAt: { gte: thirtyDaysAgo }
                        }
                    });

                    return (
                        <Card key={store.id} className="p-6 flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{store.name}</h3>
                                    <a
                                        href={`https://${store.slug}.vayva.ng`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        {store.slug}.vayva.ng
                                        <ExternalLink size={12} />
                                    </a>
                                </div>
                                <Badge
                                    className={
                                        store.plan === "PRO"
                                            ? "bg-purple-100 text-purple-700"
                                            : store.plan === "STARTER"
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-gray-100 text-gray-700"
                                    }
                                >
                                    {store.plan}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex flex-col">
                                    <span className="text-gray-500">Status</span>
                                    <span className="font-medium flex items-center gap-2">
                                        {store.isLive ? (
                                            <>
                                                <CheckCircle size={14} className="text-green-500" />
                                                Live
                                            </>
                                        ) : (
                                            <>
                                                <XCircle size={14} className="text-gray-400" />
                                                Draft
                                            </>
                                        )}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-500">Industry</span>
                                    <span className="font-medium capitalize">
                                        {store.industrySlug?.replace("_", " ") || "N/A"}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-500">Verification</span>
                                    <span className="font-medium">{store.verificationLevel}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-500">Created</span>
                                    <span className="font-medium">
                                        {new Date(store.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {/* Growth Signals */}
                            <div className="pt-4 border-t border-gray-100 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">SEO Indexable</span>
                                    <span className="font-bold text-green-600">Yes</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Traffic (30d)</span>
                                    <span className="font-bold text-gray-900">{trafficCount.toLocaleString()}</span>
                                </div>
                            </div>
                        </Card>
                    );
                }))}

                {user.memberships.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-gray-500">No stores linked to this user.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
