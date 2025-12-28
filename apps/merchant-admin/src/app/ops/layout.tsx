
import { OpsAuthService } from '@/lib/ops-auth';
import { redirect } from 'next/navigation';
import { LayoutDashboard, Users, Shield, BookOpen, LifeBuoy } from 'lucide-react';
import Link from 'next/link';
import { LogoutButton } from './components/LogoutButton';

export default async function OpsLayout({ children }: { children: React.ReactNode }) {
    const session = await OpsAuthService.getSession();

    if (!session) {
        redirect('/ops/login');
    }

    const { user } = session;
    const canManageUsers = ['OPS_OWNER', 'OPS_ADMIN'].includes(user.role);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0 sticky top-0 h-screen">
                <div className="p-6 border-b border-gray-800 flex items-center gap-3">
                    <Shield className="h-6 w-6 text-indigo-400" />
                    <span className="font-bold text-lg tracking-tight">Vayva Ops</span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <Link href="/ops" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors group">
                        <LayoutDashboard className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                        Dashboard
                    </Link>

                    <Link href="/ops/overview" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors group">
                        <BookOpen className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                        Ops Overview
                    </Link>

                    <Link href="/ops/support" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors group">
                        <LifeBuoy className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                        Platform Support
                    </Link>

                    <Link href="/ops/merchants" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors group">
                        <Users className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                        Merchants
                    </Link>

                    <Link href="/ops/kyc" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors group">
                        <Shield className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                        KYC Review
                    </Link>

                    <Link href="/ops/integrations" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors group">
                        <div className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors flex items-center justify-center">
                            <span className="text-sm font-bold">W</span>
                        </div>
                        Webhook Monitor
                    </Link>

                    <Link href="/ops/payouts" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors group">
                        <div className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors flex items-center justify-center">
                            <span className="text-sm font-bold">P</span>
                        </div>
                        Payout Readiness
                    </Link>

                    {canManageUsers && (
                        <Link href="/ops/settings/users" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors group">
                            <Users className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                            User Management
                        </Link>
                    )}
                </nav>

                <div className="p-4 border-t border-gray-800 bg-gray-900">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg bg-gray-800/50">
                        <div className="h-8 w-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold ring-2 ring-gray-900">
                            {(user.name?.[0] || user.email[0]).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <div className="text-sm font-medium text-white truncate">{user.name || user.email}</div>
                            <div className="text-xs text-gray-400 truncate capitalize">{user.role.replace('OPS_', '').toLowerCase().replace('_', ' ')}</div>
                        </div>
                    </div>
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                <div className="max-w-7xl mx-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
