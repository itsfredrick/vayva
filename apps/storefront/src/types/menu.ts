export interface MealTags {
  prepTime: number; // minutes
  kcal: number;
  protein: number; // grams
  category?: string; // "Hızlı", "Fit", etc.
}

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Meal {
  id: string;
  slug: string;
  title: { [lang: string]: string }; // Localized title
  subtitle?: { [lang: string]: string };
  image: string;
  tags: MealTags;
  isPro?: boolean;
  allergens: string[];
  ingredients: Ingredient[];
}

export interface Week {
  id: string;
  label: { [lang: string]: string }; // e.g. "Paz 21 Ara"
  deliveryDate: string; // ISO Date
  cutoffDate: string; // ISO Date string
  isLocked: boolean; // Computed on client mostly, but can be forced
}

export interface PlanConfig {
  mealsPerWeek: number;
  servings: number;
}

export interface Delivery {
  id: string;
  date: string; // ISO Date
  mealIds: string[];
  isDelivered: boolean;
}
