import React from "react";
import { TemplateProps } from "@/components/templates/registry";
import { useStore } from "@/context/StoreContext";
import { Icon, Button } from "@vayva/ui";

export const HotelBookingTemplate: React.FC<TemplateProps> = ({
    businessName,
    demoMode,
}) => {
    const {
        products,
        addToCart,
        currency,
    } = useStore();

    const stayItems = demoMode
        ? [
            {
                id: "st_1",
                name: "Deluxe King Room",
                price: 45000,
                type: "hotel",
                stay: { maxGuests: 2, roomType: "Deluxe", amenities: ["WiFi", "AC", "Breakfast"] },
                image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
            },
            {
                id: "st_2",
                name: "Executive Suite",
                price: 85000,
                type: "hotel",
                stay: { maxGuests: 3, roomType: "Suite", amenities: ["WiFi", "Jacuzzi", "Mini Bar"] },
                image: "https://images.unsplash.com/photo-1582719478250-c89cae4df85b?w=800&q=80",
            },
            {
                id: "st_3",
                name: "Family Standard",
                price: 35000,
                type: "hotel",
                stay: { maxGuests: 4, roomType: "Standard", amenities: ["WiFi", "TV"] },
                image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
            },
        ]
        : products.filter((p) => p.type === "hotel");

    return (
        <div className="font-sans min-h-screen bg-white text-gray-900">
            {/* Premium Hero */}
            <div className="relative h-[60vh] overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80"
                    alt="Hotel Hero"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif mb-4">
                        {businessName || "Grand Vayva Resort"}
                    </h1>
                    <p className="text-lg md:text-xl opacity-90 max-w-2xl font-light">
                        Experience world-class luxury and comfort in the heart of the city.
                    </p>
                </div>
            </div>

            {/* Booking Section */}
            <main className="container mx-auto px-4 -mt-10 relative z-10 pb-20">
                <div className="bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                        <div>
                            <h2 className="text-3xl font-serif text-gray-900">Our Accommodations</h2>
                            <p className="text-gray-500">Meticulously designed rooms for your relaxation</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm font-medium border border-gray-200">
                                <Icon name="Calendar" size={16} className="text-vayva-green" />
                                <span>Check Availability</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {stayItems.map((item: any) => (
                            <div key={item.id} className="group rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all bg-white">
                                <div className="aspect-[4/3] overflow-hidden relative">
                                    <img
                                        src={item.image || (item as any).images?.[0] || ""}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm border border-gray-100">
                                        {item.stay?.roomType || "Standard"}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-serif font-bold text-gray-900">{item.name}</h3>
                                        <div className="text-right">
                                            <span className="text-sm text-gray-400 block uppercase tracking-wider">Per Night</span>
                                            <span className="text-lg font-bold text-vayva-green">{currency}{item.price.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Icon name="Users" size={14} />
                                            <span>{item.stay?.maxGuests || 2} Guests</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Icon name="Wifi" size={14} />
                                            <span>Fast WiFi</span>
                                        </div>
                                    </div>

                                    {item.stay?.amenities && (
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {item.stay.amenities.map((amenity: any) => (
                                                <span key={amenity} className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-gray-50 text-gray-400 rounded-md border border-gray-100">
                                                    {amenity}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <Button
                                        variant="outline"
                                        onClick={() => addToCart({ ...item, quantity: 1, productId: item.id })}
                                        className="w-full bg-black text-white hover:bg-gray-800 rounded-xl font-bold py-6 group-hover:bg-vayva-green transition-colors"
                                    >
                                        Book This Room
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Brand Experience */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-gray-100">
                            <Icon name="Wind" size={24} className="text-gray-900" />
                        </div>
                        <h3 className="font-serif text-xl font-bold">Pure Air</h3>
                        <p className="text-gray-500 text-sm">Every room is equipped with high-end air purification systems.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-gray-100">
                            <Icon name="ShieldCheck" size={24} className="text-gray-900" />
                        </div>
                        <h3 className="font-serif text-xl font-bold">Privacy First</h3>
                        <p className="text-gray-500 text-sm">Discreet service and soundproof walls for absolute peace of mind.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-gray-100">
                            <Icon name="Coffee" size={24} className="text-gray-900" />
                        </div>
                        <h3 className="font-serif text-xl font-bold">Artisan Food</h3>
                        <p className="text-gray-500 text-sm">Enjoy curated local delicacies delivered straight to your suite.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};
