import { prisma } from "@vayva/db";
import { IncidentManager } from "./incidentManager";

export class UptimeService {
  static async runChecks() {
    // 1. Fetch enabled checks
    const checks = await prisma.uptimeCheck.findMany({
      where: { enabled: true },
    });

    // 2. Execute parallel
    const results = await Promise.all(
      checks.map(async (check) => {
        const start = Date.now();
        let status = "success";
        let httpStatus = 0;
        let error = null;

        try {
          // Mock fetch for V1 (checking real URL requires external network)
          // In real implementation:
          // const res = await fetch(check.url, { method: check.method, signal: AbortSignal.timeout(check.timeoutMs) });
          // httpStatus = res.status;
          // if (!res.ok) throw new Error(\`Status \${res.status}\`);

          // Simulation Logic:
          if (check.url.includes("fail")) throw new Error("Simulated Timeout");
          httpStatus = 200;
        } catch (e: any) {
          status = "fail";
          error = e.message;
        }

        const latency = Date.now() - start;

        // 3. Record Result
        const result = await prisma.uptime_check_result.create({
          data: {
            uptimeCheckId: check.id,
            status,
            httpStatus,
            latencyMs: latency,
            error,
          },
        });

        // 4. Analyze for Incident
        await this.analyzeHealth(check.id, status, check.name);

        return result;
      }),
    );

    return results;
  }

  private static async analyzeHealth(
    checkId: string,
    currentStatus: string,
    checkName: string,
  ) {
    if (currentStatus === "success") {
      // Check for recovery? (Omitted for V1 succinctness)
      return;
    }

    // Fetch last 2 results
    const lastResults = await prisma.uptime_check_result.findMany({
      where: { uptimeCheckId: checkId },
      orderBy: { checkedAt: "desc" },
      take: 2,
    });

    // If 2 consecutive fails -> trigger incident
    const failCount = lastResults.filter((r) => r.status !== "success").length;
    if (failCount >= 2) {
      await IncidentManager.triggerIncident(checkId, checkName);
    }
  }
}
