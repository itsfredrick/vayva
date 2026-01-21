import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/auth/session";
import { ActivityLogTable } from "@/components/settings/ActivityLogTable";

export const dynamic = "force-dynamic";

export default async function ActivityLogsPage() {
    const session = await requireAuth();

    // In a real app, use pagination params from searchParams
    const logs = await prisma.adminAuditLog.findMany({
        where: {
            storeId: session.user.storeId
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 50
    });

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
                    <p className="text-gray-500">Audit trail of staff actions and changes.</p>
                </div>
            </div>

            <ActivityLogTable logs={logs as any} />
        </div>
    );
}
