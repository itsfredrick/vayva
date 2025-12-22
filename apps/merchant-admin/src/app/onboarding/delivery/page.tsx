'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input, Icon } from '@vayva/ui';
import { useOnboarding } from '@/context/OnboardingContext';
import { PhoneInput } from '@/components/ui/PhoneInput';

export default function DeliveryPage() {
    const { state, updateState, goToStep } = useOnboarding();

    // Default form data
    const [formData, setFormData] = useState({
        address: '',
        contactName: '',
        phone: '',
        notes: '',
    });

    // Populate from state or use identity defaults
    useEffect(() => {
        if (state?.pickupLocation) {
            setFormData({ ...state.pickupLocation, notes: state.pickupLocation.notes || '' });
        } else if (state?.identity) {
            // Pre-fill contact info from identity
            setFormData(prev => ({
                ...prev,
                contactName: state.identity?.fullName || '',
                phone: state.identity?.phone || ''
            }));
        }
    }, [state]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await updateState({
            pickupLocation: formData
        });

        await goToStep('templates');
    };

    const handleBack = () => {
        goToStep('brand');
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-black mb-2">Pickup Location</h1>
                <p className="text-gray-600">Where should customers or couriers pick up orders?</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">

                <div className="space-y-1">
                    <Input
                        label="Pickup Address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                        placeholder="e.g. 123 Market Street, Balogun Market"
                    />
                    <p className="text-xs text-gray-500">This address will be visible to customers.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Contact Name"
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        required
                        placeholder="Who to contact?"
                    />

                    <PhoneInput
                        label="Contact Phone"
                        value={formData.phone}
                        onChange={(phone) => setFormData({ ...formData, phone })}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-black">Notes / Landmark <span className="text-gray-400 font-normal">(Optional)</span></label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full min-h-[100px] rounded-xl border border-gray-200 p-3 text-sm outline-none focus:ring-2 focus:ring-black/5 focus:border-black resize-none"
                        placeholder="e.g. Opposite the yellow building, ask for Mama Nkechi"
                    />
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleBack}
                        className="flex-1 text-gray-500 hover:text-black"
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        className="flex-[2] !bg-black !text-white h-12 rounded-xl"
                        disabled={!formData.address || !formData.phone}
                    >
                        Continue
                        <Icon name="ArrowRight" className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
