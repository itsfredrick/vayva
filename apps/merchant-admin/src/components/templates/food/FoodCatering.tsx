import { TemplateProps } from '@/components/templates/registry';
import { useStore } from '@/context/StoreContext';
import { Icon } from '@vayva/ui';

export const FoodCateringTemplate: React.FC<TemplateProps> = ({ businessName, demoMode }) => {
    const { products, addToCart, cartTotal, itemCount, isCartOpen, toggleCart, checkout, isCheckoutProcessing, currency } = useStore();

    // Demo Data Override for Food Catering
    const cateringItems = demoMode ? [
        { id: 'cat_1', name: 'Jollof Rice', price: 2500, type: 'food', desc: 'Smokey party jollof with plaintain', time: '15m' },
        { id: 'cat_2', name: 'Fried Rice', price: 2800, type: 'food', desc: 'Rich nigerian fried rice', time: '15m' },
        { id: 'cat_3', name: 'Chicken', price: 1200, type: 'food', desc: 'Peppered or Fried', time: '10m' },
        { id: 'cat_4', name: 'Extra Beef', price: 1500, type: 'food', desc: 'Tender spicy beef', time: '10m' }
    ] : products.filter(p => p.type === 'food').map(p => ({
        ...p,
        desc: p.description,
        time: (p as any).prepTimeMinutes ? `${(p as any).prepTimeMinutes}m` : '15m'
    }));

    return (
        <div className="font-sans min-h-screen bg-orange-50/30 text-gray-900 pb-24">
            {/* Appetite Header */}
            <header className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm border-b border-orange-100/50">
                <div className="font-heading font-black text-xl tracking-tight text-orange-600 truncate max-w-[200px]">{businessName || "Mama's Kitchen"}</div>
                <div className="flex items-center gap-4">
                    {itemCount > 0 && (
                        <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-bold" onClick={() => toggleCart()}>
                            {currency} {cartTotal.toLocaleString()}
                        </div>
                    )}
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Open
                    </div>
                </div>
            </header>

            {/* Cart Drawer Overlay */}
            {isCartOpen && (
                <div className="fixed inset-0 z-[100] bg-black/50 flex justify-end">
                    <div className="w-full max-w-sm bg-white h-full p-6 flex flex-col animate-in slide-in-from-right">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Your Order</h2>
                            <button onClick={() => toggleCart(false)}><Icon name="X" size={24} /></button>
                        </div>
                        <div className="flex-1 overflow-auto space-y-4">
                            {itemCount === 0 ? <p className="text-gray-500 text-center py-10">Add some food first!</p> : (
                                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-gray-700">{itemCount} items</span>
                                        <span className="font-bold text-xl">{currency} {cartTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="grid gap-3 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => checkout('website')}
                                disabled={isCheckoutProcessing || itemCount === 0}
                                className="w-full bg-orange-600 text-white py-3.5 rounded-xl font-bold hover:bg-orange-700 disabled:opacity-50"
                            >
                                Pay Now
                            </button>
                            <button
                                onClick={() => checkout('whatsapp')}
                                disabled={isCheckoutProcessing || itemCount === 0}
                                className="w-full bg-white text-green-600 border-2 border-green-600 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-50 disabled:opacity-50"
                            >
                                <Icon name="MessageCircle" size={20} /> Or Order on WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Visual Menu Categories */}
            <div className="px-4 py-4 overflow-x-auto scrollbar-hide">
                <div className="flex gap-4 min-w-max">
                    {[
                        { name: "Rice & Specials", icon: "🍛" },
                        { name: "Soups & Swallow", icon: "🥣" },
                        { name: "Grills & Sides", icon: "🍖" },
                        { name: "Drinks", icon: "🥤" },
                    ].map((cat, i) => (
                        <div key={i} className={`flex flex-col items-center gap-2 ${i === 0 ? 'opacity-100' : 'opacity-60 grayscale'}`}>
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${i === 0 ? 'bg-orange-500 text-white shadow-orange-200' : 'bg-white'}`}>
                                {cat.icon}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider">{cat.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Menu Grid */}
            <section className="px-4 mt-4">
                <h2 className="font-bold text-lg mb-4">Popular Favorites</h2>
                <div className="space-y-6">
                    {cateringItems.map((item) => (
                        <div key={item.id} className="flex gap-4 group cursor-pointer" onClick={() => addToCart({ ...item, quantity: 1, productId: item.id })}>
                            <div className="w-28 h-28 bg-gray-100 rounded-xl overflow-hidden shrink-0 relative">
                                <img src={'https://placehold.co/400x400/fff7ed/ea580c?text=' + item.name.split(' ')[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute bottom-1 right-1 bg-white/90 backdrop-blur px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5">
                                    <Icon name="Clock" size={12} className="text-orange-500" />
                                    {item.time || '15m'}
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-base leading-tight mb-1">{item.name}</h3>
                                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{item.desc}</p>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="font-bold text-orange-600">{currency} {item.price.toLocaleString()}</span>
                                    <button className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200">
                                        <Icon name="Plus" size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Cart Floating Action Button - Only if items exist and cart closed */}
            {!isCartOpen && itemCount > 0 && (
                <div className="fixed bottom-6 inset-x-4 z-40">
                    <button
                        onClick={() => toggleCart(true)}
                        className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-between px-6 shadow-xl shadow-orange-900/10 active:scale-95 transition-transform"
                    >
                        <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">{itemCount}</span>
                        <span>View Order</span>
                        <span>{currency} {cartTotal.toLocaleString()}</span>
                    </button>
                </div>
            )}
        </div>
    );
};
