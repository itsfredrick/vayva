import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
export async function GET(req: any) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const cookieStore = await cookies();
    const storeId = cookieStore.get("x-active-store-id")?.value;
    if (!storeId)
        return NextResponse.json({ error: "No active store session" }, { status: 400 });
    const selection = await prisma.storeTemplateSelection.findUnique({
        where: { storeId },
        include: { templateManifest: true },
    });
    return NextResponse.json({ selection });
}
