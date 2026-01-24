import { prisma } from "@vayva/db";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/lib/session";
import { logAuditEvent, AuditEventType } from "@/lib/audit";
export async function checkSudoMode(userId: any, storeId: any) {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token)
        return false;
    const session = await prisma.merchantSession.findUnique({
        where: { token },
    });
    if (!session || !session.sudoExpiresAt)
        return false;
    if (session.sudoExpiresAt < new Date()) {
        return false;
    }
    return true;
}
export async function requireSudoMode(userId: any, storeId: any) {
    const isSudo = await checkSudoMode(userId, storeId);
    if (!isSudo) {
        await logAuditEvent(storeId, userId, AuditEventType.SECURITY_STEP_UP_REQUIRED, {});
        throw new Error("Sudo mode required");
    }
}
