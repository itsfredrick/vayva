'use client';

import React, { useState } from 'react';
import { Button, Icon, cn, Input } from '@vayva/ui';
import { useOnboarding } from '@/context/OnboardingContext';

// Master Prompt Step 8: Delivery (Expanded)
// Logic Branching: Pickup hides delivery stages
// Timeline Editor: Rename/Reorder stages
// Proof Preview: Signature/Photo simulation

type DeliveryPolicy = 'required' | 'sometimes' | 'pickup_only';
interface DeliveryStage { id: string; label: string; visibleToCustomer: boolean; }

export default function DeliveryPage() {
    const { state, updateState, goToStep } = useOnboarding();
    const userPlan = state?.plan || 'free';
    const isPro = userPlan === 'pro';

    const [policy, setPolicy] = useState<DeliveryPolicy>('required');
    const [proof, setProof] = useState(false);

    const [stages, setStages] = useState<DeliveryStage[]>([
        { id: 'prep', label: 'Preparing', visibleToCustomer: true },
        { id: 'out', label: 'Out for delivery', visibleToCustomer: true },
        { id: 'delivered', label: 'Delivered', visibleToCustomer: true },
    ]);
    const [pickupAddress, setPickupAddress] = useState('');
    const [provider, setProvider] = useState('manual');
    const [sla, setSla] = useState('24 hours');

    const handleContinue = async () => {
        await updateState({
            delivery: {
                policy: policy,
                stages: policy !== 'pickup_only' ? stages.map(s => s.label) : ['Ready for Pickup'],
                proofRequired: proof,
                pickupAddress: policy !== 'required' ? pickupAddress : undefined,
                defaultProvider: policy !== 'pickup_only' ? provider : undefined,
                slaExpectation: policy !== 'pickup_only' ? sla : undefined
            }
        });
        await goToStep('team');
    };

    return (
        <div className="flex flex-col lg:flex-row h-full gap-8 max-w-6xl mx-auto items-start">
            <div className="flex-1 w-full max-w-lg lg:pt-10">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Delivery Settings</h1>
                    <p className="text-gray-500">Do you deliver to customers?</p>
                </div>

                <div className="space-y-4 mb-8">
                    {[
                        { id: 'required', label: 'Yes, delivery is required', desc: 'Customers must enter address', icon: 'Truck' },
                        { id: 'sometimes', label: 'Yes, but pickup available', desc: 'Customer chooses delivery or pickup', icon: 'Warehouse' },
                        { id: 'pickup_only', label: 'No, pickup only', desc: 'Physical location or services', icon: 'Store' },
                    ].map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => setPolicy(opt.id as DeliveryPolicy)}
                            className={cn(
                                "w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4",
                                policy === opt.id
                                    ? "border-black bg-gray-50 ring-1 ring-black/5"
                                    : "border-gray-200 bg-white hover:border-gray-300"
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                policy === opt.id ? "bg-black text-white" : "bg-gray-100 text-gray-500"
                            )}>
                                <Icon name={opt.icon as any} size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{opt.label}</h3>
                                <p className="text-xs text-gray-500">{opt.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Branching Logic: Only show timeline config if not pickup only */}
                {policy !== 'pickup_only' && (
                    <div className="space-y-6 animate-in slide-in-from-top-4 fade-in">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-gray-900 text-sm">Delivery Stages</h4>
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Customer View</span>
                            </div>

                            <div className="space-y-2">
                                {stages.map((stage, idx) => (
                                    <div key={stage.id} className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg">
                                        <span className="text-gray-400 text-xs font-mono w-4">{idx + 1}</span>
                                        <input
                                            value={stage.label}
                                            onChange={(e) => {
                                                const newStages = [...stages];
                                                newStages[idx].label = e.target.value;
                                                setStages(newStages);
                                            }}
                                            className="flex-1 text-sm font-medium outline-none"
                                        />
                                        <button
                                            onClick={() => {
                                                const newStages = [...stages];
                                                newStages[idx].visibleToCustomer = !newStages[idx].visibleToCustomer;
                                                setStages(newStages);
                                            }}
                                            className={cn(
                                                "p-1.5 rounded hover:bg-gray-100 transition-colors",
                                                stage.visibleToCustomer ? "text-green-600" : "text-gray-300"
                                            )}
                                        >
                                            <Icon name={stage.visibleToCustomer ? "Eye" : "EyeOff"} size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={cn("p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between", !isPro && "opacity-75")}>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-gray-900 text-sm">Require proof of delivery</h4>
                                    {!isPro && <Icon name="Lock" size={12} className="text-gray-400" />}
                                </div>
                                <p className="text-xs text-gray-500">Riders must upload photo/signature.</p>
                            </div>
                            <button
                                onClick={() => isPro && setProof(!proof)}
                                disabled={!isPro}
                                className={cn(
                                    "w-11 h-6 rounded-full relative transition-colors duration-200 ease-in-out border-2 cursor-pointer",
                                    proof ? "bg-black border-black" : "bg-gray-200 border-transparent",
                                    !isPro && "cursor-not-allowed bg-gray-100"
                                )}
                            >
                                <span className={cn(
                                    "block w-4 h-4 rounded-full bg-white shadow transform transition duration-200 ease-in-out translate-y-0.5 ml-0.5",
                                    proof ? "translate-x-5" : "translate-x-0"
                                )} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Logistics Details */}
                <div className="space-y-6 mt-8">
                    {policy !== 'required' && (
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">Pickup Address</label>
                            <input
                                placeholder="e.g. 123 Main St, Ikeja"
                                value={pickupAddress}
                                onChange={(e) => setPickupAddress(e.target.value)}
                                className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-black transition-all"
                            />
                        </div>
                    )}

                    {policy !== 'pickup_only' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900">Delivery Provider</label>
                                <select
                                    value={provider}
                                    onChange={(e) => setProvider(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-black bg-white"
                                >
                                    <option value="manual">Self / Manual</option>
                                    <option value="gokada">Gokada</option>
                                    <option value="kwik">Kwik</option>
                                    <option value="fe">Fez Delivery</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900">Est. Delivery SLA</label>
                                <input
                                    placeholder="e.g. 24 hours"
                                    value={sla}
                                    onChange={(e) => setSla(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-black transition-all"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8">
                    <Button
                        onClick={handleContinue}
                        className="!bg-black text-white h-12 px-8 rounded-xl text-base shadow-lg hover:shadow-xl transition-all w-full md:w-auto"
                    >
                        Continue
                    </Button>
                </div>
            </div>

            {/* Timeline Preview */}
            <div className="hidden lg:block flex-1 w-full sticky top-24">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 min-h-[500px] flex flex-col">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Customer Tracking View</h3>

                    <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                        {/* Static Start */}
                        <div className="relative">
                            <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-green-500 border-4 border-white shadow-sm z-10 box-content"></div>
                            <h4 className="font-bold text-gray-900 mb-1">Order Placed</h4>
                            <p className="text-xs text-gray-500">10:30 AM</p>
                        </div>

                        {/* Dynamic Stages */}
                        {policy !== 'pickup_only' ? stages.filter(s => s.visibleToCustomer).map((stage, idx) => (
                            <div key={idx} className="relative">
                                <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-gray-200 border-4 border-white z-10 box-content"></div>
                                <h4 className="font-bold text-gray-900 mb-1">{stage.label}</h4>
                                <p className="text-xs text-gray-400">Estimated...</p>
                            </div>
                        )) : (
                            <div className="relative">
                                <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-blue-500 border-4 border-white z-10 box-content"></div>
                                <h4 className="font-bold text-gray-900 mb-1">Ready for Pickup</h4>
                                <p className="text-xs text-gray-500">Visit store to collect</p>
                            </div>
                        )}
                    </div>

                    {/* Proof Simulation */}
                    {proof && policy !== 'pickup_only' && (
                        <div className="mt-auto bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Proof of Delivery</h4>
                            <div className="flex gap-2">
                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-[10px]">Photo</div>
                                <div className="w-16 h-16 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 font-script italic">Sign</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
