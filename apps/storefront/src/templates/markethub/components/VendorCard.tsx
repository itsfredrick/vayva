import React from 'react';
import { BadgeCheck, Star } from 'lucide-react';

interface VendorDetails {
    id: string;
    name: string;
    rating: number;
    isVerified: boolean;
    logo: string;
}

interface VendorCardProps {
    vendor: VendorDetails;
}

export const VendorCard = ({ vendor }: VendorCardProps) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group">
            <img src={vendor.logo} alt={vendor.name} className="w-12 h-12 rounded-full bg-gray-100 object-cover" />

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                    <h3 className="font-bold text-gray-900 truncate group-hover:text-[#10B981] transition-colors">{vendor.name}</h3>
                    {vendor.isVerified && (
                        <BadgeCheck size={14} className="text-blue-500" />
                    )}
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <Star size={12} className="text-yellow-400 fill-current" />
                    <span>{vendor.rating}</span>
                    <span className="text-gray-300">•</span>
                    <span>Following</span>
                </div>
            </div>

            <button className="text-xs font-bold text-[#10B981] bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
                Visit
            </button>
        </div>
    );
};
