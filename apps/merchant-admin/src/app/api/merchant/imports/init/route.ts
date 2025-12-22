import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@vayva/db';
import { randomBytes, createHash } from 'crypto';

// In a real app, use S3 Presigned URL. For V1 local, we might just accept base64 or assuming url is passed if client uploads directly.
// Simulating an "Upload" where we create the job.

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return new NextResponse('Unauthorized', { status: 401 });

    const body = await req.json();
    const { filename, fileUrl } = body;
    // In real flow, usually Init gives a URL, then client uploads, then "Confirm".
    // Or client uploads to API.
    // Simplifying: Client says "I have this file", we create job.

    if (!filename || !fileUrl) return new NextResponse('Missing file info', { status: 400 });

    // Idempotency Check: Generate checksum if we can read file, OR client sends checksum.
    // For now, simpler uniqueness by fileUrl or random.
    const checksum = createHash('sha256').update(fileUrl + Date.now()).digest('hex');

    const job = await prisma.importJob.create({
        data: {
            merchantId: (session!.user as any).storeId,
            type: 'products_csv',
            status: 'pending',
            originalFilename: filename,
            fileUrl: fileUrl,
            checksum,
            correlationId: randomBytes(16).toString('hex'),
            createdBy: (session!.user as any).id
        }
    });

    return NextResponse.json(job);
}
