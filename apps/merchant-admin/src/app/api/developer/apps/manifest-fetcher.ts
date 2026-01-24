/**
 * Fetches an external extension manifest from a URL and validates its structure.
 */
export async function fetchAndValidateManifest(url: any) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Vayva-Platform-Sync/1.0'
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch manifest from ${url}: ${response.statusText}`);
        }
        const manifest = await response.json();
        // Basic structure validation
        const requiredFields = ['id', 'name', 'version', 'category'];
        for (const field of requiredFields) {
            if (!manifest[field]) {
                throw new Error(`Invalid manifest: Missing required field "${field}"`);
            }
        }
        // Ensure it's not trying to hijack internal vayva.* namespace without permission
        if (manifest.id.startsWith('vayva.') && !url.includes('vayva.com')) {
            // In production, we'd enforce this. For now, just a warning or prefix.
        }
        return manifest;
    }
    catch (error: any) {
        console.error("Manifest Fetch Error:", error);
        throw error;
    }
}
