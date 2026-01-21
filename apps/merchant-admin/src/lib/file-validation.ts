/**
 * File Upload Validation Utility
 * Provides comprehensive validation for file uploads including:
 * - File size limits
 * - MIME type validation
 * - Image dimension validation
 * - Security checks
 */

export interface FileValidationOptions {
    maxSizeBytes?: number;
    allowedMimeTypes?: string[];
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
}

export interface FileValidationResult {
    valid: boolean;
    error?: string;
    code?: string;
}

// Default limits
export const DEFAULT_IMAGE_MAX_SIZE = 5 * 1024 * 1024; // 5MB
export const DEFAULT_ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
];

/**
 * Validate file size
 */
export function validateFileSize(
    file: File | Blob,
    maxSizeBytes: number = DEFAULT_IMAGE_MAX_SIZE
): FileValidationResult {
    if (file.size > maxSizeBytes) {
        const maxSizeMB = (maxSizeBytes / (1024 * 1024)).toFixed(1);
        return {
            valid: false,
            error: `File size exceeds ${maxSizeMB}MB limit`,
            code: 'FILE_TOO_LARGE'
        };
    }
    return { valid: true };
}

/**
 * Validate MIME type
 */
export function validateMimeType(
    file: File | Blob,
    allowedTypes: string[] = DEFAULT_ALLOWED_IMAGE_TYPES
): FileValidationResult {
    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
            code: 'INVALID_FILE_TYPE'
        };
    }
    return { valid: true };
}

/**
 * Validate image dimensions
 */
export async function validateImageDimensions(
    file: File | Blob,
    options: {
        minWidth?: number;
        maxWidth?: number;
        minHeight?: number;
        maxHeight?: number;
    }
): Promise<FileValidationResult> {
    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            const { width, height } = img;

            if (options.minWidth && width < options.minWidth) {
                resolve({
                    valid: false,
                    error: `Image width ${width}px is below minimum ${options.minWidth}px`,
                    code: 'IMAGE_TOO_SMALL'
                });
                return;
            }

            if (options.maxWidth && width > options.maxWidth) {
                resolve({
                    valid: false,
                    error: `Image width ${width}px exceeds maximum ${options.maxWidth}px`,
                    code: 'IMAGE_TOO_LARGE'
                });
                return;
            }

            if (options.minHeight && height < options.minHeight) {
                resolve({
                    valid: false,
                    error: `Image height ${height}px is below minimum ${options.minHeight}px`,
                    code: 'IMAGE_TOO_SMALL'
                });
                return;
            }

            if (options.maxHeight && height > options.maxHeight) {
                resolve({
                    valid: false,
                    error: `Image height ${height}px exceeds maximum ${options.maxHeight}px`,
                    code: 'IMAGE_TOO_LARGE'
                });
                return;
            }

            resolve({ valid: true });
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve({
                valid: false,
                error: 'Failed to load image',
                code: 'INVALID_IMAGE'
            });
        };

        img.src = url;
    });
}

/**
 * Check for potentially malicious file content
 * Basic security check for common attack vectors
 */
export async function checkMaliciousContent(file: File | Blob): Promise<FileValidationResult> {
    try {
        // Read first few bytes to check file signature
        const buffer = await file.slice(0, 512).arrayBuffer();
        const bytes = new Uint8Array(buffer);

        // Check for common image file signatures
        const signatures = {
            jpeg: [0xFF, 0xD8, 0xFF],
            png: [0x89, 0x50, 0x4E, 0x47],
            gif: [0x47, 0x49, 0x46],
            webp: [0x52, 0x49, 0x46, 0x46] // RIFF
        };

        let hasValidSignature = false;
        for (const [format, signature] of Object.entries(signatures)) {
            if (signature.every((byte, index) => bytes[index] === byte)) {
                hasValidSignature = true;
                break;
            }
        }

        if (!hasValidSignature) {
            return {
                valid: false,
                error: 'File does not have a valid image signature',
                code: 'INVALID_FILE_SIGNATURE'
            };
        }

        // Check for embedded scripts or suspicious patterns
        const text = new TextDecoder().decode(bytes);
        const suspiciousPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i, // event handlers like onclick=
            /<iframe/i,
            /<object/i,
            /<embed/i
        ];

        for (const pattern of suspiciousPatterns) {
            if (pattern.test(text)) {
                return {
                    valid: false,
                    error: 'File contains potentially malicious content',
                    code: 'MALICIOUS_CONTENT_DETECTED'
                };
            }
        }

        return { valid: true };
    } catch (error) {
        return {
            valid: false,
            error: 'Failed to scan file for malicious content',
            code: 'SCAN_FAILED'
        };
    }
}

/**
 * Comprehensive file validation
 * Runs all validation checks
 */
export async function validateFile(
    file: File | Blob,
    options: FileValidationOptions = {}
): Promise<FileValidationResult> {
    // Size validation
    const sizeResult = validateFileSize(file, options.maxSizeBytes);
    if (!sizeResult.valid) return sizeResult;

    // MIME type validation
    const mimeResult = validateMimeType(file, options.allowedMimeTypes);
    if (!mimeResult.valid) return mimeResult;

    // Malicious content check
    const securityResult = await checkMaliciousContent(file);
    if (!securityResult.valid) return securityResult;

    // Image dimension validation (if options provided)
    if (options.minWidth || options.maxWidth || options.minHeight || options.maxHeight) {
        const dimensionResult = await validateImageDimensions(file, options);
        if (!dimensionResult.valid) return dimensionResult;
    }

    return { valid: true };
}

/**
 * Server-side file validation for API routes
 * Validates FormData file uploads
 */
export async function validateUploadedFile(
    formData: FormData,
    fieldName: string = 'file',
    options: FileValidationOptions = {}
): Promise<{ valid: boolean; file?: File; error?: string; code?: string }> {
    const file = formData.get(fieldName);

    if (!file) {
        return {
            valid: false,
            error: 'No file provided',
            code: 'NO_FILE'
        };
    }

    if (!(file instanceof File)) {
        return {
            valid: false,
            error: 'Invalid file format',
            code: 'INVALID_FORMAT'
        };
    }

    const result = await validateFile(file, options);

    if (!result.valid) {
        return {
            valid: false,
            error: result.error,
            code: result.code
        };
    }

    return {
        valid: true,
        file
    };
}
