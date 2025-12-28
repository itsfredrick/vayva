'use client';

import React from 'react';
import { Logo } from '@/components/Logo';
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
                <Logo size="md" showText={true} />
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
