import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@vayva/db";
// @ts-ignore
import { parse } from "csv-parse/sync"; // Need to add package or use simple split
import { validateRow } from "@/lib/imports/csv";

// Test fetching file content from URL
const fetchFileContent = async (url: string) => {
  // In dev, if url is "demo://...", return placeholder CSV
  if (url.startsWith("demo://")) {
    return `Name,Price,Stock,Category
T-Shirt,₦ 5000,10,Clothes
Jeans,,5,Clothes
Sneakers,25000,2,Shoes`;
  }
  // Real fetch
  // const res = await fetch(url); return res.text();
  return "";
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId } = await req.json();

  const job = await prisma.importJob.findUnique({ where: { id: jobId } });
  if (!job || job.merchantId !== (session!.user as any).storeId)
    return new NextResponse("Forbidden", { status: 403 });

  try {
    await prisma.importJob.update({
      where: { id: jobId },
      data: { status: "validating" },
    });

    const csvContent = await fetchFileContent(job.fileUrl);

    // Parse
    // Manual split for dependency-free V1 if needed, or assume csv-parse is available.
    // I'll use simple split for prototype to avoid install dep step if possible, but CSV is complex.
    // Assuming simple headers.
    const lines = csvContent.split("\n").filter((l) => l.trim().length > 0);
    const headers = lines[0].split(",").map((h) => h.trim());

    let valid = 0;
    let invalid = 0;
    const errors: any[] = [];
    const preview: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(",").map((s) => s.trim());
      const row: any = {};
      headers.forEach((h, idx) => (row[h] = vals[idx]));

      const result = validateRow(row);
      if (result.valid) {
        valid++;
        if (preview.length < 5) preview.push(result.row);
      } else {
        invalid++;
        if (errors.length < 10)
          errors.push({ row: i + 1, msgs: result.errors });
      }
    }

    const updated = await prisma.importJob.update({
      where: { id: jobId },
      data: {
        status: "ready", // or 'validated'
        validRows: valid,
        invalidRows: invalid,
        totalRows: lines.length - 1,
        summary: { preview, errors },
      },
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    await prisma.importJob.update({
      where: { id: jobId },
      data: { status: "failed", summary: { error: e.message } },
    });
    return new NextResponse("Validation Failed", { status: 500 });
  }
}
