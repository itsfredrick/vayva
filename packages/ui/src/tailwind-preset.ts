import type { Config } from 'tailwindcss';
import { colors } from './tokens';

export const vayvaPreset: Config = {
    content: [],
    theme: {
        extend: {
            colors: {
                primary: colors.primary,
                background: colors.background,
                text: colors.text,
                border: colors.border,
                status: colors.status,
            },
            fontFamily: {
                sans: ['var(--font-manrope)', 'sans-serif'],
            },
            backgroundImage: {
                'glass-panel': 'linear-gradient(rgba(20, 34, 16, 0.70), rgba(20, 34, 16, 0.70))',
            },
            boxShadow: {
                'glass': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'glow': '0 0 15px rgba(70, 236, 19, 0.3)',
            },
        },
    },
    plugins: [],
};
