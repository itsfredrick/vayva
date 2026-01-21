import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsx("div", { className: "flex justify-between items-center", children: _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Activity Logs" }), _jsx("p", { className: "text-gray-500", children: "Audit trail of staff actions and changes." })] }) }), _jsx(ActivityLogTable, { logs: logs })] }));
}
