"use client";

import React, { Suspense } from "react";
import { cn } from "@vayva/ui";
import { resolveLayout } from "@/lib/templates/layout-resolver";

interface TemplateMiniPreviewProps {
    layoutComponent: string; // Kept as string for now, but really is LayoutKey
    templateName: string;
    className?: string;
    componentProps?: Record<string, any>;
}

export const TemplateMiniPreview = React.memo(({
    layoutComponent,
    templateName,
    className,
    componentProps = {}
}: TemplateMiniPreviewProps) => {
    const Component = resolveLayout(layoutComponent);

    if (!Component) {
        return (
            <div className={cn("w-full aspect-[16/9] bg-gray-100 flex items-center justify-center text-gray-400 text-xs", className)}>
                {templateName}
            </div>
        );
    }

    return (
        <div className={cn("w-full aspect-[16/9] overflow-hidden relative bg-white select-none pointer-events-none", className)}>
            <Suspense fallback={
                <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center gap-2 animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="w-20 h-3 bg-gray-200 rounded" />
                </div>
            }>
                <div style={{
                    width: '400%',
                    height: '400%',
                    transform: 'scale(0.25)',
                    transformOrigin: 'top left',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zoom: 1 // For some legacy scale bugs
                }}>
                    <Component
                        storeName={templateName}
                        storeSlug="preview"
                        {...componentProps}
                    />
                </div>
            </Suspense>

            {/* Interaction Shield - extra layer of safety */}
            <div className="absolute inset-0 z-10" />
        </div>
    );
});

TemplateMiniPreview.displayName = "TemplateMiniPreview";
