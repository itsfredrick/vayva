import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { StorageService } from "@/lib/storage/storageService";
import { FEATURES } from "@/lib/env-validation";
export async function GET(request: Request) {
    if (!getServerSession(authOptions)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({
        enabled: FEATURES.STORAGE_ENABLED,
        provider: "vercel-blob",
    });
}
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!FEATURES.STORAGE_ENABLED) {
            return NextResponse.json({
                code: "feature_not_configured",
                feature: "STORAGE_ENABLED",
                message: "File storage is not configured. Contact support to enable this feature.",
            }, { status: 503 });
        }
        const formData = await request.formData();
        const file = formData.get("file");
        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }
        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024;
        if ((file as any).size > maxSize) {
            return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
        }
        // Validate file type
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "application/pdf",
        ];
        if (!allowedTypes.includes((file as any).type)) {
            return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
        }
        const ctx = {
            userId: session.user.id,
            merchantId: session.user.id, // Using user ID as merchant ID context for now
            storeId: session.user.storeId,
            roles: [session.user.role || "owner"],
        };
        const url = await StorageService.upload(ctx, (file as any).name, file);
        return NextResponse.json({
            success: true,
            url,
            filename: (file as any).name,
            size: (file as any).size,
            type: (file as any).type,
        });
    }
    catch (error: any) {
        console.error("File upload error:", error);
        return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
    }
}
