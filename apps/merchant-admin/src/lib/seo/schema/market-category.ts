/**
 * MARKET CATEGORY SCHEMA
 * Type: CollectionPage + ItemList
 */
export function getMarketCategorySchema(props: {
    baseUrl: string;
    slug: string;
    name: string;
    description: string;
    storeCount: number;
    items?: { name: string; url: string }[];
}) {
    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${props.baseUrl}/market/categories/${props.slug}#collection`,
        "name": `${props.name} Stores on Vayva`,
        "description": props.description,
        "url": `${props.baseUrl}/market/categories/${props.slug}`,
        "mainEntity": {
            "@type": "ItemList",
            "itemListOrder": "https://schema.org/ItemListOrderDescending",
            "numberOfItems": props.storeCount.toString(),
            "itemListElement": (props.items || []).map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.name,
                "url": item.url.startsWith('http') ? item.url : `${props.baseUrl}${item.url}`
            }))
        }
    };
}
