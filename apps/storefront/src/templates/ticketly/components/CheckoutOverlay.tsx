import React, { useState } from 'react';
import { X, ArrowRight, Lock } from 'lucide-react';

interface CheckoutOverlayProps {
    total: number;
    count: number;
    onClose: () => void;
    onComplete: (attendee: { name: string; email: string }) => void;
}

export const CheckoutOverlay = ({ total, count, onClose, onComplete }: CheckoutOverlayProps) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
            onComplete({ name, email });
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-lg">Checkout</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
                    <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Tickets</span>
                            <span className="font-bold">{count}x</span>
                        </div>
                        <div className="flex justify-between text-lg font-black pt-2 border-t border-gray-200">
                            <span>Total</span>
                            <span className="text-purple-600">₦{total.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                            <input
                                required
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                placeholder="E.g. John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                placeholder="john@example.com"
                            />
                            <p className="text-xs text-gray-500 mt-1">Tickets will be sent here.</p>
                        </div>
                    </div>
                </form>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleSubmit}
                        disabled={isProcessing}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-70 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                        {isProcessing ? 'Processing...' : (
                            <>Pay ₦{total.toLocaleString()} <ArrowRight size={18} /></>
                        )}
                    </button>
                    <div className="flex justify-center items-center gap-2 mt-3 text-xs text-gray-400">
                        <Lock size={10} /> Secured by Vayva Pay
                    </div>
                </div>
            </div>
        </div>
    );
};
