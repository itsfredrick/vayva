/**
 * PRODUCT SCHEMA
 * Type: Product + Offer
 */
export function getProductSchema(props: {
    baseUrl: string;
    slug: string;
    name: string;
    description: string;
    imagePath: string;
    storeName: string;
    storeSlug: string;
    sku: string;
    price: string;
    availability: 'InStock' | 'OutOfStock' | 'PreOrder';
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": `${props.baseUrl}/market/products/${props.slug}#product`,
        "name": props.name,
        "description": props.description,
        "image": [
            props.imagePath.startsWith('http') ? props.imagePath : `${props.baseUrl}${props.imagePath}`
        ],
        "brand": { "@type": "Brand", "name": props.storeName },
        "sku": props.sku,
        "offers": {
            "@type": "Offer",
            "url": `${props.baseUrl}/market/products/${props.slug}`,
            "priceCurrency": "NGN",
            "price": props.price,
            "availability": `https://schema.org/${props.availability}`,
            "seller": {
                "@type": "Organization",
                "name": props.storeName,
                "url": `${props.baseUrl}/store/${props.storeSlug}`
            }
        }
    };
}
