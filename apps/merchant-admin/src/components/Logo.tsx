import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
    href?: string;
    className?: string;
}

const sizeMap = {
    sm: { width: 48, height: 48, text: 'text-lg' },
    md: { width: 64, height: 64, text: 'text-2xl' },
    lg: { width: 80, height: 80, text: 'text-3xl' },
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
                <span className={`font-bold tracking-tight text-[#0B0B0B] ${text}`}>Vayva</span>
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
