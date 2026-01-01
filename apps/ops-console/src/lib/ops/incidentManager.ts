import { prisma } from "@vayva/db";

export class IncidentManager {
  static async triggerIncident(checkId: string, checkName: string) {
    // 1. Check for existing active incident linked to this check
    const links = await prisma.incident_link.findMany({
      where: { uptimeCheckId: checkId },
    });

    const incidentIds = links.map((l) => l.incidentId);

    if (incidentIds.length > 0) {
      const existing = await prisma.statusIncident.findFirst({
        where: {
          id: { in: incidentIds },
          status: { in: ["investigating", "identified", "monitoring"] },
        },
      });
      if (existing) return; // Already tracking
    }

    // 2. Create Incident via Transaction (since no relations defined in schema)
    await prisma.$transaction(async (tx) => {
      const incident = await tx.statusIncident.create({
        data: {
          title: `Service disruption: ${checkName}`,
          status: "investigating",
          impact: "major",
          description: `Automated alert: Elevated failure rate detected on ${checkName}.`,
          startedAt: new Date(),
        },
      });

      await tx.incident_link.create({
        data: {
          incidentId: incident.id,
          uptimeCheckId: checkId,
        },
      });

      await tx.status_incident_update.create({
        data: {
          incidentId: incident.id,
          message: `Automated alert: Elevated failure rate detected on ${checkName}.`,
          authorType: "system",
        },
      });

      console.log(`[INCIDENT] Created ${incident.id} for ${checkName}`);
    });
  }

  static async resolveIncident(incidentId: string, reason: string) {
    await prisma.$transaction([
      prisma.statusIncident.update({
        where: { id: incidentId },
        data: {
          status: "resolved",
          resolvedAt: new Date(),
        },
      }),
      prisma.status_incident_update.create({
        data: {
          incidentId,
          message: `Resolved: ${reason}`,
          authorType: "admin",
        },
      }),
    ]);
  }
}
