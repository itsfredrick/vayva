
import React from 'react';
import { Integration } from '@vayva/shared';
import { Icon, Button, cn } from '@vayva/ui';

interface IntegrationsListProps {
    integrations: Integration[];
}

export const IntegrationsList = ({ integrations }: IntegrationsListProps) => {
    return (
        <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Integrations</h2>
                    <p className="text-sm text-gray-500">Connect tools that power your business.</p>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600">Browse Directory</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.map((integration) => (
                    <div key={integration.id} className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col h-full hover:border-gray-300 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                {/* Use Icon name from data as dynamic lookup if possible, or fallback */}
                                <Icon name={integration.logoUrl as any || "Puzzle"} size={24} className="text-gray-700" />
                            </div>
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full",
                                integration.status === 'connected' ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                            )}>
                                {integration.status === 'connected' ? 'Active' : 'Not Connected'}
                            </span>
                        </div>

                        <div className="flex-1 mb-6">
                            <h4 className="font-bold text-gray-900 mb-1">{integration.name}</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">{integration.description}</p>
                        </div>

                        <a
                            href={integration.id === 'kwik' ? '/admin/control-center/delivery' : '/admin/settings/billing'}
                            className={cn(
                                "w-full flex items-center justify-between group px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                                integration.status === 'connected'
                                    ? "border-gray-200 text-gray-700 hover:bg-gray-50"
                                    : "bg-black text-white hover:bg-gray-800 border-transparent"
                            )}
                        >
                            {integration.status === 'connected' ? 'Manage Settings' : 'Connect'}
                            <Icon
                                name={integration.status === 'connected' ? "Settings" : "ArrowRight"}
                                size={16}
                                className={cn(integration.status !== 'connected' && "group-hover:translate-x-1 transition-transform")}
                            />
                        </a>
                    </div>
                ))}
            </div>
        </section>
    );
};
