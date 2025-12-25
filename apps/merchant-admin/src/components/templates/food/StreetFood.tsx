import { TemplateProps } from '@/components/templates/registry';
import { useStore } from '@/context/StoreContext';
import { Icon } from '@vayva/ui';

export const StreetFoodTemplate: React.FC<TemplateProps> = ({ businessName, demoMode }) => {
    const { products, addToCart, cartTotal, itemCount, checkout, isCheckoutProcessing, currency } = useStore();

    // Demo Data Override for Street Food
    const foodItems = demoMode ? [
        { id: 'sf_1', name: 'Beef Suya', price: 1500, type: 'food', detail: 'Per Stick', isSpicy: true },
        { id: 'sf_2', name: 'Chicken Suya', price: 2000, type: 'food', detail: 'Per Stick', isSpicy: true },
        { id: 'sf_3', name: 'Massive Platter', price: 15000, type: 'food', detail: 'Feeds 4 People', isSpicy: true },
        { id: 'sf_4', name: 'Masa (Rice Cake)', price: 200, type: 'food', detail: 'Per Piece', isSpicy: false }
    ] : products.filter(p => p.type === 'food').map(p => ({
        ...p,
        detail: p.category || 'Delicious',
        isSpicy: !!p.isTodaysSpecial
    }));

    return (
        <div className="font-sans min-h-screen bg-yellow-400 text-black pb-24">
            {/* Super Bold Header */}
            <header className="px-4 py-4 bg-black text-yellow-400 border-b-4 border-white flex justify-between items-center sticky top-0 z-50 shadow-xl">
                <div className="font-heading font-black text-xl uppercase tracking-tighter transform -rotate-1 truncate max-w-[200px]">{businessName || "YAHAYA SUYA"}</div>
                <div className="flex items-center gap-4">
                    {itemCount > 0 && (
                        <div className="bg-white text-black px-3 py-1 font-bold text-sm border-2 border-black transform rotate-2">
                            {currency} {cartTotal.toLocaleString()} ({itemCount})
                        </div>
                    )}
                    <div className="bg-green-600 text-white px-3 py-1 font-bold text-xs uppercase tracking-widest animate-pulse border-2 border-white">Open</div>
                </div>
            </header>

            {/* Hero / CTA */}
            <div className="bg-yellow-400 p-6 text-center border-b-4 border-black">
                <h1 className="text-4xl font-black uppercase leading-none mb-4 transform -rotate-1">Best Suya In<br />Lagos!</h1>
                <p className="font-bold text-lg mb-6 border-2 border-black inline-block px-4 py-1 bg-white transform rotate-1">🌶️ Spicy Level: 100%</p>

                {/* WhatsApp Checkout Button (Floating or Hero) */}
                <div className="flex justify-center">
                    <button
                        onClick={() => checkout('whatsapp')}
                        disabled={isCheckoutProcessing || itemCount === 0}
                        className="bg-green-600 text-white px-6 py-4 font-bold uppercase tracking-wide border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-green-700 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Icon name="MessageCircle" size={24} />
                        {itemCount === 0 ? "Add Items to Order" : `Order on WhatsApp`}
                    </button>
                </div>
            </div>

            {/* Menu List - Simple & Bold */}
            <div className="p-4 space-y-4 max-w-md mx-auto">
                {foodItems.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => addToCart({ ...item, quantity: 1, productId: item.id })}
                        className="bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer flex justify-between items-center group active:bg-gray-50"
                    >
                        <div>
                            <h3 className="font-black text-xl uppercase italic group-hover:underline">{item.name}</h3>
                            <p className="font-bold text-gray-500 text-sm">{item.detail || 'Delicious'}</p>
                        </div>
                        <div className="text-right">
                            <div className="font-black text-2xl">{currency} {item.price.toLocaleString()}</div>
                            <button className="bg-black text-white text-[10px] font-bold uppercase px-2 py-1 mt-1">Add +</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Speed Footer */}
            <div className="p-4 text-center font-bold mt-8 pb-12 opacity-60">
                <p>📍 14, Admiralty Way, Lekki</p>
                <p>🚚 We deliver in 45 mins!</p>
            </div>

            {/* Mobile Bottom Bar if items in cart */}
            {itemCount > 0 && (
                <div className="fixed bottom-4 left-4 right-4 z-40">
                    <button
                        onClick={() => checkout('whatsapp')}
                        className="w-full bg-black text-yellow-400 py-4 font-black text-xl uppercase tracking-widest border-4 border-white shadow-xl flex justify-center items-center gap-2"
                    >
                        Place Order <span className="bg-white text-black px-2 text-sm rounded">{currency} {cartTotal.toLocaleString()}</span>
                    </button>
                </div>
            )}
        </div>
    );
};
