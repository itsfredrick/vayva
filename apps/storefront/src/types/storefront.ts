export interface PublicStore {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  logoUrl?: string;
  theme: {
    primaryColor: string;
    accentColor: string;
    templateId: string;
    oneProductConfig?: any;
  };
  contact: {
    phone?: string;
    email?: string;
    whatsapp?: string;
  };
  policies: {
    shipping: string;
    returns: string;
    privacy: string;
  };
}

export interface PublicProduct {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  variants: ProductVariant[];
  inStock: boolean;
  category?: string;
  specs?: { label: string; value: string }[];
  warrantyInfo?: string;
  ingredients?: string;
  rituals?: { step: string; description: string }[];
  subscriptionOptions?: { available: boolean; frequencies: string[] };
  type?:
    | "physical"
    | "service"
    | "food"
    | "digital"
    | "ticket"
    | "course"
    | "wholesale"
    | "marketplace"
    | "donation"
    | "property";
  serviceDetails?: {
    duration: number; // minutes
    hasDeposit: boolean;
    depositAmount?: number;
  };
  modifiers?: {
    id: string;
    name: string;
    type: "choice" | "addon";
    options: { label: string; price: number }[];
  }[];
  fileDetails?: {
    fileType: string;
    fileSize: string;
    version?: string;
    downloadLimit?: number;
  };
  eventDetails?: {
    date: string;
    venue: string;
    organizer: string;
    capacity: number;
    ticketsSold: number;
    ticketTypes: {
      id: string;
      name: string;
      price: number;
      capacity?: number;
    }[];
  };
  courseDetails?: {
    level: string;
    lessons: {
      id: string;
      title: string;
      duration: string;
      isLocked: boolean;
    }[];
    instructor: { name: string; title: string; avatar: string };
    certificate: boolean;
  };
  wholesaleDetails?: {
    moq: number;
    pricingTiers: { minQty: number; price: number }[];
    leadTime: string;
  };
  vendorDetails?: {
    id: string;
    name: string;
    rating: number;
    isVerified: boolean;
    logo: string;
  };
  donationDetails?: {
    goalAmount: number;
    raisedAmount: number;
    donorCount: number;
    orgName: string;
    isRecurringAvailable: boolean;
  };
  propertyDetails?: {
    type: "apartment" | "house" | "land" | "commercial";
    purpose: "rent" | "sale" | "shortlet";
    beds?: number;
    baths?: number;
    sqm?: number;
    location: string;
    amenities: string[];
  };
  licenseType?: "standard" | "extended";
  isAvailable?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Size"
  options: string[]; // e.g. ["S", "M", "L"]
}

export interface CartItem {
  productId: string;
  variantId?: string; // composite key of selected options if complex
  quantity: number;
  price: number;
  productName: string;
  image?: string;
}

export interface PublicOrder {
  ref: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: CartItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: string;
}

export interface PublicWeek {
  id: string;
  label: { tr: string; en: string };
  deliveryDate: string;
  cutoffDate: string;
  isLocked: boolean;
}

export interface PublicMenu {
  weeks: PublicWeek[];
  meals: PublicProduct[];
}
