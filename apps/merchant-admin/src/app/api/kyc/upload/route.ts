import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const documentType = formData.get('type') as string; // BVN, ID, CAC

        if (!file || !documentType) {
            return NextResponse.json(
                { error: 'File and document type are required' },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only PNG, JPG, and PDF are allowed' },
                { status: 400 }
            );
        }

        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 10MB' },
                { status: 400 }
            );
        }

        // Generate unique filename
        const ext = file.name.split('.').pop();
        const filename = `${storeId}-${documentType}-${randomUUID()}.${ext}`;

        let documentUrl = '';

        // Check if we should use Vercel Blob (Production) or local storage (Development)
        if (process.env.BLOB_READ_WRITE_TOKEN) {
            const { put } = await import('@vercel/blob');
            const blob = await put(`kyc/${filename}`, file, {
                access: 'public',
                addRandomSuffix: false,
            });
            documentUrl = blob.url;
        } else {
            // Local fallback for development
            const { writeFile } = await import('fs/promises');
            const { join } = await import('path');
            const uploadDir = join(process.cwd(), 'public', 'uploads', 'kyc');
            const filepath = join(uploadDir, filename);

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            await writeFile(filepath, buffer);
            documentUrl = `/uploads/kyc/${filename}`;
        }

        // Update or create KYC record
        const { prisma } = await import('@vayva/db');

        const existingKYC = await prisma.kycRecord.findUnique({
            where: { storeId },
        });

        if (existingKYC) {
            // Update existing record
            const updateData: any = {
                status: 'PENDING',
            };

            if (documentType === 'BVN') {
                updateData.bvnDocument = documentUrl;
            } else if (documentType === 'ID') {
                updateData.idDocument = documentUrl;
            } else if (documentType === 'CAC') {
                updateData.cacDocument = documentUrl;
            }

            await prisma.kycRecord.update({
                where: { storeId },
                data: updateData,
            });
        } else {
            // Create new record
            const createData: any = {
                storeId,
                status: 'PENDING',
                businessType: 'INDIVIDUAL', // Default, can be updated
            };

            if (documentType === 'BVN') {
                createData.bvnDocument = documentUrl;
            } else if (documentType === 'ID') {
                createData.idDocument = documentUrl;
            } else if (documentType === 'CAC') {
                createData.cacDocument = documentUrl;
                createData.businessType = 'REGISTERED';
            }

            await prisma.kycRecord.create({
                data: createData,
            });
        }

        return NextResponse.json({
            success: true,
            documentUrl,
            message: 'Document uploaded successfully',
        });
    } catch (error: any) {
        console.error('KYC upload error:', error);

        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(
            { error: 'Failed to upload document' },
            { status: 500 }
        );
    }
}
