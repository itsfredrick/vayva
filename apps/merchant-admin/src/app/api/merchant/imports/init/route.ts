import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes, createHash } from "crypto";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";

export const POST = withVayvaAPI(
  PERMISSIONS.COMMERCE_MANAGE,
  async (req: NextRequest, { storeId, user }: HandlerContext) => {
    try {
      const body = await req.json();
      const { filename, fileUrl } = body;

      if (!filename || !fileUrl) {
        return NextResponse.json({ error: "Missing file info" }, { status: 400 });
      }

      // Security: SSRF Protection
      const { isSafeUrl } = await import("@/lib/security/ssrf");
      const isSafe = await isSafeUrl(fileUrl);
      if (!isSafe) {
        return NextResponse.json({ error: "Invalid or unsafe URL" }, { status: 400 });
      }

      const checksum = createHash("sha256")
        .update(fileUrl + Date.now())
        .digest("hex");

      const job = await prisma.importJob.create({
        data: {
          merchantId: storeId,
          type: "products_csv",
          status: "pending",
          originalFilename: filename,
          fileUrl: fileUrl,
          checksum,
          correlationId: randomBytes(16).toString("hex"),
          createdBy: user.id,
        },
      });

      return NextResponse.json(job);
    } catch (error: any) {
      console.error("Import Init Error:", error);
      return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
    }
  }
);
