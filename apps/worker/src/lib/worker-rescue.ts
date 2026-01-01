import { prisma } from "@vayva/db";

export class WorkerRescueService {
    /**
     * Report a worker-level incident
     */
    static async reportJobFailure(queueName: string, jobId: string, error: any) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        const fingerprint = this.generateFingerprint(queueName, errorMsg);

        // 1. Create/Update Rescue Incident
        await prisma.rescueIncident.upsert({
            where: { fingerprint },
            create: {
                surface: "WORKER",
                errorType: "JOB_FAILURE",
                errorMessage: errorMsg,
                severity: "HIGH",
                fingerprint,
                status: "OPEN",
                diagnostics: {
                    queueName,
                    jobId,
                    stack: error instanceof Error ? error.stack : undefined,
                },
            },
            update: {
                status: "OPEN", // Re-open if it was closed
                updatedAt: new Date(),
            },
        });

        console.log(`[RESCUE] Captured worker failure on ${queueName} job ${jobId}`);
    }

    private static generateFingerprint(queueName: string, msg: string) {
        const str = `WORKER:${queueName}:${msg.slice(0, 100)}`;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash).toString(16);
    }
}
