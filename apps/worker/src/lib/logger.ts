export const logger = {
    info: (message: string, meta?: unknown) => {
        console.log(`[INFO] ${message}`, meta || "");
    },
    error: (message: string, error?: unknown) => {
        console.error(`[ERROR] ${message}`, error || "");
    },
    warn: (message: string, meta?: unknown) => {
        console.warn(`[WARN] ${message}`, meta || "");
    },
    debug: (message: string, meta?: unknown) => {
        if (process.env.DEBUG) {
            console.log(`[DEBUG] ${message}`, meta || "");
        }
    },
};
