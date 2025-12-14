import React from 'react';

// Using a simplified icon wrapper for Material Symbols
export const Icon = ({ name, className = '', size = 24 }: { name: string; className?: string; size?: number }) => {
    return (
        <span
            className={`material-symbols-outlined ${className}`}
            style={{ fontSize: `${size}px` }}
        >
            {name}
        </span>
    );
};
