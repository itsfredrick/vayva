import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Paperclip, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@vayva/ui'; // Assuming availability, else use HTML/Tailwind

export default function DisputeDetailPage({ params }: { params: { id: string } }) {
    // Mock Dispute Data
    const dispute = {
        id: params.id,
        orderId: 'ORD-1234-5678',
        amount: '₦45,000.00',
        reason: 'Item not as described',
        status: 'Open',
        createdAt: '2024-03-20T10:30:00Z',
        merchant: { name: 'Gadget World', id: 'm_123' },
        customer: { name: 'John Doe', email: 'john@example.com' },
        timeline: [
            { id: 1, event: 'Dispute Created', by: 'Customer', time: '2024-03-20 10:30' },
            { id: 2, event: 'Evidence Requested', by: 'System', time: '2024-03-20 10:35' },
        ]
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/ops/disputes" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dispute {dispute.id}</h1>
                    <p className="text-sm text-gray-500">Order #{dispute.orderId} • Created {dispute.timeline[0].time}</p>
                </div>
                <div className="ml-auto flex gap-3">
                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700">
                        Mark In Review
                    </button>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 shadow-sm">
                        Resolve Dispute
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card p-6 space-y-4">
                        <h3 className="font-semibold text-lg border-b border-gray-100 pb-2">Dispute Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <label className="text-muted-foreground block mb-1">Reason</label>
                                <div className="font-medium">{dispute.reason}</div>
                            </div>
                            <div>
                                <label className="text-muted-foreground block mb-1">Amount</label>
                                <div className="font-medium">{dispute.amount}</div>
                            </div>
                            <div>
                                <label className="text-muted-foreground block mb-1">Customer</label>
                                <div className="font-medium">{dispute.customer.name}</div>
                            </div>
                            <div>
                                <label className="text-muted-foreground block mb-1">Merchant</label>
                                <Link href={`/ops/merchants/${dispute.merchant.id}`} className="font-medium text-primary hover:underline">
                                    {dispute.merchant.name}
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Evidence Mock */}
                    <div className="glass-card p-6">
                        <h3 className="font-semibold text-lg border-b border-gray-100 pb-2 mb-4">Evidence & Attachments</h3>
                        <div className="flex items-center gap-4 text-sm p-3 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            <Paperclip className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">No evidence uploaded yet.</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Timeline */}
                <div className="space-y-6">
                    <div className="glass-card p-6">
                        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Timeline</h3>
                        <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-gray-100">
                            {dispute.timeline.map((event) => (
                                <div key={event.id} className="relative pl-8">
                                    <div className="absolute left-0 top-1 w-4 h-4 bg-white border-2 border-primary rounded-full z-10" />
                                    <p className="text-sm font-medium">{event.event}</p>
                                    <p className="text-xs text-muted-foreground">{event.by} • {event.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-6 bg-blue-50/50 border-blue-100">
                        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> Internal Notes
                        </h4>
                        <textarea
                            className="w-full text-sm p-3 rounded-md border-blue-200 focus:ring-2 focus:ring-blue-500/20 min-h-[100px]"
                            placeholder="Add internal note..."
                        />
                        <button className="mt-2 text-xs font-medium text-blue-700 hover:text-blue-900">Save Note</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
