'use client';

import React, { useState } from 'react';
import { GlassPanel, Button, Icon } from '@vayva/ui';
import Link from 'next/link';

export default function DomainsPage() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="mx-auto max-w-4xl p-6">
            <Link href="/admin/control-center" className="mb-6 flex items-center text-sm text-text-secondary hover:text-white">
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Back to Control Center
            </Link>

            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="relative mb-8">
                    <div className="absolute inset-0 animate-pulse bg-primary/20 blur-xl rounded-full"></div>
                    <GlassPanel className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-black/50">
                        <Icon name="Globe" size={48} className="text-primary" />
                    </GlassPanel>
                </div>

                <h1 className="mb-4 text-3xl font-bold text-white">Custom Domains</h1>
                <p className="mb-8 max-w-lg text-text-secondary text-lg">
                    Connect your own domain (e.g., yourstore.com) to professionalize your brand.
                </p>

                <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => setShowModal(true)}
                >
                    <Icon name="Globe" size={16} />
                    Connect Domain
                </Button>

                <div className="mt-12 p-4 rounded-lg bg-white/5 border border-white/5 max-w-sm w-full">
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-text-secondary">Current Subdomain</span>
                        <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-500 text-xs font-medium">Active</span>
                    </div>
                    <div className="font-mono text-white text-lg">mystore.vayva.shop</div>
                </div>
            </div>

            {/* Domain Setup Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Domain Setup Required</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <Icon name="X" size={20} />
                            </button>
                        </div>

                        <p className="text-gray-600 mb-6">
                            Custom domain connection requires manual DNS configuration.
                            Our support team will guide you through the process.
                        </p>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-gray-900 mb-2">What you'll need:</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start gap-2">
                                    <Icon name="Check" size={16} className="text-green-600 mt-0.5 shrink-0" />
                                    <span>Access to your domain's DNS settings</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Icon name="Check" size={16} className="text-green-600 mt-0.5 shrink-0" />
                                    <span>Ability to add CNAME or TXT records</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Icon name="Check" size={16} className="text-green-600 mt-0.5 shrink-0" />
                                    <span>24-48 hours for DNS propagation</span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </Button>
                            <a
                                href="mailto:support@vayva.ng?subject=Custom Domain Setup Request"
                                className="flex-1"
                            >
                                <Button className="w-full gap-2">
                                    <Icon name="Mail" size={16} />
                                    Contact Support
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
