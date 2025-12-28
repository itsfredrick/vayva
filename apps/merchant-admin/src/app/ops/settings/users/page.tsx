
'use client';

import { useEffect, useState } from 'react';
import { UserPlus, Power, Key, Shield, Loader2, Copy, Check } from 'lucide-react';

interface OpsUser {
    id: string;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
    lastLoginAt: string | null;
    createdAt: string;
}

export default function OpsUsersPage() {
    const [users, setUsers] = useState<OpsUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tempPassword, setTempPassword] = useState<{ email: string, pass: string } | null>(null);

    // Create Form State
    const [showCreate, setShowCreate] = useState(false);
    const [createData, setCreateData] = useState({ email: '', name: '', role: 'OPS_READONLY' });
    const [createLoading, setCreateLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/ops/users');
            if (res.status === 403) throw new Error('Unauthorized');
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            setUsers(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateLoading(true);
        try {
            const res = await fetch('/api/ops/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setTempPassword({ email: data.user.email, pass: data.tempPassword });
            setShowCreate(false);
            setCreateData({ email: '', name: '', role: 'OPS_READONLY' });
            fetchUsers();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setCreateLoading(false);
        }
    };

    const handleAction = async (id: string, action: 'DISABLE' | 'ENABLE' | 'RESET_PASSWORD') => {
        if (!confirm(`Are you sure you want to ${action.replace('_', ' ').toLowerCase()} this user?`)) return;

        try {
            const res = await fetch(`/api/ops/users/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            if (data.tempPassword) {
                const user = users.find(u => u.id === id);
                setTempPassword({ email: user?.email || 'Unknown', pass: data.tempPassword });
            }

            fetchUsers();
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (loading) return <div className="p-8"><Loader2 className="animate-spin text-indigo-600" /></div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500">Manage access to internal tools</p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    <UserPlus className="h-4 w-4" /> New User
                </button>
            </div>

            {/* Temp Password Alert */}
            {tempPassword && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-green-800 font-semibold">
                        <Check className="h-5 w-5" /> Temporary Password Generated
                    </div>
                    <div className="text-sm text-green-700">
                        For user <strong>{tempPassword.email}</strong>. Copy this now, it will not be shown again.
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-2 border border-green-200 rounded font-mono text-lg text-gray-800 w-fit">
                        {tempPassword.pass}
                    </div>
                    <button onClick={() => setTempPassword(null)} className="text-sm text-green-600 hover:underline w-fit">Dismiss</button>
                </div>
            )}

            {/* Create Modal (Inline) */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Create New User</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input className="w-full border rounded-lg px-3 py-2" type="email" required
                                    value={createData.email} onChange={e => setCreateData({ ...createData, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input className="w-full border rounded-lg px-3 py-2" type="text" required
                                    value={createData.name} onChange={e => setCreateData({ ...createData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select className="w-full border rounded-lg px-3 py-2"
                                    value={createData.role} onChange={e => setCreateData({ ...createData, role: e.target.value })}>
                                    <option value="OPS_READONLY">Read Only</option>
                                    <option value="OPS_AGENT">Agent</option>
                                    <option value="OPS_ADMIN">Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" disabled={createLoading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                                    {createLoading ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Last Login</th>
                            <th className="px-6 py-3 text-xs font-semibold text-right text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{user.name || 'Unknown'}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {user.isActive ? (
                                        <span className="inline-flex items-center gap-1 text-green-700 text-sm font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-red-700 text-sm font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Disabled
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    {user.role !== 'OPS_OWNER' && (
                                        <>
                                            <button
                                                title="Reset Password"
                                                onClick={() => handleAction(user.id, 'RESET_PASSWORD')}
                                                className="text-gray-400 hover:text-indigo-600 transition-colors"
                                            >
                                                <Key className="h-4 w-4" />
                                            </button>
                                            <button
                                                title={user.isActive ? "Disable Access" : "Enable Access"}
                                                onClick={() => handleAction(user.id, user.isActive ? 'DISABLE' : 'ENABLE')}
                                                className={`${user.isActive ? 'text-gray-400 hover:text-red-600' : 'text-gray-400 hover:text-green-600'} transition-colors`}
                                            >
                                                <Power className="h-4 w-4" />
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
