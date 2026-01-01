"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
    Users,
    CreditCard,
    ShoppingBag,
    Truck,
    History,
    ShieldCheck,
    Settings,
    AlertTriangle,
    LogIn,
    ArrowLeft,
    Info,
    FileText,
    BrainCircuit,
    Plug
} from "lucide-react";
import { useOpsQuery } from "@/hooks/useOpsQuery";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ReasonModal } from "@/components/ops/ReasonModal";

type Tab = "overview" | "orders" | "payments" | "deliveries" | "kyc" | "audit" | "actions" | "notes" | "ai" | "integrations";

export default function MerchantDetailPage() {
    const { id } = useParams() as { id: string };
    const searchParams = useSearchParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [impersonating, setImpersonating] = useState(false);

    // URL-driven Tab State
    const tabParam = searchParams.get("tab");
    const validTabs = ["overview", "orders", "payments", "deliveries", "kyc", "audit", "actions", "notes", "ai", "integrations"];
    const activeTab = (tabParam && validTabs.includes(tabParam) ? tabParam : "overview") as Tab;

    const setActiveTab = (t: Tab) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", t);
        router.push(`?${params.toString()}`);
    };

    // Modal State
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        action: string | null;
        confirmLabel?: string;
        requiresTyping?: boolean;
        confirmText?: string;
    }>({
        isOpen: false,
        title: "",
        description: "",
        action: null,
    });

    // Fetch merchant data
    const { data: merchantData, isLoading: merchantLoading } = useOpsQuery(
        ["merchant", id],
        async () => {
            const res = await fetch(`/api/ops/merchants/${id}`);
            if (res.status === 401) {
                window.location.href = "/ops/login";
                return;
            }
            if (!res.ok) throw new Error("Failed to load merchant");
            return res.json();
        }
    );

    // Fetch tab data
    const { data: tabDataRaw, isLoading: tabLoading } = useOpsQuery(
        ["merchant", id, activeTab],
        async () => {
            if (activeTab === "overview") return merchantData;
            if (activeTab === "actions") return null; // Actions tab doesn't need data

            const res = await fetch(`/api/ops/merchants/${id}/${activeTab}`);
            if (!res.ok) throw new Error("Failed to fetch tab data");
            const json = await res.json();
            return json.data || [];
        },
        { enabled: !!merchantData && activeTab !== "overview" && activeTab !== "actions" }
    );

    const tabData = tabDataRaw || [];

    const triggerActionModal = (
        action: string,
        title: string,
        description: string,
        requiresTyping = false,
        confirmText = ""
    ) => {
        setModalConfig({
            isOpen: true,
            title,
            description,
            action,
            confirmLabel: "Confirm Action",
            requiresTyping,
            confirmText,
        });
    };

    const handleActionConfirm = async (reason: string) => {
        const { action } = modalConfig;
        if (!action) return;

        try {
            const res = await fetch(`/api/ops/merchants/${id}/actions/${action}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason }),
            });
            const json = await res.json();
            if (json.success) {
                toast.success("Success", { description: "Action completed successfully" });
                queryClient.invalidateQueries({ queryKey: ["merchant", id] });
            } else {
                toast.error("Action Failed", { description: json.error });
            }
        } catch (e) {
            toast.error("Network Error", { description: "Could not reach the server" });
        }
    };

    const handleImpersonate = async () => {
        if (
            !confirm(
                "Are you sure you want to log in as this merchant? This action will be audited."
            )
        )
            return;

        setImpersonating(true);
        const promise = fetch(`/api/ops/merchants/${id}/impersonate`, { method: "POST" }).then(
            async (res) => {
                const json = await res.json();
                if (json.success && json.token) {
                    const magicLink = `${json.redirectUrl}/api/auth/impersonate?token=${json.token}`;
                    window.location.href = magicLink;
                } else {
                    throw new Error(json.error || "Failed to generate session");
                }
            }
        );

        toast.promise(promise, {
            loading: "Connecting to host...",
            success: "Access granted. Redirecting...",
            error: (err) => `Impersonation failed: ${err.message}`,
        });

        promise.finally(() => setImpersonating(false));
    };

    if (merchantLoading)
        return <div className="p-12 text-center text-gray-500">Loading merchant details...</div>;
    if (!merchantData)
        return <div className="p-12 text-center text-red-500">Merchant not found</div>;

    const { profile, stats } = merchantData;

    const tabs: { id: Tab; label: string; icon: any }[] = [
        { id: "overview", label: "Overview", icon: Info },
        { id: "orders", label: "Orders", icon: ShoppingBag },
        { id: "payments", label: "Payments", icon: CreditCard },
        { id: "deliveries", label: "Deliveries", icon: Truck },
        { id: "kyc", label: "KYC", icon: ShieldCheck },
        { id: "audit", label: "Audit Log", icon: History },
        { id: "notes", label: "Internal Notes", icon: FileText },
        { id: "ai", label: "AI Config", icon: BrainCircuit },
        { id: "integrations", label: "Integrations", icon: Plug },
        { id: "actions", label: "Actions", icon: Settings },
    ];

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <Link
                    href="/ops/merchants"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-800 mb-4 gap-1"
                >
                    <ArrowLeft size={16} /> Back to Merchants
                </Link>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 font-bold text-2xl overflow-hidden border border-gray-100">
                            {profile.logoUrl ? (
                                <img src={profile.logoUrl} className="w-full h-full object-cover" alt="Logo" />
                            ) : (
                                profile.name?.[0]
                            )}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <span>{profile.slug}</span>
                                <span>•</span>
                                <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
                                {profile.isLive ? (
                                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium text-xs">
                                        LIVE
                                    </span>
                                ) : (
                                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium text-xs">
                                        DRAFT
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleImpersonate}
                            disabled={impersonating}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            {impersonating ? (
                                "Connecting..."
                            ) : (
                                <>
                                    <LogIn size={16} />
                                    Login as Merchant
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4">
                <StatCard label="Total Orders" value={stats.ordersCount} icon={ShoppingBag} />
                <StatCard
                    label="GMV (All Time)"
                    value={`₦${stats.gmv.toLocaleString()}`}
                    icon={CreditCard}
                />
                <StatCard label="Customers" value={stats.customersCount} icon={Users} />
                <StatCard
                    label="Wallet Balance"
                    value={`₦${stats.walletBalance.toLocaleString()}`}
                    icon={AlertTriangle}
                    highlight={stats.walletBalance < 0}
                />
            </div>

            {/* Tabs */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="flex border-b border-gray-200 px-4 pt-4 gap-4 bg-gray-50/50 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-0">
                    {tabLoading ? (
                        <div className="p-12 text-center text-gray-400 animate-pulse">Loading data...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            {activeTab === "overview" && <OverviewTab data={merchantData} />}
                            {activeTab === "orders" && <OrdersTable data={tabData} />}
                            {activeTab === "payments" && <PaymentsTable data={tabData} />}
                            {activeTab === "deliveries" && <DeliveriesTable data={tabData} />}
                            {activeTab === "kyc" && <KYCTab data={tabData} />}
                            {activeTab === "audit" && <AuditTable data={tabData} />}
                            {activeTab === "notes" && <NotesTab merchantId={id} initialNotes={merchantData.notes} />}
                            {activeTab === "ai" && <AiConfigTab merchantId={id} />}
                            {activeTab === "integrations" && <IntegrationsTab merchantId={id} />}
                            {activeTab === "actions" && (
                                <ActionsTab merchantId={id} merchantName={profile.name} triggerActionModal={triggerActionModal} />
                            )}
                        </div>
                    )}
                </div>
            </div>

            <ReasonModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
                onConfirm={handleActionConfirm}
                title={modalConfig.title}
                description={modalConfig.description}
                confirmLabel={modalConfig.confirmLabel}
            />
        </div>
    );
}

// --- Sub-components ---

function AiConfigTab({ merchantId }: { merchantId: string }) {
    const { data: profile, isLoading, refetch } = useOpsQuery(
        ["merchant-ai", merchantId],
        () => fetch(`/api/ops/merchants/${merchantId}/ai`).then(res => res.json().then(j => j.data))
    );

    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<any>({});

    // Sync form data when profile loads
    React.useEffect(() => {
        if (profile) {
            setFormData({
                agentName: profile.agentName || "",
                tonePreset: profile.tonePreset || "Friendly",
                greetingTemplate: profile.greetingTemplate || ""
            });
        }
    }, [profile]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/ops/merchants/${merchantId}/ai`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const json = await res.json();
            if (json.success) {
                toast.success("AI Configuration Saved");
                refetch();
            } else {
                toast.error("Save failed", { description: json.error });
            }
        } catch (e) {
            toast.error("Network Error");
        } finally {
            setSaving(false);
        }
    };

    if (isLoading) return <div className="p-12 text-center text-gray-400">Loading AI profile...</div>;

    return (
        <div className="p-6 max-w-2xl">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                        <BrainCircuit size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Agent Configuration</h3>
                        <p className="text-sm text-gray-500">Customize how the AI responds to customers.</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
                        <input
                            type="text"
                            value={formData.agentName}
                            onChange={e => handleChange("agentName", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                            placeholder="e.g. Alice"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tone Preset</label>
                        <select
                            value={formData.tonePreset}
                            onChange={e => handleChange("tonePreset", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                        >
                            <option value="Friendly">Friendly</option>
                            <option value="Professional">Professional</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Playful">Playful</option>
                            <option value="Minimal">Minimal</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Greeting Template</label>
                        <textarea
                            value={formData.greetingTemplate}
                            onChange={e => handleChange("greetingTemplate", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none min-h-[80px]"
                            placeholder="Hello! How can I help you today?"
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave blank to use system default.</p>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-70 flex items-center gap-2"
                        >
                            {saving ? "Saving..." : "Save Configuration"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function IntegrationsTab({ merchantId }: { merchantId: string }) {
    const { data, isLoading } = useOpsQuery(
        ["merchant-integrations", merchantId],
        () => fetch(`/api/ops/merchants/${merchantId}/integrations`).then(res => res.json().then(j => j.data))
    );

    if (isLoading) return <div className="p-12 text-center text-gray-400">Checking connection status...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Failed to load integration status.</div>;

    const { whatsapp, webhooks, payment } = data;

    return (
        <div className="space-y-6 p-6">
            <h2 className="text-lg font-bold text-gray-900">Third-Party Connections</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Whatsapp Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900">WhatsApp</h3>
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${whatsapp.status === 'CONNECTED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {whatsapp.status}
                        </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Business Name</span>
                            <span className="font-medium text-gray-900">{whatsapp.businessName || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Phone</span>
                            <span className="font-medium text-gray-900">{whatsapp.displayPhoneNumber || "N/A"}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900">Payment Gateway</h3>
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${payment.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {payment.status}
                        </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Provider</span>
                            <span className="font-medium text-gray-900 uppercase">{payment.provider}</span>
                        </div>
                    </div>
                </div>

                {/* Webhooks Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900">Webhooks</h3>
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs font-bold rounded-full">
                            {webhooks.length} Active
                        </span>
                    </div>
                    {webhooks.length === 0 ? (
                        <p className="text-sm text-gray-400">No endpoints configured.</p>
                    ) : (
                        <ul className="space-y-2">
                            {webhooks.map((w: any) => (
                                <li key={w.id} className="text-xs border border-gray-100 rounded p-2 flex justify-between items-center bg-gray-50">
                                    <span className="truncate max-w-[120px]" title={w.url}>{w.url}</span>
                                    <span className={`h-2 w-2 rounded-full ${w.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
        </div>
    );
}


function NotesTab({ merchantId, initialNotes }: { merchantId: string, initialNotes: any[] }) {
    const [notes, setNotes] = useState(initialNotes || []);
    const [newNote, setNewNote] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote.trim()) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/ops/merchants/${merchantId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ note: newNote }),
            });
            const json = await res.json();

            if (json.success) {
                setNotes(json.notes);
                setNewNote("");
                toast.success("Note Added");
            } else {
                toast.error("Failed to add note");
            }
        } catch (error) {
            toast.error("Network Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Notes List */}
            <div className="md:col-span-2 space-y-6">
                <h3 className="font-bold text-gray-900">Activity & Notes</h3>

                {notes.length === 0 ? (
                    <div className="p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center text-gray-400 text-sm">
                        No internal notes yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notes.map((note: any, i: number) => (
                            <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                                <p className="text-gray-800 text-sm whitespace-pre-wrap">{note.text}</p>
                                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 border-t border-gray-50 pt-2">
                                    <span className="font-medium text-indigo-600">{note.author}</span>
                                    <span>•</span>
                                    <span>{new Date(note.date).toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Note Form */}
            <div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sticky top-6">
                    <h3 className="font-bold text-gray-900 text-sm mb-3">Add Internal Note</h3>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none min-h-[120px] mb-3"
                            placeholder="Write a note about this merchant..."
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !newNote.trim()}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg text-sm transition-colors disabled:opacity-70 flex justify-center items-center"
                        >
                            {loading ? "Saving..." : "Save Note"}
                        </button>
                        <p className="text-[10px] text-gray-400 mt-2 text-center">
                            Notes are visible to Ops team only.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon: Icon, highlight }: any) {
    return (
        <div
            className={`p-5 bg-white border rounded-xl shadow-sm flex items-start justify-between ${highlight ? "border-red-200 bg-red-50" : "border-gray-200"
                }`}
        >
            <div>
                <div className={`text-sm font-medium mb-1 ${highlight ? "text-red-600" : "text-gray-500"}`}>
                    {label}
                </div>
                <div className={`text-2xl font-bold ${highlight ? "text-red-900" : "text-gray-900"}`}>
                    {value}
                </div>
            </div>
            <div
                className={`p-2 rounded-lg ${highlight ? "bg-red-100 text-red-500" : "bg-gray-50 text-gray-400"
                    }`}
            >
                <Icon size={20} />
            </div>
        </div>
    );
}

function OverviewTab({ data }: { data: any }) {
    const { profile, stats } = data;

    return (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
                {/* Profile Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Information</h3>
                    <dl className="space-y-3">
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase">Business Name</dt>
                            <dd className="text-sm font-medium text-gray-900 mt-1">{profile.name}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase">Slug</dt>
                            <dd className="text-sm font-medium text-gray-900 mt-1">{profile.slug}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase">Plan</dt>
                            <dd className="text-sm font-medium text-gray-900 mt-1">
                                <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-bold uppercase">
                                    {profile.plan || "FREE"}
                                </span>
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase">Status</dt>
                            <dd className="text-sm font-medium text-gray-900 mt-1">
                                {profile.isLive ? (
                                    <span className="text-green-600">● Live</span>
                                ) : (
                                    <span className="text-gray-400">● Draft</span>
                                )}
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* Health Metrics */}
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Health Metrics</h3>
                    <dl className="space-y-3">
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase">Total Orders</dt>
                            <dd className="text-2xl font-bold text-gray-900 mt-1">{stats.ordersCount}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase">GMV (All Time)</dt>
                            <dd className="text-2xl font-bold text-gray-900 mt-1">₦{stats.gmv.toLocaleString()}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase">Wallet Balance</dt>
                            <dd className={`text-2xl font-bold mt-1 ${stats.walletBalance < 0 ? "text-red-600" : "text-gray-900"}`}>
                                ₦{stats.walletBalance.toLocaleString()}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}

function KYCTab({ data }: { data: any }) {
    if (!data || data.length === 0) {
        return (
            <div className="p-12 text-center">
                <ShieldCheck className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No KYC submissions</p>
                <p className="text-sm text-gray-400 mt-1">This merchant hasn't submitted KYC documents yet</p>
            </div>
        );
    }

    const latest = data[0];

    return (
        <div className="p-6 space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Latest KYC Submission</h3>
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${latest.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : latest.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                    >
                        {latest.status}
                    </span>
                </div>
                <dl className="space-y-3">
                    <div>
                        <dt className="text-xs font-medium text-gray-500 uppercase">Submitted</dt>
                        <dd className="text-sm font-medium text-gray-900 mt-1">
                            {new Date(latest.createdAt).toLocaleString()}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-xs font-medium text-gray-500 uppercase">Document Type</dt>
                        <dd className="text-sm font-medium text-gray-900 mt-1">{latest.documentType || "N/A"}</dd>
                    </div>
                    {latest.reviewedAt && (
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase">Reviewed</dt>
                            <dd className="text-sm font-medium text-gray-900 mt-1">
                                {new Date(latest.reviewedAt).toLocaleString()}
                            </dd>
                        </div>
                    )}
                    {latest.rejectionReason && (
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase">Rejection Reason</dt>
                            <dd className="text-sm font-medium text-red-600 mt-1">{latest.rejectionReason}</dd>
                        </div>
                    )}
                </dl>
            </div>
        </div>
    );
}

function ActionsTab({ merchantId, merchantName, triggerActionModal }: any) {
    return (
        <div className="p-6">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-6">
                    <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-lg font-bold text-red-900">Danger Zone</h3>
                        <p className="text-sm text-red-700 mt-1">
                            These actions are irreversible and will be logged in the audit trail.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <ActionButton
                        label="Disable Payouts"
                        variant="danger"
                        onClick={() =>
                            triggerActionModal(
                                "disable-payouts",
                                "Disable Payouts",
                                `Are you sure you want to disable payouts for ${merchantName}? This will block all wallet settlements.`,
                                true,
                                merchantName
                            )
                        }
                    />
                    <ActionButton
                        label="Enable Payouts"
                        variant="secondary"
                        onClick={() =>
                            triggerActionModal(
                                "enable-payouts",
                                "Enable Payouts",
                                `Are you sure you want to enable payouts for ${merchantName}?`
                            )
                        }
                    />
                    <ActionButton
                        label="Force KYC Review"
                        variant="secondary"
                        onClick={() =>
                            triggerActionModal(
                                "force-kyc-review",
                                "Force KYC Review",
                                "This will trigger a re-validation of the merchant's identity documents."
                            )
                        }
                    />
                    <ActionButton
                        label="Suspend Account"
                        variant="danger"
                        onClick={() =>
                            triggerActionModal(
                                "suspend-account",
                                "Suspend Account",
                                `Are you sure you want to suspend ${merchantName}? This will prevent all operations.`,
                                true,
                                merchantName
                            )
                        }
                    />
                </div>
            </div>
        </div>
    );
}

function ActionButton({ label, onClick, variant }: any) {
    const base = "px-4 py-3 rounded-lg text-sm font-medium transition-colors border";
    const variants: any = {
        danger: "bg-red-600 text-white border-red-600 hover:bg-red-700",
        secondary: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
    };
    return (
        <button onClick={onClick} className={`${base} ${variants[variant]}`}>
            {label}
        </button>
    );
}

function OrdersTable({ data }: { data: any[] }) {
    if (!data || !data.length)
        return <div className="p-8 text-center text-gray-400">No orders found.</div>;
    return (
        <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                <tr>
                    <th className="px-6 py-3 font-medium">ID</th>
                    <th className="px-6 py-3 font-medium">Customer</th>
                    <th className="px-6 py-3 font-medium">Total</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {data.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono text-indigo-600 font-medium">#{o.displayId}</td>
                        <td className="px-6 py-4 text-gray-600">{o.customer}</td>
                        <td className="px-6 py-4 font-medium">₦{o.total.toLocaleString()}</td>
                        <td className="px-6 py-4">
                            <span
                                className={`px-2 py-0.5 rounded text-xs font-medium ${o.status === "COMPLETED"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                {o.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function PaymentsTable({ data }: { data: any[] }) {
    if (!data || !data.length)
        return <div className="p-8 text-center text-gray-400">No payments found.</div>;
    return (
        <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                <tr>
                    <th className="px-6 py-3 font-medium">Reference</th>
                    <th className="px-6 py-3 font-medium">Provider</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {data.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-xs font-mono text-gray-500">{p.providerChargeId}</td>
                        <td className="px-6 py-4 text-gray-600 uppercase">{p.provider}</td>
                        <td className="px-6 py-4 font-medium">₦{parseFloat(p.amount).toLocaleString()}</td>
                        <td className="px-6 py-4">
                            <span
                                className={`px-2 py-0.5 rounded text-xs font-medium ${p.status === "SUCCESS"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {p.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function DeliveriesTable({ data }: { data: any[] }) {
    if (!data || !data.length)
        return <div className="p-8 text-center text-gray-400">No deliveries found.</div>;
    return (
        <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                <tr>
                    <th className="px-6 py-3 font-medium">Order</th>
                    <th className="px-6 py-3 font-medium">Carrier</th>
                    <th className="px-6 py-3 font-medium">Rider</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {data.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono font-medium">#{d.orderId}</td>
                        <td className="px-6 py-4 text-gray-600 uppercase">{d.carrier}</td>
                        <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{d.rider || "Unassigned"}</div>
                            <div className="text-xs text-gray-500">{d.riderPhone}</div>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-gray-500">{d.status}</td>
                        <td className="px-6 py-4 text-gray-500">{new Date(d.createdAt).toLocaleDateString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function AuditTable({ data }: { data: any[] }) {
    if (!data || !data.length)
        return <div className="p-8 text-center text-gray-400">No audit logs.</div>;
    return (
        <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                <tr>
                    <th className="px-6 py-3 font-medium">Action</th>
                    <th className="px-6 py-3 font-medium">Actor</th>
                    <th className="px-6 py-3 font-medium">Reason</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {data.map((l) => (
                    <tr key={l.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{l.action}</td>
                        <td className="px-6 py-4 text-gray-600">{l.actorLabel}</td>
                        <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">{l.reason || "—"}</td>
                        <td className="px-6 py-4 text-gray-500">{new Date(l.createdAt).toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
