import { TemplateProps } from '@/components/templates/registry';
import { useStore } from '@/context/StoreContext';
import { Icon } from '@vayva/ui';

export const SoloProfessionalTemplate: React.FC<TemplateProps> = ({ businessName, demoMode }) => {
    const { products, addToCart, cartTotal, itemCount, checkout, isCheckoutProcessing, currency } = useStore();

    // Demo Data Override for Solo Professional
    const serviceItems = demoMode ? [
        {
            id: 'svc_1',
            name: 'Full Bridal Glam',
            price: 150000,
            type: 'service',
            duration: '3 hrs',
            desc: 'Complete consultation, trial session, and wedding day makeup.'
        },
        {
            id: 'svc_2',
            name: 'Photoshoot/Editorial',
            price: 45000,
            type: 'service',
            duration: '2 hrs',
            desc: 'High definition makeup for studio lighting.'
        },
        {
            id: 'svc_3',
            name: 'Gele Tying',
            price: 5000,
            type: 'service',
            duration: '30 mins',
            desc: 'Expert gele styling (Avant-garde or Traditional).'
        },
        {
            id: 'svc_4',
            name: 'Home Service Haircut',
            price: 15000,
            type: 'service',
            duration: '1 hr',
            desc: 'Premium haircut at your convenience.'
        }
    ] : products.filter(p => p.type === 'service').map(p => ({
        ...p,
        desc: p.description,
        duration: (p as any).durationMinutes ? `${(p as any).durationMinutes} mins` : '1 hr'
    }));

    return (
        <div className="font-sans min-h-screen bg-neutral-50 text-neutral-900 pb-20">
            {/* Minimal Avatar Header */}
            <div className="py-12 px-4 text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-neutral-200 overflow-hidden mb-4 ring-4 ring-white shadow-lg">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" alt="Professional" className="w-full h-full object-cover" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight mb-2">{businessName || "Sarah Adebayo"}</h1>
                <p className="text-neutral-500 text-sm max-w-xs mx-auto mb-6">Professional Makeup Artist & Beauty Consultant based in Lekki Phase 1.</p>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                        Book Appointment
                    </button>
                    <button className="bg-white text-black border border-neutral-200 px-4 py-2.5 rounded-full w-10 h-10 flex items-center justify-center hover:bg-neutral-50">
                        <Icon name="MessageCircle" size={16} />
                    </button>
                </div>
            </div>

            {/* Service List */}
            <div id="services" className="bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] min-h-screen p-6 space-y-8">
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6">Services</h2>
                    <div className="space-y-6">
                        {serviceItems.map((item) => (
                            <div key={item.id} className="flex justify-between items-start group cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors" onClick={() => addToCart({ ...item, quantity: 1, productId: item.id })}>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-lg group-hover:text-neutral-600 transition-colors">{item.name}</h3>
                                    <p className="text-sm text-neutral-500 leading-relaxed max-w-[200px]">{item.desc}</p>
                                    {(item as any).duration && (
                                        <div className="text-xs font-medium text-neutral-400 bg-neutral-100 inline-block px-2 py-0.5 rounded">{(item as any).duration}</div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <div className="font-bold">{currency} {item.price.toLocaleString()}</div>
                                    <button className="text-[10px] font-bold uppercase border-b border-black pb-0.5 mt-2 hover:opacity-50">Book</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">Portfolio</h2>
                    <div className="grid grid-cols-2 gap-2">
                        <img src="https://images.unsplash.com/photo-1487412947132-232a8b71a0d1?w=400&q=80" className="rounded-2xl w-full h-40 object-cover" />
                        <img src="https://images.unsplash.com/photo-1522336572468-97b06e8ef143?w=400&q=80" className="rounded-2xl w-full h-40 object-cover translate-y-4" />
                        <img src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80" className="rounded-2xl w-full h-40 object-cover" />
                        <img src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&q=80" className="rounded-2xl w-full h-40 object-cover translate-y-4" />
                    </div>
                </section>
            </div>

            {/* Sticky Booking Footer */}
            {itemCount > 0 && (
                <div className="fixed bottom-6 left-6 right-6">
                    <button
                        onClick={() => checkout('whatsapp')}
                        className="w-full bg-black text-white py-4 rounded-full font-bold shadow-2xl shadow-neutral-500/30 flex items-center justify-between px-8"
                    >
                        <span>{itemCount} Service{itemCount > 1 ? 's' : ''}</span>
                        <span>Confirm Booking <Icon name="ArrowRight" size={16} className="inline ml-1" /></span>
                    </button>
                </div>
            )}
        </div>
    );
};
