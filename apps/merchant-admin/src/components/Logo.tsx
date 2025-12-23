import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
    href?: string;
    className?: string;
}

const sizeMap = {
    sm: { width: 24, height: 24, text: 'text-base' },
    md: { width: 32, height: 32, text: 'text-xl' },
    lg: { width: 40, height: 40, text: 'text-2xl' },
};

export function Logo({ size = 'md', showText = true, href = '/', className = '' }: LogoProps) {
    const { width, height, text } = sizeMap[size];

    const content = (
        <div className={`flex items-center gap-2 ${className}`}>
            <Image
                src="/vayva-logo.png"
                alt="Vayva Logo"
                width={width}
                height={height}
                className="object-contain"
                priority
            />
            {showText && (
                <span className={`font-bold tracking-tight ${text}`}>Vayva</span>
            )}
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="flex items-center">
                {content}
            </Link>
        );
    }

    return content;
}
