export type StorefrontTheme = "minimal" | "bold" | "premium";

export type StorefrontId = "retail" | "food" | "services" | "wholesale";

export type MicroTemplateId =
  // Retail
  | "retail_fashion"
  | "retail_electronics"
  | "retail_home"
  // Food
  | "food_restaurant"
  | "food_bakery"
  | "food_catering"
  // Services
  | "service_salon"
  | "service_professional"
  | "service_mechanic";

export interface StorefrontBranding {
  color: string; // Primary accent color
  logo?: string; // URL
  font?: string; // Font family class
}

export interface StorefrontProductVariant {
  name: string; // e.g. "Size", "Color"
  options: string[]; // e.g. ["S", "M", "L"]
}

export interface StorefrontProduct {
  id: number;
  name: string;
  price: number;
  image: string; // icon name or url
  tag: string | null;
  description?: string;
  stock?: "In Stock" | "Low Stock" | "Out of Stock";
  variants?: StorefrontProductVariant[];
  modifiers?: {
    name: string; // e.g. "Extras"
    type: "single" | "multiple"; // Radio vs Checkbox
    options: { label: string; price: number }[];
  }[];
  gallery?: string[]; // Additional images

  // Service Specific
  duration?: string; // e.g. "30 min", "1 hr"
  paymentRule?: "pay_to_confirm" | "pay_after" | "deposit";
  included?: string[]; // List of what's included
}

// Union type for all content possibilities
export type StorefrontItem = StorefrontProduct | any;

export interface StorefrontContent {
  headline: string;
  subtext: string;
  ctaPrimary: string;
  ctaSecondary?: string;
  products?: StorefrontProduct[];
  menu?: any[]; // Keeping generic for now
  services?: any[]; // Keeping generic for now
}

export interface StorefrontConfig {
  templateId: StorefrontId;
  microTemplateId: MicroTemplateId;
  theme: StorefrontTheme;
  branding: StorefrontBranding;
  content: StorefrontContent;
}
