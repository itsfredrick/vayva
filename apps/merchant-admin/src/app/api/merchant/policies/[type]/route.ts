import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { sanitizeMarkdown, validatePolicyContent } from "@vayva/policies";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
    try {
        const { type } = await params;
        const session = await getServerSession(authOptions);
        const user = session?.user;
        if (!user?.storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const policy = await prisma.merchantPolicy.findUnique({
            where: {
                storeId_type: {
                    storeId: user.storeId,
                    type: type.toUpperCase().replace("-", "_") as any,
                },
            },
        });
        if (!policy) {
            return NextResponse.json({ error: "Policy not found" }, { status: 404 });
        }
        return NextResponse.json({ policy });
    }
    catch (error: any) {
        console.error("Error fetching policy:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
export async function POST(req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
    try {
        const { type } = await params;
        const session = await getServerSession(authOptions);
        const user = session?.user;
        if (!user?.storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await req.json();
        const { title, contentMd } = body;
        // Validate content
        const validation = validatePolicyContent(contentMd);
        if (!validation.valid) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }
        // Sanitize and generate HTML
        const contentHtml = sanitizeMarkdown(contentMd);
        const policy = await prisma.merchantPolicy.update({
            where: {
                storeId_type: {
                    storeId: user.storeId,
                    type: type.toUpperCase().replace("-", "_") as any,
                },
            },
            data: {
                title,
                contentMd,
                contentHtml,
                updatedAt: new Date(),
            },
        });
        return NextResponse.json({ policy });
    }
    catch (error: any) {
        console.error("Error updating policy:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
