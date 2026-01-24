// Basic Pending for CSV Parsing
// Helper to parse currency "₦ 25,000" -> 25000
// Helper to validate rows
export function parseCurrency(input: any) {
    if (typeof input === "number")
        return input;
    if (!input)
        return null;
    // Remove non-digits and dots
    const cleaned = input.replace(/[^\d.]/g, "");
    const val = parseFloat(cleaned);
    return isNaN(val) ? null : val;
}
export function validateRow(row: any) {
    const errors = [];
    // Required Fields
    if (!row.Name && !row.name)
        errors.push("Name is required");
    const priceRaw = row.Price || row.price || row.price_ngn || row["Price (NGN)"];
    const price = parseCurrency(priceRaw);
    if (price === null)
        errors.push("Price is required and must be a number");
    const stockRaw = row.Stock || row.stock || row.quantity;
    const stock = stockRaw ? parseInt(stockRaw) : undefined;
    if (stock !== undefined && (isNaN(stock) || stock < 0))
        errors.push("Stock must be a non-negative integer");
    const imagesRaw = row.Images || row.images || row["Image URL"];
    const images = imagesRaw
        ? imagesRaw
            .split(",")
            .map((s: any) => s.trim())
            .filter((s: any) => s.startsWith("http"))
        : [];
    if (errors.length > 0) {
        return { valid: false, errors, row: null };
    }
    return {
        valid: true,
        errors: [],
        row: {
            name: row.Name || row.name,
            price: price,
            description: row.Description || row.description,
            sku: row.SKU || row.sku,
            stock,
            images,
            category: row.Category || row.category,
        },
    };
}
