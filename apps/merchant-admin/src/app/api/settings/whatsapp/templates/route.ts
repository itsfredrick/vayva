import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { WhatsAppAgentService } from "@/services/whatsapp-agent.service";
import { z } from "zod";
const CreateTemplateSchema = z.object({
    name: z.string().min(1),
    language: z.string().default("en"),
    category: z.string().default("UTILITY"), // MARKETING, UTILITY, AUTHENTICATION
    status: z.string().default("APPROVED"), // Mocking approval for internal templates
    components: z.array(z.any()).optional(),
});
export async function POST(req: any) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.storeId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const storeId = session.user.storeId;
    try {
        const body = await req.json();
        const validation = CreateTemplateSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: "Invalid input", details: validation.error }, { status: 400 });
        }
        const template = await WhatsAppAgentService.createTemplate(storeId, validation.data);
        return NextResponse.json(template);
    }
    catch (error) {
        console.error("Create Template Error:", error);
        return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
    }
}
export async function DELETE(req: any) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.storeId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
        return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    try {
        await WhatsAppAgentService.deleteTemplate(session.user.storeId, id);
        return NextResponse.json({ success: true });
    }
    catch (error) {
        return NextResponse.json({ error: "Failed to delete template" }, { status: 500 });
    }
}
