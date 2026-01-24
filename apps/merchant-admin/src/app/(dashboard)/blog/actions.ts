'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// Schema for validation
const BlogPostSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
    excerpt: z.string().optional(),
    content: z.string().optional(),
    featuredImage: z.string().optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
    metaTitle: z.string().optional(),
    metaDesc: z.string().optional(),
});

export async function getBlogPosts(storeId: string) {
    if (!storeId) return [];

    return await prisma.blogPost.findMany({
        where: { storeId },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            publishedAt: true,
            createdAt: true,
            _count: {
                select: { products: true }
            }
        }
    });
}

export async function getBlogPost(storeId: string, id: string) {
    if (!storeId || !id) return null;

    return await prisma.blogPost.findUnique({
        where: { id },
    });
}

export async function createBlogPost(storeId: string, formData: FormData) {
    const rawData = {
        title: formData.get("title"),
        slug: formData.get("slug"),
        excerpt: formData.get("excerpt"),
        content: formData.get("content"),
        featuredImage: formData.get("featuredImage"),
        status: formData.get("status"),
        metaTitle: formData.get("metaTitle"),
        metaDesc: formData.get("metaDesc"),
    };

    const validated = BlogPostSchema.parse(rawData);

    const post = await prisma.blogPost.create({
        data: {
            ...validated,
            storeId,
            publishedAt: validated.status === 'PUBLISHED' ? new Date() : null,
        }
    });

    revalidatePath('/blog');
    return { success: true, id: post.id };
}

export async function updateBlogPost(storeId: string, id: string, formData: FormData) {
    const rawData = {
        title: formData.get("title"),
        slug: formData.get("slug"),
        excerpt: formData.get("excerpt"),
        content: formData.get("content"),
        featuredImage: formData.get("featuredImage"),
        status: formData.get("status"),
        metaTitle: formData.get("metaTitle"),
        metaDesc: formData.get("metaDesc"),
    };

    const validated = BlogPostSchema.parse(rawData);

    await prisma.blogPost.update({
        where: { id },
        data: {
            ...validated,
            publishedAt: validated.status === 'PUBLISHED' ? new Date() : null,
        }
    });

    revalidatePath('/blog');
    revalidatePath(`/blog/${id}`);
    return { success: true };
}

export async function deleteBlogPost(storeId: string, id: string) {
    // Verify ownership implicitly by including storeId in where, 
    // but Prisma update/delete only allow unique ID. 
    // So we check first or rely on middleware auth + store context.
    // Ideally:
    const post = await prisma.blogPost.findFirst({
        where: { id, storeId }
    });

    if (!post) throw new Error("Post not found");

    await prisma.blogPost.delete({
        where: { id }
    });

    revalidatePath('/blog');
    return { success: true };
}
