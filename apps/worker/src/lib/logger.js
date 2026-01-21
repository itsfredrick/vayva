export const logger = {
    info: (message, meta) => {
        console.log(`[INFO] ${message}`, meta || "");
    },
    error: (message, error) => {
        console.error(`[ERROR] ${message}`, error || "");
    },
    warn: (message, meta) => {
        console.warn(`[WARN] ${message}`, meta || "");
    },
    debug: (message, meta) => {
        if (process.env.DEBUG) {
            console.log(`[DEBUG] ${message}`, meta || "");
        }
    },
};
