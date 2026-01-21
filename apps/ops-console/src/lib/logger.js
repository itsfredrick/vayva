import { captureException } from "./sentry";
export const logger = {
    log: (level, payload) => {
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            environment: process.env.NODE_ENV,
            ...payload,
        };
        if (typeof window === "undefined") {
            // Server: JSON Structure for aggregators
            // Use console.error for errors to ensure they hit stderr
            if (level === "error") {
                console.error(JSON.stringify(entry));
            }
            else {
                console.log(JSON.stringify(entry));
            }
        }
        else {
            // Client: Readable
            // Skip info logs in production to reduce noise?
            // Keeping them for now for debugging as requested via "debuggability"
            if (level === "error") {
                console.error(`[${level.toUpperCase()}]`, payload.message, payload.error || "", payload.context || "");
            }
            else {
                console.log(`[${level.toUpperCase()}]`, payload.message, payload.context || "");
            }
        }
    },
    error: (message, error, context) => {
        logger.log("error", { message, error, context });
        captureException(error || new Error(message), { ...context, message });
    },
    warn: (message, context) => {
        logger.log("warn", { message, context });
    },
    info: (message, context) => {
        logger.log("info", { message, context });
    },
};
