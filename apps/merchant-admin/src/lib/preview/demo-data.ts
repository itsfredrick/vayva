export type DemoProduct = {
    id: string;
    slug: string;
    name: string;
    price: number;
    image: string;
    description: string;
    category: string;
};

export type DemoStore = {
    storeName: string;
    slug: string;
    plan: "STARTER" | "GROWTH" | "PRO";
    categories: string[];
    products: DemoProduct[];
};

function hashString(input: string): number {
    // Simple stable hash (deterministic, fast, no deps)
    let h = 2166136261;
    for (let i = 0; i < input.length; i++) {
        h ^= input.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return Math.abs(h);
}

function pick<T>(arr: T[], idx: number): T {
    return arr[idx % arr.length];
}

export function getDemoStore(templateSlug: string): DemoStore {
    const seed = hashString(templateSlug);

    const storeNames = ["Vayva Store", "Lagos Luxe", "Abuja Essentials", "Port Harcourt Picks", "Kaduna Co."];
    const plans: DemoStore["plan"][] = ["STARTER", "GROWTH", "PRO"];

    const categories = ["New In", "Best Sellers", "Accessories", "Essentials", "Gifts"];

    // Use existing real assets if you have them; otherwise these can be placeholders.
    // You can later replace these with real product images under /public/images/demo/...
    const images = [
        "/images/template-previews/default-desktop.png",
        "/images/template-previews/default-mobile.png",
        "/images/template-previews/default-desktop.png",
        "/images/template-previews/default-mobile.png",
    ];

    const adjectives = ["Minimal", "Premium", "Classic", "Bold", "Everyday", "Urban", "Coastal"];
    const nouns = ["Tee", "Sneakers", "Backpack", "Watch", "Hoodie", "Cap", "Sunglasses", "Wallet", "Bottle"];

    const products: DemoProduct[] = Array.from({ length: 18 }).map((_, i) => {
        const cat = pick(categories, seed + i);
        const name = `${pick(adjectives, seed + i)} ${pick(nouns, seed + i * 3)}`;
        const price = 7500 + ((seed + i * 7919) % 45000);

        return {
            id: `demo-${seed}-${i}`,
            slug: `demo-product-${seed}-${i}`,
            name,
            price,
            image: pick(images, seed + i),
            description:
                "A clean, preview-safe product description. Replace with real product data when live preview supports DB-backed storefronts.",
            category: cat,
        };
    });

    return {
        storeName: pick(storeNames, seed),
        slug: "demo-store",
        plan: pick(plans, seed),
        categories,
        products,
    };
}
