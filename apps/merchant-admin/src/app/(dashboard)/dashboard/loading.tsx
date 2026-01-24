import Image from "next/image";

export default function Loading() {
    return (
        <div className="p-6 space-y-8">
            {/* Header Placeholder */}
            <div className="flex items-center justify-between mb-8 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-48"></div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>

            {/* Stat Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i: any) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-32 flex flex-col justify-between animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((j: any) => (
                            <div key={j} className="h-12 bg-gray-100 rounded-lg w-full"></div>
                        ))}
                    </div>
                </div>

                {/* Product Summary Card */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-24 mb-6"></div>
                    <div className="h-48 bg-gray-100 rounded-lg w-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
            </div>

            {/* Branding Overlay */}
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                <div className="relative w-20 h-20 animate-pulse opacity-20">
                    <Image src="/vayva-logo.png" alt="Loading..." fill className="object-contain" />
                </div>
            </div>
        </div>
    );
}
