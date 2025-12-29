'use client';

import React, { useEffect, useState } from 'react';
import { StoreShell } from '@/components/StoreShell';
import { ProductCard } from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';
import { StorefrontService } from '@/services/storefront.service';
import { PublicProduct } from '@/types/storefront';
import NextLink from 'next/link';
const Link = NextLink as any;
import { ArrowRight as ArrowRightIcon } from 'lucide-react';
const ArrowRight = ArrowRightIcon as any;

// Template Imports
import dynamic from 'next/dynamic';

// Template Imports - Dynamic to reduce initial bundle size
const AAFashionHome = dynamic(() => import('@/templates/aa-fashion/AAFashionHome').then(m => m.AAFashionHome));
const GizmoTechHome = dynamic(() => import('@/templates/gizmo-tech/GizmoTechHome').then(m => m.GizmoTechHome));
const BloomeHomeLayout = dynamic(() => import('@/templates/bloome-home/BloomeHomeLayout').then(m => m.BloomeHomeLayout));
const BooklyLayout = dynamic(() => import('@/templates/bookly-pro/BooklyLayout').then(m => m.BooklyLayout));
const ChopnowLayout = dynamic(() => import('@/templates/chopnow/ChopnowLayout').then(m => m.ChopnowLayout));
const FileVaultLayout = dynamic(() => import('@/templates/file-vault/FileVaultLayout').then(m => m.FileVaultLayout));
const TicketlyLayout = dynamic(() => import('@/templates/ticketly/TicketlyLayout').then(m => m.TicketlyLayout));
const EduflowLayout = dynamic(() => import('@/templates/eduflow/EduflowLayout').then(m => m.EduflowLayout));
const BulkTradeLayout = dynamic(() => import('@/templates/bulktrade/BulkTradeLayout').then(m => m.BulkTradeLayout));
const MarketHubLayout = dynamic(() => import('@/templates/markethub/MarketHubLayout').then(m => m.MarketHubLayout));
const GiveFlowLayout = dynamic(() => import('@/templates/giveflow/GiveFlowLayout').then(m => m.GiveFlowLayout));
const HomeListLayout = dynamic(() => import('@/templates/homelist/HomeListLayout').then(m => m.HomeListLayout));
const OneProductLayout = dynamic(() => import('@/templates/one-product/OneProductLayout').then(m => m.OneProductLayout));

import { TEMPLATE_REGISTRY } from '@/lib/templates-registry';

// Map registry layout keys to components
const LAYOUT_COMPONENTS: Record<string, React.ComponentType<any>> = {
  'AAFashionHome': AAFashionHome,
  'GizmoTechHome': GizmoTechHome,
  'BloomeHomeLayout': BloomeHomeLayout,
  'BooklyLayout': BooklyLayout,
  'ChopnowLayout': ChopnowLayout,
  'FileVaultLayout': FileVaultLayout,
  'TicketlyLayout': TicketlyLayout,
  'EduflowLayout': EduflowLayout,
  'BulkTradeLayout': BulkTradeLayout,
  'MarketHubLayout': MarketHubLayout,
  'GiveFlowLayout': GiveFlowLayout,
  'HomeListLayout': HomeListLayout,
  'OneProductLayout': OneProductLayout,
  'StoreShell': StoreShell // Fallback/Standard
};

export default function StoreHome() {
  const { store } = useStore();
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    if (store) {
      const load = async () => {
        const data = await StorefrontService.getProducts(store.id);
        setProducts(data);
        setLoadingProducts(false);
      };
      load();
    }
  }, [store]);

  if (!store) return null;

  // Resolve Template ID from Store (Theme or Slug)
  // Priority: 1. store.theme.templateId (if valid), 2. Look up by store slug in registry
  let activeTemplateId = (store.theme as any).templateId;

  if (!activeTemplateId || !TEMPLATE_REGISTRY[activeTemplateId]) {
    // Fallback: check if the slug implies a demo template
    const demoTemplate = Object.values(TEMPLATE_REGISTRY).find(t => t.slug === store.slug);
    if (demoTemplate) {
      activeTemplateId = demoTemplate.templateId;
    } else {
      activeTemplateId = 'vayva-standard';
    }
  }

  const templateDef = TEMPLATE_REGISTRY[activeTemplateId];
  const componentKey = templateDef?.layoutComponent || 'StoreShell';
  const ActiveLayout = LAYOUT_COMPONENTS[componentKey];

  // Specific Loading States based on theme (optional polish)
  if (loadingProducts) {
    const themeColor = templateDef?.defaultTheme === 'dark' ? 'bg-[#0B0F19] text-white' : 'bg-white text-gray-900';
    return <div className={`min-h-screen flex items-center justify-center ${themeColor}`}>Loading...</div>;
  }

  // If it's a specific layout (non-standard), render it securely
  if (componentKey !== 'StoreShell' && ActiveLayout) {
    return <ActiveLayout store={store} products={products} />;
  }

  // DEFAULT STANDARD TEMPLATE (Fallback / StoreShell)
  // This is technically `vayva-standard`
  return (
    <StoreShell>
      {/* Hero Section */}
      <section className="relative px-4 py-20 bg-gray-50 mb-16">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">{store.name}</h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed">
            {store.tagline || 'Explore our varied collection of premium products.'}
          </p>
          <Link href={`/collections/all?store=${store.slug}`}>
            <button className="bg-black text-white px-8 py-4 rounded-full font-bold text-sm tracking-wide hover:bg-gray-900 transition-colors">
              Shop All Products
            </button>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Featured</h2>
          <Link href={`/collections/all?store=${store.slug}`} className="flex items-center gap-2 text-sm font-medium hover:text-gray-600">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-100 aspect-[4/5] rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-100 w-2/3 rounded mb-2"></div>
                <div className="h-4 bg-gray-100 w-1/3 rounded"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {products.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} storeSlug={store.slug} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-500">No products available yet.</p>
          </div>
        )}
      </section>
    </StoreShell>
  );
}
