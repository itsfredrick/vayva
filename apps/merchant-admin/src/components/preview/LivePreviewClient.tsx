'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { getDemoStore } from '@/lib/preview/demo-data';
import { DemoHome } from '@/components/preview/demo/DemoHome';
import { DemoCollection } from '@/components/preview/demo/DemoCollection';
import { DemoProductView } from '@/components/preview/demo/DemoProduct';
import { cn } from '@/lib/utils';

type Mode = 'live' | 'images';
type Device = 'desktop' | 'mobile';
type View = 'home' | 'collection' | 'product';

type Props = {
    templateName: string;
    slug: string;

    LayoutComponent?: React.ComponentType<any> | null;

    fallbackDesktopImage: string;
    fallbackMobileImage: string;
};

class PreviewErrorBoundary extends React.Component<
    { fallback: React.ReactNode; children: React.ReactNode },
    { hasError: boolean }
> {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        return this.state.hasError ? this.props.fallback : this.props.children;
    }
}

function clamp<T extends string>(v: string | null, allowed: readonly T[], fallback: T): T {
    return (allowed as readonly string[]).includes(v ?? '') ? (v as T) : fallback;
}

export function LivePreviewClient({
    templateName,
    slug,
    LayoutComponent,
    fallbackDesktopImage,
    fallbackMobileImage,
}: Props) {
    const router = useRouter();
    const params = useSearchParams();

    const supportsLive = Boolean(LayoutComponent);

    const demo = React.useMemo(() => getDemoStore(slug), [slug]);

    const initialMode = clamp(
        params.get('mode'),
        ['live', 'images'] as const,
        supportsLive ? 'live' : 'images'
    );
    const initialDevice = clamp(params.get('device'), ['desktop', 'mobile'] as const, 'desktop');
    const initialView = clamp(params.get('view'), ['home', 'collection', 'product'] as const, 'home');

    const initialCategoryParam = params.get('category');
    const initialCategory =
        demo.categories.includes(initialCategoryParam ?? '') ? (initialCategoryParam as string) : demo.categories[0];

    const [mode, setMode] = React.useState<Mode>(supportsLive ? initialMode : 'images');
    const [device, setDevice] = React.useState<Device>(initialDevice);
    const [view, setView] = React.useState<View>(initialView);
    const [activeCategory, setActiveCategory] = React.useState<string>(initialCategory);

    // If a link forces mode=live but the component isn't mapped, force images.
    React.useEffect(() => {
        if (!supportsLive && mode === 'live') setMode('images');
    }, [supportsLive, mode]);

    // Keep activeCategory valid if slug changes / demo categories change.
    React.useEffect(() => {
        if (!demo.categories.includes(activeCategory)) {
            setActiveCategory(demo.categories[0] ?? 'New In');
        }
    }, [slug]);

    // Sync UI state to URL query params (shareable links)
    React.useEffect(() => {
        const qs = new URLSearchParams(params?.toString() ?? '');

        qs.set('mode', supportsLive ? mode : 'images');
        qs.set('device', device);
        qs.set('view', view);

        if (view === 'collection') qs.set('category', activeCategory);
        else qs.delete('category');

        router.replace(`?${qs.toString()}`, { scroll: false });
    }, [mode, device, view, activeCategory, supportsLive]);

    const imageSrc = device === 'desktop' ? fallbackDesktopImage : fallbackMobileImage;

    const imageFallback = (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <div className={device === 'mobile' ? 'mx-auto max-w-sm' : ''}>
                <img
                    src={imageSrc}
                    alt={`${templateName} ${device} preview`}
                    className="w-full rounded-xl border"
                />
            </div>
        </div>
    );

    const product = demo.products[0];

    const children =
        view === 'home' ? (
            <DemoHome demo={demo} />
        ) : view === 'collection' ? (
            <div>
                <div className="mx-auto max-w-6xl px-4 pt-6">
                    <div className="flex flex-wrap gap-2">
                        {demo.categories.map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setActiveCategory(c)}
                                className={cn(
                                    'rounded-full border px-3 py-1 text-sm',
                                    c === activeCategory ? 'bg-black text-white' : 'hover:bg-gray-100'
                                )}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
                <DemoCollection demo={demo} activeCategory={activeCategory} />
            </div>
        ) : (
            <DemoProductView product={product} />
        );

    return (
        <div>
            <div className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                        <div className="truncate text-sm font-medium">Preview - {templateName}</div>
                        <div className="truncate text-xs text-muted-foreground">/preview/{slug}</div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Live / Images */}
                        <div className="flex overflow-hidden rounded-lg border bg-white">
                            <button
                                type="button"
                                onClick={() => setMode('live')}
                                disabled={!supportsLive}
                                className={cn(
                                    'px-3 py-2 text-sm',
                                    mode === 'live' ? 'bg-black text-white' : 'hover:bg-gray-100',
                                    !supportsLive && 'opacity-50'
                                )}
                            >
                                Live
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode('images')}
                                className={cn(
                                    'px-3 py-2 text-sm',
                                    mode === 'images' ? 'bg-black text-white' : 'hover:bg-gray-100'
                                )}
                            >
                                Images
                            </button>
                        </div>

                        {/* Desktop / Mobile */}
                        <div className="flex overflow-hidden rounded-lg border bg-white">
                            <button
                                type="button"
                                onClick={() => setDevice('desktop')}
                                className={cn(
                                    'px-3 py-2 text-sm',
                                    device === 'desktop' ? 'bg-black text-white' : 'hover:bg-gray-100'
                                )}
                            >
                                Desktop
                            </button>
                            <button
                                type="button"
                                onClick={() => setDevice('mobile')}
                                className={cn(
                                    'px-3 py-2 text-sm',
                                    device === 'mobile' ? 'bg-black text-white' : 'hover:bg-gray-100'
                                )}
                            >
                                Mobile
                            </button>
                        </div>

                        {/* Home / Collection / Product */}
                        {mode === 'live' && supportsLive && (
                            <div className="flex overflow-hidden rounded-lg border bg-white">
                                <button
                                    type="button"
                                    onClick={() => setView('home')}
                                    className={cn(
                                        'px-3 py-2 text-sm',
                                        view === 'home' ? 'bg-black text-white' : 'hover:bg-gray-100'
                                    )}
                                >
                                    Home
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setView('collection')}
                                    className={cn(
                                        'px-3 py-2 text-sm',
                                        view === 'collection' ? 'bg-black text-white' : 'hover:bg-gray-100'
                                    )}
                                >
                                    Collection
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setView('product')}
                                    className={cn(
                                        'px-3 py-2 text-sm',
                                        view === 'product' ? 'bg-black text-white' : 'hover:bg-gray-100'
                                    )}
                                >
                                    Product
                                </button>
                            </div>
                        )}

                        <a
                            href={`/admin/control-center/templates?intent=${slug}`}
                            className="rounded-md bg-black px-3 py-2 text-sm text-white hover:opacity-90"
                        >
                            Use this template
                        </a>
                    </div>
                </div>
            </div>

            {mode === 'live' && supportsLive && LayoutComponent ? (
                <PreviewErrorBoundary fallback={imageFallback}>
                    <div className={device === 'mobile' ? 'mx-auto max-w-sm' : ''}>
                        <LayoutComponent storeName={demo.storeName} slug={demo.slug} plan={demo.plan}>
                            {children}
                        </LayoutComponent>
                    </div>
                </PreviewErrorBoundary>
            ) : (
                imageFallback
            )}
        </div>
    );
}
