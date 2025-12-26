import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only PNG and JPG are allowed' },
                { status: 400 }
            );
        }

        // Validate file size (2MB max)
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 2MB' },
                { status: 400 }
            );
        }

        // Generate unique filename
        const ext = file.name.split('.').pop();
        const filename = `${storeId}-${randomUUID()}.${ext}`;

        let logoUrl = '';

        // Check if we should use Vercel Blob (Production) or local storage (Development)
        if (process.env.BLOB_READ_WRITE_TOKEN) {
            const { put } = await import('@vercel/blob');
            const blob = await put(`logos/${filename}`, file, {
                access: 'public',
                addRandomSuffix: false,
            });
            logoUrl = blob.url;
        } else {
            // Local fallback for development
            const { writeFile } = await import('fs/promises');
            const { join } = await import('path');
            const uploadDir = join(process.cwd(), 'public', 'uploads', 'logos');
            const filepath = join(uploadDir, filename);

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            await writeFile(filepath, buffer);
            logoUrl = `/uploads/logos/${filename}`;
        }

        // Update store with logo URL
        const { prisma } = await import('@vayva/db');
        await prisma.store.update({
            where: { id: storeId },
            data: { logoUrl },
        });

        return NextResponse.json({
            success: true,
            logoUrl,
            message: 'Logo uploaded successfully',
        });
    } catch (error: any) {
        console.error('Logo upload error:', error);

        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(
            { error: 'Failed to upload logo' },
            { status: 500 }
        );
    }
}
