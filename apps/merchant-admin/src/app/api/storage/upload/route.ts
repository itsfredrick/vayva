import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { StorageService } from "@/lib/storage/storageService";
import { FEATURES } from "@/lib/env-validation";

export async function GET(request: NextRequest) {
  if (!getServerSession(authOptions)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    enabled: FEATURES.STORAGE_ENABLED,
    provider: "vercel-blob",
  });
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!FEATURES.STORAGE_ENABLED) {
      return NextResponse.json(
        {
          code: "feature_not_configured",
          feature: "STORAGE_ENABLED",
          message:
            "File storage is not configured. Contact support to enable this feature.",
        },
        { status: 503 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large (max 10MB)" },
        { status: 400 },
      );
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const ctx = {
      userId: (session.user as any).id,
      merchantId: (session.user as any).id, // Using user ID as merchant ID context for now
      storeId: (session.user as any).storeId,
      roles: [(session.user as any).role || "owner"],
    };

    const url = await StorageService.upload(ctx, file.name, file);

    return NextResponse.json({
      success: true,
      url,
      filename: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error: any) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 },
    );
  }
}
