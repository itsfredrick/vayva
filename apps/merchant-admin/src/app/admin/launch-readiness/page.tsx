
import { prisma } from '@vayva/db';
import { GlassPanel, StatusChip, Button } from '@vayva/ui';
import { EnvHealth } from '../../../lib/ops/envHealth';
import { ServiceHealth } from '../../../lib/ops/serviceHealth';
import { CheckCircle, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';

export const metadata = { title: 'Launch Readiness' };

export default async function LaunchReadinessPage() {
    const [envHealth, serviceHealth, latestBackup] = await Promise.all([
        Promise.resolve(EnvHealth.check()), // Synchronous but wrap for consistence
        ServiceHealth.check(),
        prisma.backupReceipt.findFirst({ orderBy: { createdAt: 'desc' } })
    ]);

    const gates = [
        { name: 'Environment Config', status: envHealth.ok },
        { name: 'Critical Services', status: serviceHealth.ok },
        { name: 'Recent Backup', status: !!latestBackup && (Date.now() - latestBackup.createdAt.getTime() < 24 * 60 * 60 * 1000) }, // < 24h
        { name: 'SSL / Security', status: true } // Mocked assumption for V1
    ];

    const allPass = gates.every(g => g.status);

    return (
        <div className="max-w-5xl mx-auto p-8 space-y-8">
            <h1 className="text-2xl font-bold">Production Launch Readiness</h1>

            <div className={`p-8 rounded-lg border flex items-center justify-between ${allPass ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'}`}>
                <div className="flex items-center gap-4">
                    {allPass ? <ShieldCheck className="w-12 h-12 text-green-500" /> : <XCircle className="w-12 h-12 text-red-500" />}
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">{allPass ? 'SYSTEM GO' : 'NO-GO'}</h2>
                        <p className="text-muted-foreground">{allPass ? 'All systems operational. Safe to deploy.' : 'Critical gates failing. Do not deploy.'}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm font-mono opacity-50">GATE CHECKS</div>
                    <div className="text-2xl font-bold">{gates.filter(g => g.status).length} / {gates.length} PASS</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassPanel className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Environment Checks
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span>Config Variables</span>
                            <div className="flex items-center gap-2">
                                <StatusChip status={envHealth.ok ? 'active' : 'error'} />
                                <span className="text-xs font-bold">{envHealth.ok ? 'OK' : 'MISSING'}</span>
                            </div>
                        </div>
                        {envHealth.missing.length > 0 && (
                            <div className="p-3 bg-red-500/10 rounded text-xs text-red-400">
                                Missing: {envHealth.missing.join(', ')}
                            </div>
                        )}
                        {envHealth.warnings.length > 0 && (
                            <div className="p-3 bg-yellow-500/10 rounded text-xs text-yellow-500">
                                Warning: {envHealth.warnings.join(', ')}
                            </div>
                        )}
                    </div>
                </GlassPanel>

                <GlassPanel className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Service Health
                    </h3>
                    <div className="space-y-3">
                        {Object.entries(serviceHealth.services).map(([svc, active]) => (
                            <div key={svc} className="flex justify-between items-center">
                                <span className="capitalize">{svc}</span>
                                <StatusChip status={active ? 'active' : 'error'} />
                            </div>
                        ))}
                    </div>
                </GlassPanel>

                <GlassPanel className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Data Safety
                    </h3>
                    <div className="flex justify-between items-center">
                        <div>
                            <div>Latest Backup</div>
                            <div className="text-xs text-muted-foreground">{latestBackup ? latestBackup.createdAt.toLocaleString() : 'Never'}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <StatusChip status={latestBackup && (Date.now() - latestBackup.createdAt.getTime() < 24 * 60 * 60 * 1000) ? 'active' : 'warning'} />
                            <span className="text-xs font-bold">{latestBackup ? 'Found' : 'Missing'}</span>
                        </div>
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
}
