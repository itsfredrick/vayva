import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { firstName: true, lastName: true, email: true, phone: true }
        });
        return NextResponse.json(user);
    }
    catch (error: any) {
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const body = await req.json();
        const { firstName, lastName, phone } = body;

        await prisma.user.update({
            where: { id: session.user.id },
            data: { firstName, lastName, phone }
        });

        return NextResponse.json({ success: true });
    }
    catch (error: any) {
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
