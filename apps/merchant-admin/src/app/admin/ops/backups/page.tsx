
import { prisma } from '@vayva/db';
import { GlassPanel, Button, Icon } from '@vayva/ui';
import { revalidatePath } from 'next/cache';

export const metadata = { title: 'Disaster Recovery' };

async function triggerDrill() {
    'use server';
    // In real scenario: Trigger generic BackupService.performDrill()
    // For V1 UI Demo:
    console.log("Triggering Backup Drill");
    revalidatePath('/admin/ops/backups');
}

export default async function BackupsPage() {
    const receipts = await prisma.backupReceipt.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="max-w-5xl mx-auto p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Backups & Disaster Recovery</h1>
                <form action={triggerDrill}>
                    <Button type="submit">
                        <Icon name={"Play" as any} size={14} className="mr-2" />
                        Run Restore Drill
                    </Button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassPanel className="p-6 text-center">
                    <div className="text-4xl font-bold text-green-400 mb-2">24h</div>
                    <div className="text-sm text-muted-foreground">RPO Target</div>
                </GlassPanel>
                <GlassPanel className="p-6 text-center">
                    <div className="text-4xl font-bold text-green-400 mb-2">4h</div>
                    <div className="text-sm text-muted-foreground">RTO Target</div>
                </GlassPanel>
                <GlassPanel className="p-6 text-center">
                    <div className="text-4xl font-bold text-primary mb-2">Encrypted</div>
                    <div className="text-sm text-muted-foreground">Storage Policy</div>
                </GlassPanel>
            </div>

            <section>
                <h2 className="text-xl font-semibold mb-4">Backup History</h2>
                <div className="space-y-3">
                    {receipts.length === 0 && <div className="text-muted-foreground">No backup receipts found.</div>}
                    {receipts.map(r => {
                        const meta = r.meta as any;
                        return (
                            <GlassPanel key={r.id} className="p-4 flex justify-between items-center">
                                <div>
                                    <div className="font-bold">{meta?.filename || r.backupId}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {((meta?.sizeBytes || 0) / 1024 / 1024).toFixed(2)} MB • {r.createdAt.toLocaleString()}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <span className={`px-2 py-0.5 text-xs rounded ${r.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                        {r.status === 'success' ? 'Verified' : 'Pending'}
                                    </span>
                                    {/* Only show download if Admin - implicitly admin here */}
                                    <Button size="sm" variant="ghost">
                                        <Icon name={"Download" as any} size={14} className="mr-2" />
                                        Proxy DL
                                    </Button>
                                </div>
                            </GlassPanel>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
