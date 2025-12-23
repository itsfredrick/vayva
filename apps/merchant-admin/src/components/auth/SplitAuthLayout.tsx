'use client';

import React from 'react';
import Image from 'next/image';
import { AuthLeftPanel } from './AuthLeftPanel';
import { AuthRightPanel } from './AuthRightPanel';

interface SplitAuthLayoutProps {
    children: React.ReactNode;
    stepIndicator?: string;
    title: string;
    subtitle?: string;
    showSignInLink?: boolean;
    showSignUpLink?: boolean;
}

export const SplitAuthLayout = ({
    children,
    stepIndicator,
    title,
    subtitle,
    showSignInLink,
    showSignUpLink,
}: SplitAuthLayoutProps) => {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Panel - Hidden on mobile, shows as sidebar on desktop */}
            <AuthLeftPanel
                showSignInLink={showSignInLink}
                showSignUpLink={showSignUpLink}
            />

            {/* Mobile header - Only visible on mobile */}
            <div className="lg:hidden bg-[#F8F9FA] p-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <Image
                        src="/vayva-logo.png"
                        alt="Vayva"
                        width={64}
                        height={64}
                        className="object-contain"
                    />
                    <span className="text-lg font-heading font-bold text-black">Vayva</span>
                </div>
            </div>

            {/* Right Panel - Form area */}
            <AuthRightPanel
                stepIndicator={stepIndicator}
                title={title}
                subtitle={subtitle}
            >
                {children}
            </AuthRightPanel>
        </div>
    );
};
