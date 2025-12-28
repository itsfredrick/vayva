import React from 'react';
import { MapPin, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export const ChopnowHeader = () => {
    const { cart } = useStore();
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
                {/* Delivery Selector */}
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Delivering to</span>
                    <button className="flex items-center gap-1 text-red-600 font-bold text-sm">
                        <MapPin size={14} />
                        <span className="truncate max-w-[150px]">Lekki Phase 1, Lagos</span>
                        <span className="text-xs text-gray-400">▼</span>
                    </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Link href="/cart" className="relative p-2 text-gray-700 hover:text-red-600">
                        <ShoppingBag size={24} />
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-0 bg-red-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Delivery/Pickup Toggle */}
            <div className="border-t border-gray-100 flex text-sm font-bold text-center">
                <button className="flex-1 py-3 text-red-600 border-b-2 border-red-600 bg-red-50">Delivery</button>
                <button className="flex-1 py-3 text-gray-400 hover:text-gray-600">Pickup</button>
            </div>
        </header>
    );
};
