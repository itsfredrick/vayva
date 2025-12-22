
import { prisma } from '@vayva/db';
import { GlassPanel, StatusChip, Button } from '@vayva/ui';
import { revalidatePath } from 'next/cache';

export const metadata = { title: 'Status & Uptime' };

async function resolveIncident(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await prisma.statusIncident.update({
        where: { id },
        data: { status: 'resolved', resolvedAt: new Date() }
    });
    revalidatePath('/admin/ops/status');
}

export default async function StatusPage() {
    const [checks, incidents] = await Promise.all([
        prisma.uptimeCheck.findMany({
            take: 50,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.statusIncident.findMany({
            where: { status: 'active' },
            orderBy: { startedAt: 'desc' }
        })
    ]);

    // Group checks by URL to show latest status
    const latestChecks = new Map();
    checks.forEach(c => {
        if (!latestChecks.has(c.url)) latestChecks.set(c.url, c);
    });

    return (
        <div className="max-w-5xl mx-auto p-8 space-y-8">
            <h1 className="text-2xl font-bold">Status Operations</h1>

            <section>
                <h2 className="text-xl font-semibold mb-4">Active Incidents</h2>
                {incidents.length === 0 ? (
                    <GlassPanel className="p-8 text-center text-muted-foreground bg-green-500/5 border-green-500/20">
                        All Systems Operational
                    </GlassPanel>
                ) : (
                    <div className="grid gap-4">
                        {incidents.map(inc => (
                            <GlassPanel key={inc.id} className="p-4 border-red-500/50 bg-red-500/10 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-red-400">{inc.title}</h3>
                                    <p className="text-sm opacity-80">{inc.description}</p>
                                    <div className="text-xs mt-2 font-mono">Started: {inc.startedAt.toLocaleString()}</div>
                                </div>
                                <form action={resolveIncident}>
                                    <input type="hidden" name="id" value={inc.id} />
                                    <Button type="submit" size="sm" variant="outline">Resolve</Button>
                                </form>
                            </GlassPanel>
                        ))}
                    </div>
                )}
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">System Health (Latest Checks)</h2>
                <div className="grid gap-3">
                    {Array.from(latestChecks.values()).map((check: any) => (
                        <GlassPanel key={check.id} className="p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${check.status === 'up' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`} />
                                <span className="font-medium">{check.url}</span>
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-4">
                                <span>{check.latencyMs}ms</span>
                                <span>{check.checkedAt.toLocaleTimeString()}</span>
                            </div>
                        </GlassPanel>
                    ))}
                </div>
            </section>
        </div>
    );
}
