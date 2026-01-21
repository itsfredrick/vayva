
export interface FoodModifier {
    name: string;
    price: number;
    required?: boolean;
}

export interface FoodProductMetadata {
    isVegetarian?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
    spiceLevel?: "MILD" | "MEDIUM" | "HOT" | "EXTRA_HOT";
    prepTimeMinutes?: number;
    calories?: number;
    ingredients?: string[];
    modifiers?: FoodModifier[];
}

export interface FoodProductForm {
    name: string;
    description: string;
    price: number;
    categoryId?: string;
    imageUrl?: string;
    metadata: FoodProductMetadata;
}
