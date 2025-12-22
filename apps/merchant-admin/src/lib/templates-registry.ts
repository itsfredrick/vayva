export interface TemplateDefinition {
    id: string;
    name: string;
    description: string;
    thumbnailUrl: string;
    tags: string[];
    isPremium: boolean;
    features: string[];
    colors: { background: string; text: string };
}

export const TEMPLATES: TemplateDefinition[] = [
    {
        id: 'vayya-storefront',
        name: 'Vayya Storefront',
        description: 'The default high-converting storefront designed for modern retail.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2670&auto=format&fit=crop', // Placeholder
        tags: ['Default', 'Retail', 'Modern'],
        isPremium: false,
        features: ['Optimized Checkout', 'Mobile First', 'Fast Loading'],
        colors: { background: '#ffffff', text: '#000000' }
    },
    {
        id: 'minimal-boutique',
        name: 'Minimal Boutique',
        description: 'Clean lines and focus on product photography.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2670&auto=format&fit=crop',
        tags: ['Fashion', 'Minimal'],
        isPremium: false,
        features: ['Large Imagery', 'Editorial Layout'],
        colors: { background: '#f5f5f5', text: '#333333' }
    },
    {
        id: 'tech-gadgets',
        name: 'Tech & Gadgets',
        description: 'Dark mode optimization for electronics and accessories.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2701&auto=format&fit=crop',
        tags: ['Electronics', 'Dark Mode'],
        isPremium: false,
        features: ['Tech Specs Table', 'Compare Products'],
        colors: { background: '#111111', text: '#eeeeee' }
    },
    {
        id: 'fresh-market',
        name: 'Fresh Market',
        description: 'Grids perfectly suited for groceries and multiple SKUs.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop',
        tags: ['Groceries', 'Food'],
        isPremium: true,
        features: ['Quick Add to Cart', 'Category Filtering'],
        colors: { background: '#e8f5e9', text: '#2e7d32' }
    },
    {
        id: 'beauty-glow',
        name: 'Beauty Glow',
        description: 'Soft palettes and video integration for beauty brands.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=2574&auto=format&fit=crop',
        tags: ['Beauty', 'Video'],
        isPremium: true,
        features: ['Video Backgrounds', 'Instagram Feed'],
        colors: { background: '#fff0f5', text: '#c2185b' }
    }
];
