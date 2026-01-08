import { logger } from "../../logger";

export class InstagramService {
    static async connect(authCode: string) {
        logger.info("Connecting Instagram account", { authCode });
        // Stub implementation
        return {
            id: "instagram_123",
            username: "demo_account",
            connected: true,
        };
    }

    static async disconnect(integrationId: string) {
        logger.info("Disconnecting Instagram account", { integrationId });
        return true;
    }
}
