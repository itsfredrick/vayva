
import React, { useState, useEffect } from 'react';
import { Drawer, Button, Icon, cn } from '@vayva/ui';
import { Customer, CustomerInsight, CustomerActivity } from '@vayva/shared';
import { WhatsAppAction } from './WhatsAppAction';

interface CustomerDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    customerId: string | null;
}

export const CustomerDrawer = ({ isOpen, onClose, customerId }: CustomerDrawerProps) => {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [insights, setInsights] = useState<CustomerInsight[]>([]);
    const [history, setHistory] = useState<CustomerActivity[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'timeline' | 'notes'>('timeline');

    useEffect(() => {
        if (isOpen && customerId) {
            fetchData();
        } else {
            setCustomer(null);
            setInsights([]);
            setHistory([]);
        }
    }, [isOpen, customerId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Parallel fetch for speed
            const [profileRes, historyRes] = await Promise.all([
                fetch(`/api/customers/${customerId}`).then(r => r.json()),
                fetch(`/api/customers/${customerId}/history`).then(r => r.json())
            ]);

            setCustomer(profileRes.profile);
            setInsights(profileRes.insights);
            setStats(profileRes.stats);
            setHistory(historyRes);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Drawer isOpen={isOpen} onClose={onClose} title={loading ? "Loading..." : "Customer Profile"}>
            {loading || !customer ? (
                <div className="h-full flex items-center justify-center">
                    <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full" />
                </div>
            ) : (
                <div className="flex flex-col h-full bg-gray-50">
                    {/* SECTION A: PROFILE HEADER */}
                    <div className="bg-white p-6 border-b border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xl font-bold text-gray-600 border border-gray-100">
                                    {customer.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
                                    <p className="text-gray-500 text-sm font-mono flex items-center gap-2">
                                        <Icon name="Phone" size={12} /> {customer.phone}
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                        {insights.some(i => i.type === 'risk') && (
                                            <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full uppercase tracking-wider">High Risk</span>
                                        )}
                                        <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            Seen {new Date(customer.lastSeenAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <WhatsAppAction
                                phone={customer.phone}
                                name={customer.name}
                                label="Message"
                                size="sm"
                            />
                        </div>

                        {/* SECTION B: SUMMARY STATS */}
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Lifetime Value</p>
                                <p className="text-lg font-bold font-mono">₦{customer.totalSpend.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Orders</p>
                                <p className="text-lg font-bold">{customer.totalOrders}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">AOV</p>
                                <p className="text-lg font-bold font-mono">₦{(stats?.aov || 0).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* SECTION: INSIGHTS SCROLL */}
                    {insights.length > 0 && (
                        <div className="bg-white p-4 border-b border-gray-200">
                            <h3 className="text-xs font-bold text-gray-900 uppercase mb-3 flex items-center gap-1">
                                <Icon name="Sparkles" size={12} className="text-amber-500" /> Smart Insights
                            </h3>
                            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                {insights.map(insight => (
                                    <div key={insight.id} className="min-w-[200px] p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                                        <div className="flex items-center gap-2 mb-1">
                                            {/* @ts-ignore */}
                                            <Icon name={insight.icon} size={14} className="text-indigo-600" />
                                            <span className="text-xs font-bold text-indigo-900">{insight.title}</span>
                                        </div>
                                        <p className="text-[10px] text-indigo-700 leading-tight">{insight.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex-1 overflow-auto p-6">
                        {/* SECTION C & D: TIMELINE */}
                        <div className="flex gap-4 border-b border-gray-200 mb-6">
                            <button
                                onClick={() => setActiveTab('timeline')}
                                className={cn("pb-2 text-sm font-bold transition-colors", activeTab === 'timeline' ? "border-b-2 border-black text-black" : "text-gray-400")}
                            >
                                History
                            </button>
                            <button
                                onClick={() => setActiveTab('notes')}
                                className={cn("pb-2 text-sm font-bold transition-colors", activeTab === 'notes' ? "border-b-2 border-black text-black" : "text-gray-400")}
                            >
                                Notes
                            </button>
                        </div>

                        {activeTab === 'timeline' && (
                            <div className="space-y-6 relative pl-4 border-l-2 border-gray-100 ml-2">
                                {history.map((item, idx) => (
                                    <div key={item.id} className="relative pl-6">
                                        <div className={cn(
                                            "absolute -left-[25px] top-0 w-8 h-8 rounded-full border-4 border-gray-50 flex items-center justify-center bg-white shadow-sm",
                                            item.type === 'order' ? "text-blue-600" :
                                                item.type === 'message' ? "text-green-600" :
                                                    "text-gray-400"
                                        )}>
                                            <Icon
                                                name={item.type === 'order' ? 'ShoppingBag' : item.type === 'message' ? 'MessageCircle' : 'FileText'}
                                                size={14}
                                            />
                                        </div>

                                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-xs font-bold uppercase text-gray-500">{item.type}</span>
                                                <span className="text-[10px] text-gray-400">{new Date(item.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="font-medium text-gray-900 text-sm">
                                                {item.description}
                                            </div>
                                            {item.amount && (
                                                <div className="mt-2 font-mono font-bold text-gray-900">
                                                    ₦{item.amount.toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'notes' && (
                            <div className="text-center py-10 text-gray-400">
                                <Icon name="FileText" size={32} className="mx-auto mb-2 opacity-20" />
                                <p className="text-sm">No internal notes yet.</p>
                                <Button size="sm" variant="outline" className="mt-4">Add Note</Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Drawer>
    );
};
