import React from "react";

export default function OpsAuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // A1: Full viewport background
    // A simple neutral or dark gradient. Using dark per "Ops" theme.
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
            {children}
        </div>
    );
}
