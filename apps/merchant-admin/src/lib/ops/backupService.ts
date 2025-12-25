
import { prisma } from '@vayva/db';

export class BackupService {

    static async checkBackupHealth() {
        const threshold = 24 * 60 * 60 * 1000; // 24h

        const lastReceipt = await prisma.backupReceipt.findFirst({
            where: { status: 'success' },
            orderBy: { createdAt: 'desc' }
        });

        const now = Date.now();
        const lastTime = lastReceipt ? lastReceipt.createdAt.getTime() : 0;
        const isHealthy = (now - lastTime) < threshold;

        return {
            healthy: isHealthy,
            lastBackup: lastReceipt?.createdAt || null,
            gapHours: (now - lastTime) / (1000 * 60 * 60)
        };
    }

    static async runRestoreDrill(sourceId: string) {
        // 1. Log Start
        const drill = await prisma.restore_drill_run.create({
            data: {
                startedAt: new Date(),
                restoreSource: sourceId,
                status: 'running'
            }
        });

        try {
            // 2. Simulate Restore Process
            // In real env: calls shell script or cloud API
            console.log(`[Drill] Restoring from ${sourceId}...`);
            await new Promise(r => setTimeout(r, 100)); // Sim delay

            // 3. Simulate Verification
            const smokeTestPassed = true;

            // 4. Log Completion
            await prisma.restore_drill_run.update({
                where: { id: drill.id },
                data: {
                    completedAt: new Date(),
                    status: smokeTestPassed ? 'success' : 'failed'
                }
            });

            return { success: true };

        } catch (e: any) {
            await prisma.restore_drill_run.update({
                where: { id: drill.id },
                data: {
                    completedAt: new Date(),
                    status: 'failed',
                    error: e.message
                }
            });
            return { success: false, error: e.message };
        }
    }
}
