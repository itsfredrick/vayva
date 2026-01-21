import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function GET(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session?.user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const job = await prisma.importJob.findUnique({ where: { id } });
    if (!job || job.merchantId !== session.user.storeId)
        return new NextResponse("Forbidden", { status: 403 });
    return NextResponse.json(job);
}
