import { PublicOrder, PublicProduct, PublicStore } from '@/types/storefront';
import { TEMPLATE_REGISTRY } from '@/lib/templates-registry';

const API_BASE = 'http://localhost:4000/v1';

export const StorefrontService = {
    getStore: async (slug: string): Promise<PublicStore | null> => {
        try {
            // Placeholder: Normally we'd fetch /public/stores/:slug
            // For now, return mock if not found to keep UI working
            const response = await fetch(`${API_BASE}/public/stores/${slug}`);
            if (response.ok) return await response.json();

            // Fallback for Vayva A&A Fashion Demo
            if (slug === 'aa-fashion-demo' || slug === 'demo') {
                return {
                    id: 'store_aa_fashion',
                    slug: 'aa-fashion-demo',
                    name: 'A&A FASHION',
                    tagline: 'Redefining modern elegance.',
                    theme: {
                        primaryColor: '#111111',
                        accentColor: '#111111',
                        templateId: TEMPLATE_REGISTRY['vayva-aa-fashion'].templateId
                    },
                    contact: { email: 'hello@aa-fashion.store', phone: '+234 800 FASHION' },
                    policies: {
                        shipping: 'Express delivery nationwide (1-2 days).',
                        returns: 'Hassle-free returns within 14 days.',
                        privacy: 'Secure payments powered by Vayva.'
                    }
                };
            }

            // Fallback for Gizmo Tech Demo
            if (slug === 'gizmo-demo') {
                return {
                    id: 'store_gizmo_tech',
                    slug: 'gizmo-demo',
                    name: 'GIZMO TECH',
                    tagline: 'Future-ready electronics for the modern pro.',
                    theme: {
                        primaryColor: '#0B0F19',
                        accentColor: '#3B82F6',
                        templateId: TEMPLATE_REGISTRY['vayva-gizmo-tech'].templateId
                    },
                    contact: { email: 'support@gizmo.tech', phone: '+234 800 GIZMO' },
                    policies: {
                        shipping: 'Free delivery on orders over ₦50,000.',
                        returns: '30-day money back guarantee.',
                        privacy: 'Data encrypted and secure.'
                    }
                };
            }

            // Fallback for Bloome & Home Demo
            if (slug === 'bloome-demo') {
                return {
                    id: 'store_bloome_home',
                    slug: 'bloome-demo',
                    name: 'BLOOME & HOME',
                    tagline: 'Slow down your routine with natural essentials.',
                    theme: {
                        primaryColor: '#2E2E2E',
                        accentColor: '#C9B7A2',
                        templateId: TEMPLATE_REGISTRY['vayva-bloome-home'].templateId
                    },
                    contact: { email: 'care@bloome.home', phone: '+234 800 BLOOME' },
                    policies: {
                        shipping: 'Eco-friendly packaging. Delivers in 3-5 days.',
                        returns: 'Love it or return it within 30 days.',
                        privacy: 'We respect your peace and privacy.'
                    }
                };
            }

            // Fallback for Bookly Pro Demo
            if (slug === 'bookly-demo') {
                return {
                    id: 'store_bookly_pro',
                    slug: 'bookly-demo',
                    name: 'PRESTIGE BARBERS',
                    tagline: 'Sharper cuts, better confidence.',
                    theme: {
                        primaryColor: '#2563EB',
                        accentColor: '#1E40AF',
                        templateId: TEMPLATE_REGISTRY['vayva-bookly-pro'].templateId
                    },
                    contact: { email: 'book@prestige.barber', phone: '+234 800 CUTS' },
                    policies: {
                        shipping: 'No shipping. Services are performed on-site.',
                        returns: 'Cancellations allowed up to 2 hours before.',
                        privacy: 'We keep your look and data secure.'
                    }
                };
            }

            // Fallback for Chopnow Demo
            if (slug === 'chopnow-demo') {
                return {
                    id: 'store_chopnow',
                    slug: 'chopnow-demo',
                    name: 'CHOPNOW KITCHEN',
                    tagline: 'Hot. Fast. Delicious.',
                    theme: {
                        primaryColor: '#DC2626',
                        accentColor: '#F59E0B',
                        templateId: TEMPLATE_REGISTRY['vayva-chopnow'].templateId
                    },
                    contact: { email: 'orders@chopnow.kitchen', phone: '+234 800 CHOP' },
                    policies: {
                        shipping: 'Delivery in 45 mins. Pickup allowed.',
                        returns: 'No returns on food. Refunds for mistakes.',
                        privacy: 'Secure payments.'
                    }
                };
            }

            // Fallback for FileVault Demo
            if (slug === 'filevault-demo') {
                return {
                    id: 'store_filevault',
                    slug: 'filevault-demo',
                    name: 'CREATOR HUB',
                    tagline: 'Premium digital assets for modern creators.',
                    theme: {
                        primaryColor: '#6366F1',
                        accentColor: '#1F2937',
                        templateId: TEMPLATE_REGISTRY['vayva-file-vault'].templateId
                    },
                    contact: { email: 'support@creatorhub.store', phone: '' },
                    policies: {
                        shipping: 'Instant digital download via email.',
                        returns: '7-day money back guarantee if not downloaded.',
                        privacy: 'We do not sell your data.'
                    }
                };
            }

            // Fallback for Ticketly Demo
            if (slug === 'ticketly-demo') {
                return {
                    id: 'store_ticketly',
                    slug: 'ticketly-demo',
                    name: 'TECH HORIZON',
                    tagline: 'Events that shape the future.',
                    theme: {
                        primaryColor: '#7C3AED',
                        accentColor: '#F97316',
                        templateId: TEMPLATE_REGISTRY['vayva-ticketly'].templateId
                    },
                    contact: { email: 'events@techhorizon.io', phone: '+234 800 EVENT' },
                    policies: {
                        shipping: 'Tickets sent via email instantly.',
                        returns: 'Refunds allowed up to 48h before event.',
                        privacy: 'Your attendance data is private.'
                    }
                };
            }

            // Fallback for Eduflow Demo
            if (slug === 'eduflow-demo') {
                return {
                    id: 'store_eduflow',
                    slug: 'eduflow-demo',
                    name: 'CodeMastery Academy',
                    tagline: 'Learn to code. Build your future.',
                    theme: {
                        primaryColor: '#2563EB',
                        accentColor: '#22C55E',
                        templateId: TEMPLATE_REGISTRY['vayva-eduflow'].templateId
                    },
                    contact: { email: 'hello@codemastery.io', phone: '' },
                    policies: {
                        shipping: 'Instant access upon enrollment.',
                        returns: '30-day satisfaction guarantee.',
                        privacy: 'We track progress to grant certificates.'
                    }
                };
            }

            // Fallback for BulkTrade Demo
            if (slug === 'bulktrade-demo') {
                return {
                    id: 'store_bulktrade',
                    slug: 'bulktrade-demo',
                    name: 'METRO INDUSTRIES LTD',
                    tagline: 'Leading supplier of construction and industrial materials.',
                    theme: {
                        primaryColor: '#0F172A',
                        accentColor: '#2563EB',
                        templateId: TEMPLATE_REGISTRY['vayva-bulktrade'].templateId
                    },
                    contact: { email: 'sales@metro-ind.com', phone: '+234 800 BULK' },
                    policies: {
                        shipping: 'Freight shipping calculated after quote approval.',
                        returns: 'Returns accepted for damaged goods only (within 7 days).',
                        privacy: 'B2B Trade Secrets protected.'
                    }
                };
            }

            // Fallback for MarketHub Demo
            if (slug === 'markethub-demo') {
                return {
                    id: 'store_markethub',
                    slug: 'markethub-demo',
                    name: 'VAYVA MARKETPLACE',
                    tagline: 'Discover unique products from verified local sellers.',
                    theme: {
                        primaryColor: '#111827',
                        accentColor: '#10B981',
                        templateId: TEMPLATE_REGISTRY['vayva-markethub'].templateId
                    },
                    contact: { email: 'support@markethub.com', phone: '+234 800 MARKET' },
                    policies: {
                        shipping: 'Shipping rates vary by vendor.',
                        returns: 'Check individual vendor policies.',
                        privacy: 'Secure payments guaranteed.'
                    }
                };
            }

            // Fallback for GiveFlow Demo
            if (slug === 'giveflow-demo') {
                return {
                    id: 'store_giveflow',
                    slug: 'giveflow-demo',
                    name: 'VAYVA CARES',
                    tagline: 'Empowering communities through collective giving.',
                    theme: {
                        primaryColor: '#16A34A',
                        accentColor: '#2563EB',
                        templateId: TEMPLATE_REGISTRY['vayva-giveflow'].templateId
                    },
                    contact: { email: 'help@vayvacares.org', phone: '+234 800 HOPE' },
                    policies: {
                        shipping: 'N/A - This is a donation platform.',
                        returns: 'Donations are non-refundable.',
                        privacy: 'We are transparent about fund usage.'
                    }
                };
            }

            // Fallback for HomeList Demo
            if (slug === 'homelist-demo') {
                return {
                    id: 'store_homelist',
                    slug: 'homelist-demo',
                    name: 'PRIMESTATE PROPERTIES',
                    tagline: 'Premium Real Estate Listings in Nigeria.',
                    theme: {
                        primaryColor: '#0F172A',
                        accentColor: '#2563EB',
                        templateId: TEMPLATE_REGISTRY['vayva-homelist'].templateId
                    },
                    contact: { email: 'info@primestate.ng', phone: '+234 800 REALTY' },
                    policies: {
                        shipping: 'N/A',
                        returns: 'Deposits are refundable within 24 hours.',
                        privacy: 'Your contact details are shared only with listing agents.'
                    }
                };
            }

            // Fallback for OneProduct Demo
            if (slug === 'oneproduct-demo') {
                return {
                    id: 'store_oneprod',
                    slug: 'oneproduct-demo',
                    name: 'VAYVA TECH',
                    tagline: 'Smart Living Regained.',
                    theme: {
                        primaryColor: '#111827',
                        accentColor: '#16A34A',
                        templateId: TEMPLATE_REGISTRY['vayva-oneproduct'].templateId,
                        oneProductConfig: {
                            heroHeadline: 'Blend Any Fruit. Anywhere. In Seconds.',
                            subHeadline: 'The Vayva Smart Blender Pro gives you power and portability without the noise. 30-day battery life.',
                            guaranteeText: '30-Day Money Back Guarantee. 1-Year Warranty.',
                            benefits: [
                                { icon: 'battery', title: '30-Day Battery', description: 'One charge lasts a whole month of daily smoothness.' },
                                { icon: 'zap', title: 'Crushes Ice', description: 'High-torque motor makes light work of frozen fruit.' },
                                { icon: 'volume-x', title: 'Whisper Quiet', description: 'Use it at the office or gym without turning heads.' }
                            ],
                            testimonials: [
                                { name: 'Sarah J.', text: 'I use it every single day after the gym. Game changer.', rating: 5 },
                                { name: 'Michael O.', text: 'Stronger than my plug-in blender. Seriously.', rating: 5 },
                                { name: 'Amaka P.', text: 'Best gift I bought myself this year.', rating: 5 }
                            ],
                            faqs: [
                                { question: 'Is it easy to clean?', answer: 'Yes! Just add water and soap, then blend for 5 seconds.' },
                                { question: 'Can it crush ice?', answer: 'Absolutely. It has a dedicated Pulse Mode for ice.' },
                                { question: 'How long is shipping?', answer: 'We ship nationwide within 1-3 business days.' }
                            ],
                            upsellProductId: 'p_upsell_jar'
                        }
                    },
                    contact: { email: 'support@vayvatech.com', phone: '+234 800 VAYVA' },
                    policies: {
                        shipping: 'Free express shipping on all orders.',
                        returns: '30-day money back guarantee, no questions asked.',
                        privacy: 'We prioritize your data security.'
                    }
                };
            }

            return null;
        } catch (e) {
            console.error('getStore error', e);
            return null;
        }
    },

    getProducts: async (storeId: string): Promise<PublicProduct[]> => {
        try {
            const response = await fetch(`${API_BASE}/public/products?storeId=${storeId}`);
            if (response.ok) return await response.json();

            // Mock Data for A&A Fashion
            if (storeId === 'store_aa_fashion') {
                return [
                    { id: 'p1', name: 'Silk Midi Dress', price: 45000, description: 'Elegant silk midi dress suitable for evening outings.', images: ['https://placehold.co/600x800/e5e5e5/111111?text=Silk+Dress'], category: 'Dresses', inStock: true, variants: [], storeId },
                    { id: 'p2', name: 'Linen Two-Piece Set', price: 35000, description: 'Breathable linen set, perfect for summer.', images: ['https://placehold.co/600x800/d4d4d4/111111?text=Linen+Set'], category: 'Two Pieces', inStock: true, variants: [], storeId },
                    { id: 'p3', name: 'Classic White Shirt', price: 15000, description: 'Crisp white shirt for a professional look.', images: ['https://placehold.co/600x800/f5f5f5/111111?text=White+Shirt'], category: 'Tops', inStock: true, variants: [], storeId },
                    { id: 'p4', name: 'Wide Leg Trousers', price: 22000, description: 'High-waisted wide leg trousers.', images: ['https://placehold.co/600x800/e0e0e0/111111?text=Trousers'], category: 'Bottoms', inStock: true, variants: [], storeId },
                    { id: 'p5', name: 'Summer Floral Dress', price: 28000, description: 'Lightweight floral dress.', images: ['https://placehold.co/600x800/f0f0f0/111111?text=Floral+Dress'], category: 'Dresses', inStock: true, variants: [], storeId },
                    { id: 'p6', name: 'Crop Blazer', price: 30000, description: 'Stylish crop blazer.', images: ['https://placehold.co/600x800/cccccc/111111?text=Crop+Blazer'], category: 'Jackets', inStock: false, variants: [], storeId },
                    { id: 'p7', name: 'Pleated Skirt', price: 18000, description: 'Midi pleated skirt.', images: ['https://placehold.co/600x800/dddddd/111111?text=Pleated+Skirt'], category: 'Bottoms', inStock: true, variants: [], storeId },
                    { id: 'p8', name: 'Satin Blouse', price: 20000, description: 'Luxurious satin blouse.', images: ['https://placehold.co/600x800/eeeeee/111111?text=Satin+Blouse'], category: 'Tops', inStock: true, variants: [], storeId },
                ];
            }

            // Mock Data for Gizmo Tech
            if (storeId === 'store_gizmo_tech') {
                return [
                    {
                        id: 'g1', name: 'Noise Cancelling Headphones', price: 116000, description: 'Premium over-ear headphones with industry-leading noise cancellation.',
                        images: ['https://placehold.co/600x600/111/fff?text=Headphones'], category: 'Audio', inStock: true, variants: [], storeId,
                        specs: [{ label: 'Battery', value: '30 Hours' }, { label: 'Connectivity', value: 'Bluetooth 5.2' }], warrantyInfo: '2 Years Manufacturer Warranty'
                    },
                    {
                        id: 'g2', name: 'Portable Bluetooth Speaker', price: 45000, description: 'Rugged waterproof speaker with 360-degree sound.',
                        images: ['https://placehold.co/600x600/222/fff?text=Speaker'], category: 'Audio', inStock: true, variants: [], storeId,
                        specs: [{ label: 'Waterproof', value: 'IP67' }, { label: 'Playtime', value: '12 Hours' }], warrantyInfo: '1 Year Warranty'
                    },
                    {
                        id: 'g3', name: 'Smartwatch Series 5', price: 38000, description: 'Fitness tracking, heart rate monitoring, and notifications.',
                        images: ['https://placehold.co/600x600/333/fff?text=Watch'], category: 'Wearables', inStock: true, variants: [], storeId,
                        specs: [{ label: 'Display', value: 'AMOLED' }, { label: 'Sensors', value: 'HR, SpO2' }], warrantyInfo: '1 Year Warranty'
                    },
                    {
                        id: 'g4', name: 'Ultra-Slim Power Bank', price: 22500, description: '10000mAh capacity with fast charging support.',
                        images: ['https://placehold.co/600x600/444/fff?text=PowerBank'], category: 'Accessories', inStock: true, variants: [], storeId,
                        specs: [{ label: 'Capacity', value: '10000mAh' }, { label: 'Output', value: '20W PD' }], warrantyInfo: '6 Months Warranty'
                    },
                    {
                        id: 'g5', name: 'Wireless Earbuds Pro', price: 29000, description: 'Active noise cancellation in a compact design.',
                        images: ['https://placehold.co/600x600/555/fff?text=Earbuds'], category: 'Audio', inStock: true, variants: [], storeId,
                        specs: [{ label: 'Battery', value: '24 Hours (Case)' }, { label: 'Driver', value: '11mm' }], warrantyInfo: '1 Year Warranty'
                    },
                    {
                        id: 'g6', name: 'Rugged Phone Case', price: 7500, description: 'Military-grade drop protection for your smartphone.',
                        images: ['https://placehold.co/600x600/666/fff?text=Case'], category: 'Accessories', inStock: true, variants: [], storeId,
                        specs: [{ label: 'Material', value: 'TPU + Polycarbonate' }], warrantyInfo: 'Lifetime Warranty'
                    },
                    {
                        id: 'g7', name: 'Bluetooth Mechanical Keyboard', price: 18000, description: 'Tactile switches and multi-device connection.',
                        images: ['https://placehold.co/600x600/777/fff?text=Keyboard'], category: 'Computers', inStock: true, variants: [], storeId,
                        specs: [{ label: 'Switches', value: 'Blue/Red' }, { label: 'Battery', value: '4000mAh' }], warrantyInfo: '1 Year Warranty'
                    },
                    {
                        id: 'g8', name: 'LED Desk Lamp', price: 15000, description: 'Adjustable brightness and color temperature.',
                        images: ['https://placehold.co/600x600/888/fff?text=Lamp'], category: 'Home Tech', inStock: true, variants: [], storeId,
                        specs: [{ label: 'Power', value: '10W' }, { label: 'Modes', value: '3 Color Temps' }], warrantyInfo: '1 Year Warranty'
                    },
                ];
            }

            // Mock Data for Bloome & Home
            if (storeId === 'store_bloome_home') {
                return [
                    {
                        id: 'b1', name: 'Calming Soy Candle', price: 18000, description: 'Hand-poured soy wax candle with notes of lavender and vanilla.',
                        images: ['https://placehold.co/600x800/C9B7A2/fff?text=Candle'], category: 'Home Fragrance', inStock: true, variants: [], storeId,
                        ingredients: '100% Natural Soy Wax, Cotton Wick, Essential Oils',
                        rituals: [{ step: 'Light', description: 'Trim wick to 1/4 inch before lighting.' }, { step: 'Breathe', description: 'Inhale deeply and let the aroma fill the room.' }],
                        subscriptionOptions: { available: true, frequencies: ['Monthly', 'Bi-Monthly'] }
                    },
                    {
                        id: 'b2', name: 'Gentle Facial Cleanser', price: 12500, description: 'A hydrating cleanser that removes impurities without stripping moisture.',
                        images: ['https://placehold.co/600x800/EAE0D5/222?text=Cleanser'], category: 'Skincare', inStock: true, variants: [], storeId,
                        ingredients: 'Aloe Vera, Chamomile Extract, Glycerin',
                        rituals: [{ step: 'Apply', description: 'Massage onto damp skin in circular motions.' }, { step: 'Rinse', description: 'Wash off with lukewarm water.' }],
                        subscriptionOptions: { available: true, frequencies: ['Monthly'] }
                    },
                    {
                        id: 'b3', name: 'Nourishing Body Oil', price: 15000, description: 'Luxurious blend of oils to restore skin elasticity and glow.',
                        images: ['https://placehold.co/600x800/C6C5B9/222?text=Body+Oil'], category: 'Body Care', inStock: true, variants: [], storeId,
                        ingredients: 'Jojoba Oil, Sweet Almond Oil, Vitamin E',
                        rituals: [{ step: 'Warm', description: 'Warm a few drops between palms.' }, { step: 'Massage', description: 'Apply to damp skin after bathing.' }],
                        subscriptionOptions: { available: true, frequencies: ['Monthly'] }
                    },
                    {
                        id: 'b4', name: 'Ceramic Stone Diffuser', price: 22000, description: 'Minimalist ceramic diffuser to uplift your space.',
                        images: ['https://placehold.co/600x800/D4CDC3/222?text=Diffuser'], category: 'Home Decor', inStock: true, variants: [], storeId,
                        ingredients: 'Ceramic Shell, BPA-free Plastic Interior',
                        rituals: [{ step: 'Fill', description: 'Add water to the fill line.' }, { step: 'Diffuse', description: 'Add 5-10 drops of essential oil.' }],
                        subscriptionOptions: { available: false, frequencies: [] } // One-time purchase often
                    }
                ];
            }

            // Mock Data for Bookly Pro
            if (storeId === 'store_bookly_pro') {
                return [
                    {
                        id: 'srv1', name: 'Classic Haircut', price: 8000, description: '30-minute scissor cut and style with hot towel finish.',
                        images: ['https://placehold.co/600x400/2563EB/fff?text=Haircut'], category: 'Hair', inStock: true, variants: [], storeId,
                        type: 'service',
                        serviceDetails: { duration: 30, hasDeposit: false }
                    },
                    {
                        id: 'srv2', name: 'Beard Grooming', price: 5000, description: 'Beard trim, shape, and oil treatment.',
                        images: ['https://placehold.co/600x400/1E40AF/fff?text=Beard'], category: 'Beard', inStock: true, variants: [], storeId,
                        type: 'service',
                        serviceDetails: { duration: 20, hasDeposit: false }
                    },
                    {
                        id: 'srv3', name: 'Full Service (Cut + Shave)', price: 12000, description: 'The complete package. Haircut, beard shave/trim, and facial massage.',
                        images: ['https://placehold.co/600x400/1E3A8A/fff?text=Full+Service'], category: 'Packages', inStock: true, variants: [], storeId,
                        type: 'service',
                        serviceDetails: { duration: 60, hasDeposit: true, depositAmount: 5000 }
                    },
                    {
                        id: 'srv4', name: 'Kids Cut', price: 4000, description: 'Gentle cut for children under 12.',
                        images: ['https://placehold.co/600x400/60A5FA/fff?text=Kids'], category: 'Hair', inStock: true, variants: [], storeId,
                        type: 'service',
                        serviceDetails: { duration: 30, hasDeposit: false }
                    }
                ];
            }

            // Mock Data for Chopnow
            if (storeId === 'store_chopnow') {
                return [
                    {
                        id: 'f1', name: 'Signature Jollof Rice', price: 4500, description: 'Smoky party jollof with fried plantain and your choice of protein.',
                        images: ['https://placehold.co/600x400/DC2626/fff?text=Jollof'], category: 'Mains', inStock: true, variants: [], storeId,
                        type: 'food',
                        isAvailable: true,
                        modifiers: [
                            { id: 'm1', name: 'Protein', type: 'choice', options: [{ label: 'Chicken', price: 0 }, { label: 'Beef', price: 500 }, { label: 'Goat Meat', price: 1000 }] },
                            { id: 'm2', name: 'Extras', type: 'addon', options: [{ label: 'Extra Plantain', price: 500 }, { label: 'Coleslaw', price: 200 }] }
                        ]
                    },
                    {
                        id: 'f2', name: 'Chicken Shawarma', price: 3500, description: 'Double sausage, chicken strips, and creamy sauce wrapped in flatbread.',
                        images: ['https://placehold.co/600x400/F59E0B/fff?text=Shawarma'], category: 'Wraps', inStock: true, variants: [], storeId,
                        type: 'food',
                        isAvailable: true,
                        modifiers: [
                            { id: 'm3', name: 'Spice Level', type: 'choice', options: [{ label: 'Mild', price: 0 }, { label: 'Spicy', price: 0 }, { label: 'Extra Hot', price: 0 }] },
                            { id: 'm4', name: 'Addons', type: 'addon', options: [{ label: 'Extra Cheese', price: 500 }, { label: 'Extra Sausage', price: 400 }] }
                        ]
                    },
                    {
                        id: 'f3', name: 'Gourmet Beef Burger', price: 6000, description: 'Juicy beef patty, cheddar, tomatoes, and house sauce with fries.',
                        images: ['https://placehold.co/600x400/78350F/fff?text=Burger'], category: 'Burgers', inStock: true, variants: [], storeId,
                        type: 'food',
                        isAvailable: true,
                        modifiers: [
                            { id: 'm5', name: 'Doneness', type: 'choice', options: [{ label: 'Well Done', price: 0 }, { label: 'Medium', price: 0 }] }
                        ]
                    },
                    {
                        id: 'f4', name: 'Tropical Smoothie', price: 2000, description: 'Pineapple, coconut, and mango blend.',
                        images: ['https://placehold.co/600x400/10B981/fff?text=Smoothie'], category: 'Drinks', inStock: true, variants: [], storeId,
                        type: 'food',
                        isAvailable: true
                    },
                ];
            }

            // Mock Data for FileVault
            if (storeId === 'store_filevault') {
                return [
                    {
                        id: 'd1', name: 'Ultimate Pitch Deck', price: 15000, description: 'The exact deck structure used to raise $5M+. Fully editable Keynote & PPT.',
                        images: ['https://placehold.co/600x400/6366F1/fff?text=Pitch+Deck'], category: 'Documents', inStock: true, variants: [], storeId,
                        type: 'digital',
                        fileDetails: { fileType: 'ZIP', fileSize: '45 MB', version: '2.1', downloadLimit: 5 },
                        licenseType: 'standard'
                    },
                    {
                        id: 'd2', name: 'SaaS UI Kit (Figma)', price: 22000, description: 'Over 200+ components, auto-layout ready, dark & light mode.',
                        images: ['https://placehold.co/600x400/10B981/fff?text=UI+Kit'], category: 'Design', inStock: true, variants: [], storeId,
                        type: 'digital',
                        fileDetails: { fileType: 'FIG', fileSize: '120 MB', version: '1.0', downloadLimit: 3 },
                        licenseType: 'extended'
                    },
                    {
                        id: 'd3', name: '2025 Content Calendar', price: 8500, description: 'Notion template to plan your social media for the entire year.',
                        images: ['https://placehold.co/600x400/F59E0B/fff?text=Content+Cal'], category: 'Templates', inStock: true, variants: [], storeId,
                        type: 'digital',
                        fileDetails: { fileType: 'PDF', fileSize: '2 MB', version: '2025.1' },
                        licenseType: 'standard'
                    },
                    {
                        id: 'd4', name: 'Legal Docs Pack', price: 18000, description: 'Freelancer contracts, NDA, and Service Agreements drafted by pros.',
                        images: ['https://placehold.co/600x400/6B7280/fff?text=Legal+Docs'], category: 'Documents', inStock: true, variants: [], storeId,
                        type: 'digital',
                        fileDetails: { fileType: 'DOCX', fileSize: '5 MB', version: '1.2' },
                        licenseType: 'standard'
                    }
                ];
            }

            // Mock Data for Ticketly
            if (storeId === 'store_ticketly') {
                return [
                    {
                        id: 'e1', name: 'Lagos Tech Conference 2025', price: 15000, description: 'The biggest gathering of developers, founders, and investors in West Africa.',
                        images: ['https://placehold.co/800x400/7C3AED/fff?text=Lagos+Tech+Conf'], category: 'Conference', inStock: true, variants: [], storeId,
                        type: 'ticket',
                        eventDetails: {
                            date: '2025-11-15T09:00:00Z',
                            venue: 'Eko Convention Center, Lagos',
                            organizer: 'Tech Horizon',
                            capacity: 2000,
                            ticketsSold: 1250,
                            ticketTypes: [
                                { id: 'tt1', name: 'General Admission', price: 15000, capacity: 1500 },
                                { id: 'tt2', name: 'VIP Access', price: 50000, capacity: 200 },
                                { id: 'tt3', name: 'Student', price: 5000, capacity: 300 }
                            ]
                        }
                    },
                    {
                        id: 'e2', name: 'Live Worship Night: Overflow', price: 5000, description: 'An evening of soul-stirring music and community.',
                        images: ['https://placehold.co/800x400/F97316/fff?text=Worship+Night'], category: 'Religous', inStock: true, variants: [], storeId,
                        type: 'ticket',
                        eventDetails: {
                            date: '2025-10-20T18:00:00Z',
                            venue: 'The Dome, Lekki',
                            organizer: 'City Church',
                            capacity: 5000,
                            ticketsSold: 4200,
                            ticketTypes: [
                                { id: 'tt4', name: 'Regular Seat', price: 5000 },
                                { id: 'tt5', name: 'Front Row', price: 15000 }
                            ]
                        }
                    },
                    {
                        id: 'e3', name: 'Business Growth Workshop', price: 25000, description: 'Intensive masterclass on scaling your SME in 2025.',
                        images: ['https://placehold.co/800x400/111827/fff?text=Workshop'], category: 'Workshop', inStock: true, variants: [], storeId,
                        type: 'ticket',
                        eventDetails: {
                            date: '2025-09-05T10:00:00Z',
                            venue: 'Radisson Blu, Ikeja',
                            organizer: 'BizGrowth NG',
                            capacity: 50,
                            ticketsSold: 45,
                            ticketTypes: [
                                { id: 'tt6', name: 'Standard Seat', price: 25000, capacity: 50 }
                            ]
                        }
                    }
                ];
            }

            // Mock Data for Eduflow
            if (storeId === 'store_eduflow') {
                return [
                    {
                        id: 'c1', name: 'Frontend Development Bootcamp', price: 50000, description: 'Master React, Next.js, and TypeScript in 8 weeks.',
                        images: ['https://placehold.co/800x400/2563EB/fff?text=Frontend+Dev'], category: 'Development', inStock: true, variants: [], storeId,
                        type: 'course',
                        courseDetails: {
                            level: 'Intermediate',
                            instructor: { name: 'Sarah Dev', title: 'Senior Engineer @ Google', avatar: 'https://placehold.co/100x100?text=SD' },
                            certificate: true,
                            lessons: [
                                { id: 'l1', title: 'Introduction to React', duration: '12 mins', isLocked: false },
                                { id: 'l2', title: 'Understanding Hooks', duration: '25 mins', isLocked: true },
                                { id: 'l3', title: 'State Management', duration: '40 mins', isLocked: true },
                                { id: 'l4', title: 'Building the Project', duration: '60 mins', isLocked: true }
                            ]
                        }
                    },
                    {
                        id: 'c2', name: 'Digital Marketing Mastery', price: 28000, description: 'SEO, SEM, and Social Media strategies that convert.',
                        images: ['https://placehold.co/800x400/22C55E/fff?text=Marketing'], category: 'Business', inStock: true, variants: [], storeId,
                        type: 'course',
                        courseDetails: {
                            level: 'Beginner',
                            instructor: { name: 'Mark Growth', title: 'CMO @ Startup', avatar: 'https://placehold.co/100x100?text=MG' },
                            certificate: true,
                            lessons: [
                                { id: 'm1', title: 'SEO Basics', duration: '15 mins', isLocked: false },
                                { id: 'm2', title: 'Google Ads Setup', duration: '30 mins', isLocked: true }
                            ]
                        }
                    },
                    {
                        id: 'c3', name: 'Faith & Purpose', price: 0, description: 'Discovering your calling in a noisy world.',
                        images: ['https://placehold.co/800x400/F59E0B/fff?text=Purpose'], category: 'Personal Growth', inStock: true, variants: [], storeId,
                        type: 'course',
                        courseDetails: {
                            level: 'All Levels',
                            instructor: { name: 'Pastor John', title: 'Author & Speaker', avatar: 'https://placehold.co/100x100?text=PJ' },
                            certificate: false,
                            lessons: [
                                { id: 'f1', title: 'Session 1: The Why', duration: '45 mins', isLocked: false },
                                { id: 'f2', title: 'Session 2: The How', duration: '50 mins', isLocked: true }
                            ]
                        }
                    }
                ];
            }

            // Mock Data for BulkTrade
            if (storeId === 'store_bulktrade') {
                return [
                    {
                        id: 'w1', name: 'Dangote Cement (50kg Bag)', price: 4200, description: 'High-grade 42.5N Portland Limestone Cement for structural use. Minimum order 100 bags.',
                        images: ['https://placehold.co/800x400/94A3B8/fff?text=Cement+50kg'], category: 'Construction', inStock: true, variants: [], storeId,
                        type: 'wholesale',
                        wholesaleDetails: {
                            moq: 100,
                            leadTime: '3-5 Business Days',
                            pricingTiers: [
                                { minQty: 100, price: 4200 },
                                { minQty: 500, price: 4000 },
                                { minQty: 1000, price: 3850 }
                            ]
                        }
                    },
                    {
                        id: 'w2', name: 'A4 Office Paper (Carton)', price: 28000, description: 'Premium 80gsm white printing paper. 5 Reams per carton.',
                        images: ['https://placehold.co/800x400/E2E8F0/000?text=Paper+Carton'], category: 'Office Supplies', inStock: true, variants: [], storeId,
                        type: 'wholesale',
                        wholesaleDetails: {
                            moq: 10,
                            leadTime: '2 Days',
                            pricingTiers: [
                                { minQty: 10, price: 28000 },
                                { minQty: 50, price: 26500 },
                                { minQty: 200, price: 25000 }
                            ]
                        }
                    },
                    {
                        id: 'w3', name: 'Vegetable Oil (25L Drum)', price: 95000, description: 'Pure refined vegetable oil for industrial kitchens and resale.',
                        images: ['https://placehold.co/800x400/FACC15/000?text=Oil+Drum'], category: 'FMCG', inStock: true, variants: [], storeId,
                        type: 'wholesale',
                        wholesaleDetails: {
                            moq: 5,
                            leadTime: 'Same Day Dispatch',
                            pricingTiers: [
                                { minQty: 5, price: 95000 },
                                { minQty: 20, price: 92000 }
                            ]
                        }
                    },
                    {
                        id: 'w4', name: 'Copper Cable 2.5mm (Roll)', price: 62000, description: 'Standard pure copper electrical wire. 100m per roll.',
                        images: ['https://placehold.co/800x400/B45309/fff?text=Copper+Wire'], category: 'Electrical', inStock: true, variants: [], storeId,
                        type: 'wholesale',
                        wholesaleDetails: {
                            moq: 20,
                            leadTime: '4 Business Days',
                            pricingTiers: [
                                { minQty: 20, price: 62000 },
                                { minQty: 100, price: 58000 }
                            ]
                        }
                    }
                ];
            }

            // Mock Data for MarketHub (Aggregated)
            if (storeId === 'store_markethub') {
                return [
                    {
                        id: 'm1', name: 'Vintage Denim Jacket', price: 15000, description: 'Authentic 90s vintage denim. One of a kind.',
                        images: ['https://placehold.co/800x800/1F2937/fff?text=Denim+Jacket'], category: 'Fashion', inStock: true, variants: [], storeId,
                        type: 'marketplace',
                        vendorDetails: {
                            id: 'v1', name: 'RetroThreads', rating: 4.8, isVerified: true, logo: 'https://placehold.co/100x100/purple/white?text=RT'
                        }
                    },
                    {
                        id: 'm2', name: 'Handcrafted Clay Vase', price: 8500, description: 'Minimalist ceramic vase for modern homes.',
                        images: ['https://placehold.co/800x800/D97706/fff?text=Clay+Vase'], category: 'Home', inStock: true, variants: [], storeId,
                        type: 'marketplace',
                        vendorDetails: {
                            id: 'v2', name: 'EarthWorks', rating: 4.5, isVerified: true, logo: 'https://placehold.co/100x100/orange/white?text=EW'
                        }
                    },
                    {
                        id: 'm3', name: 'Organic Honey (500ml)', price: 4000, description: 'Pure raw honey from local farms.',
                        images: ['https://placehold.co/800x800/F59E0B/fff?text=Honey'], category: 'Grocery', inStock: true, variants: [], storeId,
                        type: 'marketplace',
                        vendorDetails: {
                            id: 'v3', name: 'GreenValley Farms', rating: 4.9, isVerified: true, logo: 'https://placehold.co/100x100/green/white?text=GV'
                        }
                    },
                    {
                        id: 'm4', name: 'Wireless Earbuds Pro', price: 25000, description: 'Noise cancelling earbuds with 24h battery life.',
                        images: ['https://placehold.co/800x800/3B82F6/fff?text=Earbuds'], category: 'Electronics', inStock: true, variants: [], storeId,
                        type: 'marketplace',
                        vendorDetails: {
                            id: 'v4', name: 'TechZone Official', rating: 4.2, isVerified: false, logo: 'https://placehold.co/100x100/blue/white?text=TZ'
                        }
                    },
                    {
                        id: 'm5', name: 'Leather Crossbody Bag', price: 18000, description: 'Hand-stitched genuine leather bag.',
                        images: ['https://placehold.co/800x800/78350F/fff?text=Leather+Bag'], category: 'Fashion', inStock: true, variants: [], storeId,
                        type: 'marketplace',
                        vendorDetails: {
                            id: 'v1', name: 'RetroThreads', rating: 4.8, isVerified: true, logo: 'https://placehold.co/100x100/purple/white?text=RT'
                        }
                    }
                ];
            }

            // Mock Data for GiveFlow (Campaigns)
            if (storeId === 'store_giveflow') {
                return [
                    {
                        id: 'g1', name: 'Feed 1,000 Families', price: 0, description: 'Provide essential food supplies to families affected by recent floods.',
                        images: ['https://placehold.co/800x400/16A34A/fff?text=Feed+Families'], category: 'Relief', inStock: true, variants: [], storeId,
                        type: 'donation',
                        donationDetails: {
                            goalAmount: 5000000,
                            raisedAmount: 3250000,
                            donorCount: 420,
                            orgName: 'Nigeria Relief Fund',
                            isRecurringAvailable: true
                        }
                    },
                    {
                        id: 'g2', name: 'Build a Community Borehole', price: 0, description: 'Clean water access for the rural community of Ikorodu North.',
                        images: ['https://placehold.co/800x400/2563EB/fff?text=Clean+Water'], category: 'Infrastructure', inStock: true, variants: [], storeId,
                        type: 'donation',
                        donationDetails: {
                            goalAmount: 3500000,
                            raisedAmount: 850000,
                            donorCount: 115,
                            orgName: 'Clean Water Initiative',
                            isRecurringAvailable: false
                        }
                    },
                    {
                        id: 'g3', name: 'School Supplies for Children', price: 0, description: 'Books, bags, and uniforms for 500 underprivileged students.',
                        images: ['https://placehold.co/800x400/F59E0B/fff?text=Education'], category: 'Education', inStock: true, variants: [], storeId,
                        type: 'donation',
                        donationDetails: {
                            goalAmount: 2000000,
                            raisedAmount: 1950000,
                            donorCount: 310,
                            orgName: 'Bright Future Foundation',
                            isRecurringAvailable: true
                        }
                    },
                    {
                        id: 'g4', name: 'Emergency Medical Fund', price: 0, description: 'Critical surgery support for patients with no insurance.',
                        images: ['https://placehold.co/800x400/DC2626/fff?text=Medical+Aid'], category: 'Health', inStock: true, variants: [], storeId,
                        type: 'donation',
                        donationDetails: {
                            goalAmount: 10000000,
                            raisedAmount: 1200000,
                            donorCount: 85,
                            orgName: 'Health Access NGO',
                            isRecurringAvailable: true
                        }
                    }
                ];
            }

            // Mock Data for HomeList (Properties)
            if (storeId === 'store_homelist') {
                return [
                    {
                        id: 'p1', name: 'Luxury 4 Bedroom Duplex', price: 180000000, description: 'Newly built contemporary duplex with swimming pool and gymnasium.',
                        images: ['https://placehold.co/800x600/0F172A/fff?text=Luxury+Duplex'], category: 'Residential', inStock: true, variants: [], storeId,
                        type: 'property',
                        propertyDetails: {
                            type: 'house',
                            purpose: 'sale',
                            beds: 4,
                            baths: 5,
                            sqm: 450,
                            location: 'Ajah, Lagos',
                            amenities: ['Swimming Pool', 'Gym', '24/7 Power', 'Security']
                        }
                    },
                    {
                        id: 'p2', name: 'Moderen 2 Bed Apartment', price: 4500000, description: 'Serviced apartment in a secure estate. Perfect for young professionals.',
                        images: ['https://placehold.co/800x600/2563EB/fff?text=Modern+Apt'], category: 'Residential', inStock: true, variants: [], storeId,
                        type: 'property',
                        propertyDetails: {
                            type: 'apartment',
                            purpose: 'rent',
                            beds: 2,
                            baths: 2,
                            location: 'Lekki Phase 1, Lagos',
                            amenities: ['Serviced', 'Parking', 'Water Treatment']
                        }
                    },
                    {
                        id: 'p3', name: 'Furnished Executive Studio', price: 45000, description: 'Short-stay apartment with premium finishing and internet.',
                        images: ['https://placehold.co/800x600/F59E0B/fff?text=Studio+Shortlet'], category: 'Shortlet', inStock: true, variants: [], storeId,
                        type: 'property',
                        propertyDetails: {
                            type: 'apartment',
                            purpose: 'shortlet',
                            beds: 1,
                            baths: 1,
                            location: 'Victoria Island, Lagos',
                            amenities: ['WiFi', 'DSTV', 'Daily Cleaning', 'Kitchenette']
                        }
                    },
                    {
                        id: 'p4', name: '600sqm Dry Land', price: 35000000, description: 'Ready to build land in a developing estate with C of O.',
                        images: ['https://placehold.co/800x600/16A34A/fff?text=Dry+Land'], category: 'Land', inStock: true, variants: [], storeId,
                        type: 'property',
                        propertyDetails: {
                            type: 'land',
                            purpose: 'sale',
                            sqm: 600,
                            location: 'Ibeju-Lekki, Lagos',
                            amenities: ['Gated Estate', 'Good Road Network']
                        }
                    }
                ];
            }

            // Mock Data for OneProduct (Single Product + Upsell)
            if (storeId === 'store_oneprod') {
                return [
                    {
                        id: 'p_blender', name: 'Vayva Smart Blender Pro', price: 45000,
                        description: 'The ultimate portable blender. 500ml capacity, USB-C charging, and silent operation.',
                        images: ['https://placehold.co/800x800/111827/fff?text=Smart+Blender', 'https://placehold.co/800x800/e5e7eb/111827?text=Lifestyle+Shot'],
                        category: 'Gadgets', inStock: true, variants: [], storeId,
                        type: 'physical'
                    },
                    {
                        id: 'p_upsell_jar', name: 'Extra 500ml Jar', price: 5000,
                        description: 'Keep a spare jar for your protein shakes.',
                        images: ['https://placehold.co/800x800/222/fff?text=Extra+Jar'],
                        category: 'Accessories', inStock: true, variants: [], storeId,
                        type: 'physical'
                    }
                ];
            }

            return [];
        } catch (e) {
            return [];
        }
    },

    getProduct: async (storeId: string, productId: string): Promise<PublicProduct | null> => {
        try {
            const response = await fetch(`${API_BASE}/public/products/${productId}`);
            if (response.ok) return await response.json();
            return null;
        } catch (e) {
            return null;
        }
    },

    createOrder: async (data: any): Promise<any> => {
        const response = await fetch(`${API_BASE}/public/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Failed to create order');
        }
        return await response.json();
    },

    initializePayment: async (data: { orderId: string, email: string, amount: number, callbackUrl: string }): Promise<any> => {
        const response = await fetch(`${API_BASE}/public/pay`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Failed to initialize payment');
        }
        return await response.json();
    },

    getOrderStatus: async (ref: string, phone: string): Promise<any> => {
        const response = await fetch(`${API_BASE}/public/orders/status?ref=${ref}&phone=${phone}`);
        if (!response.ok) return null;
        return await response.json();
    }
};
