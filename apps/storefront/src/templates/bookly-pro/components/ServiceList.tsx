import React from 'react';
import { Clock, Check } from 'lucide-react';
import { PublicProduct } from '@/types/storefront';

interface ServiceListProps {
    services: PublicProduct[];
    onBook: (service: PublicProduct) => void;
}

export const ServiceList = ({ services, onBook }: ServiceListProps) => {
    return (
        <section className="max-w-4xl mx-auto py-16 px-6" id="services">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Select a Service</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => (
                    <div key={service.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-xl text-gray-900">{service.name}</h3>
                                <span className="font-bold text-lg text-blue-600">
                                    ₦{service.price.toLocaleString()}
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                                {service.description}
                            </p>

                            {/* Service Details Badges */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {service.serviceDetails?.duration && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full">
                                        <Clock size={14} />
                                        {service.serviceDetails.duration} mins
                                    </span>
                                )}
                                {service.serviceDetails?.hasDeposit && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                                        <Check size={14} />
                                        Deposit Required
                                    </span>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => onBook(service)}
                            className="w-full bg-white border-2 border-gray-900 text-gray-900 py-3 rounded-lg font-bold hover:bg-gray-900 hover:text-white transition-all text-sm uppercase tracking-wide"
                        >
                            Book Appointment
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};
