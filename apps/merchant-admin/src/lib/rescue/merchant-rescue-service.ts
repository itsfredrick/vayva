import { prisma } from "@vayva/db";
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY_RESCUE || process.env.GROQ_API_KEY || "",
});

export class MerchantRescueService {
    /**
     * Ingest a new incident from the merchant frontend
     */
    static async reportIncident(data: {
        route: string;
        errorMessage: string;
        stackHash?: string;
        storeId?: string;
        userId?: string;
        fingerprint?: string;
    }) {
        // 1. Redact PII
        const redactedMessage = this.redactPII(data.errorMessage);

        // 2. Generate fingerprint if not provided
        const fingerprint = data.fingerprint || this.generateFingerprint("UI_ERROR", redactedMessage);

        // 3. Create or Update Incident
        // We strive for idempotency
        const incident = await prisma.rescueIncident.upsert({
            where: { fingerprint },
            create: {
                surface: "MERCHANT_ADMIN",
                errorType: "UI_CRASH", // Assuming mostly UI reports
                errorMessage: redactedMessage,
                severity: "MEDIUM",
                route: data.route,
                storeId: data.storeId,
                userId: data.userId,
                fingerprint,
                status: "RUNNING",
                diagnostics: {
                    stackHash: data.stackHash
                },
            },
            update: {
                status: "RUNNING",
                updatedAt: new Date(),
                // Update user if different? Maybe not needed for simple reporting
            },
        });

        // 4. Trigger Analysis (Async but awaited for demo/speed)
        // In a real high-throughput system, this might be offloaded to a queue
        this.analyzeAndSuggest(incident.id).catch(err => console.error("Rescue AI background fail", err));

        return incident;
    }

    static async getIncidentStatus(id: string) {
        return prisma.rescueIncident.findUnique({
            where: { id },
            select: {
                id: true,
                status: true,
                diagnostics: true,
            }
        });
    }

    /**
     * AI Analysis
     */
    private static async analyzeAndSuggest(incidentId: string) {
        const incident = await prisma.rescueIncident.findUnique({ where: { id: incidentId } });
        if (!incident) return;

        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `
              You are Vayva Rescue AI.
              Classify the error: AUTH, DATABASE, NETWORK, UI_RENDER, UNKNOWN.
              Suggest a USER-FACING-ACTION: "REFRESH", "RELOGIN", "WAIT", "CONTACT_SUPPORT".
              Suggest a remediation for engineers (short codes snippet idea).
              
              Return JSON: { "classification": "...", "USER_FACING_ACTION": "...", "remediation": "..." }
              
              Context:
              - App: Merchant Admin
              - Error: ${incident.errorMessage}
            `,
                    },
                    { role: "user", content: "Analyze this incident." },
                ],
                model: "llama-3.1-70b-versatile",
                response_format: { type: "json_object" },
            });

            const analysis = JSON.parse(completion.choices[0]?.message?.content || "{}");

            // Determine next status based on analysis
            let nextStatus = "NEEDS_ENGINEERING";
            if (analysis.USER_FACING_ACTION === "REFRESH") {
                nextStatus = "READY_TO_REFRESH";
            } else if (analysis.USER_FACING_ACTION === "RELOGIN") {
                // In a fuller implementation, we might trigger a signout on client
                nextStatus = "READY_TO_REFRESH";
            }

            await prisma.rescueIncident.update({
                where: { id: incidentId },
                data: {
                    status: nextStatus,
                    diagnostics: {
                        ...(incident.diagnostics as any),
                        aiAnalysis: analysis,
                    },
                },
            });
        } catch (error) {
            console.error("Rescue Analysis Error", error);
        }
    }

    private static redactPII(msg: string) {
        return msg
            .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[EMAIL]")
            .replace(/password[:=]\s*[^\s&]+/gi, "password=[REDACTED]");
    }

    private static generateFingerprint(type: string, msg: string) {
        const str = `${type}:${msg.slice(0, 100)}`;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash).toString(16);
    }
}
