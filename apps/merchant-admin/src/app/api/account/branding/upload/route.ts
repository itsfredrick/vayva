import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { randomUUID } from "crypto";
import { validateUploadedFile, DEFAULT_IMAGE_MAX_SIZE } from "@/lib/file-validation";
import { applyRateLimit, RATE_LIMITS } from "@/lib/rate-limit-enhanced";

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await applyRateLimit(request, "branding-upload", RATE_LIMITS.FILE_UPLOAD);
    if (!rateLimitResult.allowed) {
      return rateLimitResult.response!;
    }

    const session = await requireAuth();
    const storeId = session.user.storeId;

    const formData = await request.formData();

    // Validate uploaded file with comprehensive checks
    const validation = await validateUploadedFile(formData, "file", {
      maxSizeBytes: DEFAULT_IMAGE_MAX_SIZE,
      allowedMimeTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
      minWidth: 100,
      maxWidth: 4000,
      minHeight: 100,
      maxHeight: 4000
    });

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: validation.error,
          code: validation.code
        },
        { status: 400 }
      );
    }

    const file = validation.file!;

    // Security: Derive extension from MIME type, do NOT trust user input
    const mimeMap: Record<string, string> = {
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/webp": "webp"
    };
    const ext = mimeMap[file.type] || "bin";
    const filename = `${storeId}-${randomUUID()}.${ext}`;

    let logoUrl = "";

    // Check if we should use Vercel Blob (Production) or local storage (Development)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import("@vercel/blob");
      const blob = await put(`logos/${filename}`, file, {
        access: "public",
        addRandomSuffix: false,
      });
      logoUrl = blob.url;
    } else {
      // Local fallback for development
      const { writeFile, mkdir } = await import("fs/promises");
      const { join } = await import("path");
      const uploadDir = join(process.cwd(), "public", "uploads", "logos");

      // Ensure directory exists
      await mkdir(uploadDir, { recursive: true });

      const filepath = join(uploadDir, filename);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);
      logoUrl = `/uploads/logos/${filename}`;
    }

    // Update store with logo URL
    const { prisma } = await import("@vayva/db");
    await prisma.store.update({
      where: { id: storeId },
      data: { logoUrl },
    });

    return NextResponse.json({
      success: true,
      logoUrl,
      message: "Logo uploaded successfully",
    });
  } catch (error: any) {
    console.error("Logo upload error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to upload logo" },
      { status: 500 },
    );
  }
}
