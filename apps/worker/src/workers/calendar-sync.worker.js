import { Worker } from "bullmq";
import { QUEUES } from "@vayva/shared";
import { logger } from "../lib/logger";
// Simple iCal Parser (Regex based for MVP avoidance of heavy deps, or use node-ical)
// For robustness, we'd use a library. I'll write a minimal parser for the walkthrough.
function parseIcal(icalData) {
    const events = [];
    const lines = icalData.split(/\r\n|\n|\r/);
    let inEvent = false;
    let currentEvent = {};
    for (const line of lines) {
        if (line.startsWith("BEGIN:VEVENT")) {
            inEvent = true;
            currentEvent = {};
        }
        else if (line.startsWith("END:VEVENT")) {
            inEvent = false;
            if (currentEvent.dtstart && currentEvent.dtend) {
                events.push({
                    start: parseDate(currentEvent.dtstart),
                    end: parseDate(currentEvent.dtend),
                    summary: currentEvent.summary || "External Booking",
                    uid: currentEvent.uid
                });
            }
        }
        else if (inEvent) {
            if (line.startsWith("DTSTART"))
                currentEvent.dtstart = line.split(":")[1];
            if (line.startsWith("DTEND"))
                currentEvent.dtend = line.split(":")[1];
            if (line.startsWith("SUMMARY"))
                currentEvent.summary = line.split(":")[1];
            if (line.startsWith("UID"))
                currentEvent.uid = line.split(":")[1];
        }
    }
    return events;
}
function parseDate(dateStr) {
    // Basic typical iCal format: 20230101T120000Z
    const y = parseInt(dateStr.substring(0, 4));
    const m = parseInt(dateStr.substring(4, 6)) - 1;
    const d = parseInt(dateStr.substring(6, 8));
    return new Date(Date.UTC(y, m, d)); // Assuming UTC for sync to be safe
}
export const calendarSyncWorker = new Worker(QUEUES.CALENDAR_SYNC_SCHEDULER, async (job) => {
    logger.info("Running Calendar Sync Job (Disabled: Model Missing)", { jobId: job.id });
    /*
    try {
        // Fetch active syncs
        const syncs = await (prisma as any).bookingCalendarSync.findMany({
            where: {
                // In real app, check frequency or lastSyncedAt
            }
        });

        logger.info(`Found ${syncs.length} calendars to sync`);

        for (const sync of syncs) {
            try {
                logger.info(`Syncing ${sync.url}`);
                const response = await fetch(sync.url);
                if (!response.ok) throw new Error("Failed to fetch ICS");

                const icalText = await response.text();
                const events = parseIcal(icalText);

                logger.info(`Parsed ${events.length} events from ${sync.name}`);

                let createdCount = 0;

                for (const event of events) {
                    // Check duplication
                    const exists = await prisma.booking.findFirst({
                        where: {
                            serviceId: sync.productId,
                            metadata: {
                                path: ['externalUid'],
                                equals: event.uid
                            }
                        }
                    });

                    if (!exists) {
                        await prisma.booking.create({
                            data: {
                                storeId: (await prisma.product.findUnique({ where: { id: sync.productId } }))?.storeId!,
                                serviceId: sync.productId,
                                startsAt: event.start,
                                endsAt: event.end,
                                status: "CONFIRMED", // Blocked
                                notes: `Imported from ${sync.name}: ${event.summary}`,
                                metadata: {
                                    externalUid: event.uid,
                                    source: "ICAL_IMPORT",
                                    syncId: sync.id
                                }
                            }
                        });
                        createdCount++;
                    }
                }

                await (prisma as any).bookingCalendarSync.update({
                    where: { id: sync.id },
                    data: {
                        lastSyncedAt: new Date(),
                        syncStatus: "SUCCESS",
                        error: null
                    }
                });
                logger.info(`Imported ${createdCount} new bookings for ${sync.name}`);

            } catch (err: any) {
                logger.error(`Failed to sync calendar ${sync.id}`, err);
            }
        }

    } catch (error) {
        logger.error("Global Calendar Sync Failed", error as Error);
        throw error;
    }
    */
}, {
    connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD
    }
});
