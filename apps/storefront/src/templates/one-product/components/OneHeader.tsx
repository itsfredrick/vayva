import React from 'react';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface OneHeaderProps {
    storeName?: string;
}

export const OneHeader = ({ storeName }: OneHeaderProps) => {
    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="font-black text-xl tracking-tighter text-gray-900">
                    {storeName || 'VAYVA'}
                </Link>

                <div className="flex items-center gap-4">
                    <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block">Features</a>
                    <a href="#reviews" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block">Reviews</a>
                    <a href="#faq" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block">FAQ</a>

                    <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-full text-xs font-bold transition-colors">
                        <ShoppingBag size={14} />
                        <span className="hidden sm:inline">Track Order</span>
                    </button>

                    <button className="bg-[#111827] text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-black transition-colors md:hidden">
                        Buy Now
                    </button>
                </div>
            </div>
        </header>
    );
};
