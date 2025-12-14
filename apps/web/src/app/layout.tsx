import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
    subsets: ['latin'],
    variable: '--font-manrope',
});

export const metadata: Metadata = {
    title: 'Vayva Admin',
    description: 'Seller Dashboard',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            </head>
            <body className={`${manrope.variable} font-sans bg-background-dark text-text-primary antialiased`}>
                {children}
            </body>
        </html>
    );
}
