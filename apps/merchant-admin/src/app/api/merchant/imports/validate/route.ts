import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch CSV file");
  return res.text();
};

type CsvRow = Record<string, string>;

interface ImportError {
  row: number;
  msgs: string[];
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { storeId?: string } | undefined;

  if (!user?.storeId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId } = await req.json();

  const job = await prisma.importJob.findUnique({ where: { id: jobId } });
  if (!job || job.merchantId !== user.storeId)
    return new NextResponse("Forbidden", { status: 403 });

  try {
    await prisma.importJob.update({
      where: { id: jobId },
      data: { status: "validating" },
    });

    const csvContent = await fetchFileContent(job.fileUrl);

    // Parse
    const lines = csvContent.split("\n").filter((l) => l.trim().length > 0);
    const headers = lines[0].split(",").map((h) => h.trim());

    let valid = 0;
    let invalid = 0;
    const errors: ImportError[] = [];
    const preview: CsvRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(",").map((s) => s.trim());
      const row: CsvRow = {};
      headers.forEach((h, idx) => (row[h] = vals[idx]));

      const result = validateRow(row);
      if (result.valid) {
        valid++;
        if (preview.length < 5) preview.push(result.row as unknown);
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
        summary: { preview, errors } as unknown,
      },
    });

    return NextResponse.json(updated);
  } catch (e: unknown) {
    await prisma.importJob.update({
      where: { id: jobId },
      data: { status: "failed", summary: { error: e.message } },
    });
    return new NextResponse("Validation Failed", { status: 500 });
  }
}
