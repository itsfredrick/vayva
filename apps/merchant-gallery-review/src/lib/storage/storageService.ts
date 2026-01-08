import { put, del, head } from "@vercel/blob";
import { TenantContext } from "../auth/tenantContext";
import { SecurityUtils } from "../security/tokens";
import { FEATURES } from "../env-validation";

export class StorageService {
  /**
   * Generates a safe, namespaced path for uploads.
   */
  static getNamespacedKey(ctx: TenantContext, filename: string): string {
    const safeName = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    const random = SecurityUtils.generateToken(4);

    // merchants/{merchantId}/stores/{storeId?}/file.ext
    let path = `merchants/${ctx.merchantId}`;
    if (ctx.storeId) path += `/stores/${ctx.storeId}`;

    return `${path}/${random}_${safeName}`;
  }

  /**
   * Upload a file to Vercel Blob storage
   */
  static async upload(
    ctx: TenantContext,
    filename: string,
    file: File | Buffer,
  ): Promise<string> {
    if (!FEATURES.STORAGE_ENABLED) {
      throw new Error("Storage feature is not configured");
    }

    const key = this.getNamespacedKey(ctx, filename);

    try {
      const blob = await put(key, file, {
        access: "public",
        addRandomSuffix: false,
      });

      return blob.url;
    } catch (error: any) {
      console.error("Storage upload failed:", error);
      throw new Error("Failed to upload file");
    }
  }

  /**
   * Generate a signed URL for secure file access
   * For Vercel Blob, public URLs are already accessible
   * This validates access before returning the URL
   */
  static async generateSignedUrl(
    ctx: TenantContext,
    key: string,
  ): Promise<string> {
    if (!FEATURES.STORAGE_ENABLED) {
      throw new Error("Storage feature is not configured");
    }

    // 1. Enforce Prefix Check
    const expectedPrefix = `merchants/${ctx.merchantId}`;
    if (!key.startsWith(expectedPrefix)) {
      throw new Error(
        `Access Denied: Key ${key} does not belong to merchant ${ctx.merchantId}`,
      );
    }

    // 2. Verify file exists
    try {
      await head(key);
    } catch (error: any) {
      throw new Error("File not found");
    }

    // 3. For Vercel Blob, construct the public URL
    // Format: https://[random].public.blob.vercel-storage.com/[key]
    const blobUrl = `https://${process.env.BLOB_READ_WRITE_TOKEN?.split("_")[1]}.public.blob.vercel-storage.com/${key}`;

    return blobUrl;
  }

  /**
   * Delete a file from storage
   */
  static async delete(ctx: TenantContext, key: string): Promise<void> {
    if (!FEATURES.STORAGE_ENABLED) {
      throw new Error("Storage feature is not configured");
    }

    // Enforce Prefix Check
    const expectedPrefix = `merchants/${ctx.merchantId}`;
    if (!key.startsWith(expectedPrefix)) {
      throw new Error(
        `Access Denied: Key ${key} does not belong to merchant ${ctx.merchantId}`,
      );
    }

    try {
      await del(key);
    } catch (error: any) {
      console.error("Storage delete failed:", error);
      throw new Error("Failed to delete file");
    }
  }

  /**
   * Check if storage is configured
   */
  static isConfigured(): boolean {
    return FEATURES.STORAGE_ENABLED;
  }
}
