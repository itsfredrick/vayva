import {
  MicroTemplateId,
  StorefrontConfig,
  StorefrontId,
  StorefrontTheme,
} from "@/types/storefront";

export const MICRO_TEMPLATES: Record<
  MicroTemplateId,
  {
    name: string;
    description: string;
    defaultContent: any;
  }
> = {
  // RETAIL
  retail_fashion: {
    name: "Fashion & Apparel",
    description: "Visual-first layout for clothing brands.",
    defaultContent: {
      headline: "Shop quality products with ease",
      subtext: "Browse our collection and order directly on WhatsApp.",
      ctaPrimary: "Shop on WhatsApp",
      ctaSecondary: "View Products",
      products: [
        {
          id: 1,
          name: "Cotton T-Shirt",
          price: 5000,
          image: "shirt",
          tag: "New",
          stock: "In Stock",
          description:
            "A premium quality cotton t-shirt designed for everyday comfort. Breathable fabric with a modern fit.",
          variants: [
            { name: "Size", options: ["S", "M", "L", "XL"] },
            { name: "Color", options: ["White", "Black", "Navy"] },
          ],
        },
        {
          id: 2,
          name: "Denim Jeans",
          price: 12000,
          image: "shopping_bag",
          tag: null,
          stock: "In Stock",
          description:
            "Classic straight-cut denim jeans. Durable, stylish, and perfect for casual outings.",
          variants: [{ name: "Waist", options: ["30", "32", "34", "36"] }],
        },
        {
          id: 3,
          name: "Running Sneakers",
          price: 25000,
          image: "footprints",
          tag: "Bestseller",
          stock: "Low Stock",
          description:
            "High-performance running shoes with impact absorption technology.",
          variants: [{ name: "Size", options: ["40", "41", "42", "43", "44"] }],
        },
        {
          id: 4,
          name: "Summer Hat",
          price: 3500,
          image: "sun",
          tag: null,
          stock: "In Stock",
          description:
            "Wide-brimmed summer hat to keep you cool and stylish under the sun.",
          variants: [],
        },
        {
          id: 5,
          name: "Leather Belt",
          price: 4000,
          image: "circle",
          tag: null,
          stock: "In Stock",
          description: "Genuine leather belt with a classic metal buckle.",
          variants: [{ name: "Length", options: ["90cm", "100cm", "110cm"] }],
        },
        {
          id: 6,
          name: "Wristwatch",
          price: 15000,
          image: "watch",
          tag: "Sale",
          stock: "Out of Stock",
          description: "Minimalist analog wristwatch with a leather strap.",
          variants: [{ name: "Strap Color", options: ["Brown", "Black"] }],
        },
      ],
    },
  },
  retail_electronics: {
    name: "Electronics & Gadgets",
    description: "Spec-focused layout for tech stores.",
    defaultContent: {
      headline: "Shop quality products with ease",
      subtext: "Browse our collection and order directly on WhatsApp.",
      ctaPrimary: "Shop on WhatsApp",
      ctaSecondary: "View Products",
      products: [
        {
          id: 1,
          name: "Wireless Earbuds",
          price: 15000,
          image: "headphones",
          tag: "Top Rated",
        },
        { id: 2, name: "Smart Watch", price: 25000, image: "watch", tag: null },
        {
          id: 3,
          name: "Bluetooth Speaker",
          price: 10000,
          image: "speaker",
          tag: "Sale",
        },
        {
          id: 4,
          name: "Power Bank 20k",
          price: 12000,
          image: "battery-charging",
          tag: null,
        },
        { id: 5, name: "USB-C Cable", price: 2000, image: "cable", tag: null },
        {
          id: 6,
          name: "Phone Stand",
          price: 3000,
          image: "smartphone",
          tag: null,
        },
      ],
    },
  },
  retail_home: {
    name: "Home & Living",
    description: "Warm, cozy layout for furniture and decor.",
    defaultContent: {
      headline: "Shop quality products with ease",
      subtext: "Browse our collection and order directly on WhatsApp.",
      ctaPrimary: "Shop on WhatsApp",
      ctaSecondary: "View Products",
      products: [
        {
          id: 1,
          name: "Ceramic Vase",
          price: 8000,
          image: "coffee",
          tag: null,
        },
        { id: 2, name: "Throw Pillow", price: 4500, image: "sofa", tag: "New" },
        { id: 3, name: "Table Lamp", price: 12000, image: "lamp", tag: null },
        { id: 4, name: "Wall Clock", price: 6000, image: "clock", tag: null },
        { id: 5, name: "Plant Pot", price: 3000, image: "flower", tag: null },
        { id: 6, name: "Area Rug", price: 25000, image: "layers", tag: "Sale" },
      ],
    },
  },

  // FOOD
  food_restaurant: {
    name: "Restaurant / Fast Food",
    description: "High-energy layout with food photography.",
    defaultContent: {
      headline: "Fresh meals, made daily",
      subtext: "Order directly from our menu on WhatsApp.",
      ctaPrimary: "Order Now",
      menu: [
        // Starters
        {
          id: 1,
          name: "Spring Rolls",
          price: 1500,
          desc: "Crispy vegetable rolls (2pcs).",
          cat: "Starters",
        },
        {
          id: 2,
          name: "Chicken Wings",
          price: 3000,
          desc: "Spicy bbq wings (4pcs).",
          cat: "Starters",
        },
        // Mains
        {
          id: 3,
          name: "Jollof Rice & Chicken",
          price: 4500,
          desc: "Classic smokey jollof with fried chicken.",
          cat: "Main Dishes",
          modifiers: [
            {
              name: "Protein Choice",
              type: "single",
              options: [
                { label: "Fried Chicken", price: 0 },
                { label: "Grilled Turkey", price: 1000 },
                { label: "Beef", price: 500 },
              ],
            },
            {
              name: "Extras",
              type: "multiple",
              options: [
                { label: "Extra Plantain", price: 500 },
                { label: "Coleslaw", price: 800 },
                { label: "Moi Moi", price: 1000 },
              ],
            },
          ],
        },
        {
          id: 4,
          name: "Fried Rice & Beef",
          price: 5000,
          desc: "Stir-fry rice with tender beef strips.",
          cat: "Main Dishes",
          modifiers: [
            {
              name: "Spiciness",
              type: "single",
              options: [
                { label: "Mild", price: 0 },
                { label: "Spicy", price: 0 },
                { label: "Extra Hot", price: 0 },
              ],
            },
          ],
        },
        // Sides
        {
          id: 5,
          name: "Coleslaw",
          price: 800,
          desc: "Fresh creamy slaw.",
          cat: "Sides",
        },
        {
          id: 6,
          name: "Plantain",
          price: 1000,
          desc: "Sweet fried plantain.",
          cat: "Sides",
        },
        // Drinks
        {
          id: 7,
          name: "Coke (50cl)",
          price: 500,
          desc: "Chilled bottle.",
          cat: "Drinks",
        },
      ],
    },
  },
  food_bakery: {
    name: "Bakery / Home Chef",
    description: "Warm, artisan feel for baked goods.",
    defaultContent: {
      headline: "Fresh meals, made daily",
      subtext: "Order directly from our menu on WhatsApp.",
      ctaPrimary: "Order Now",
      menu: [
        {
          id: 1,
          name: "Meat Pie",
          price: 800,
          desc: "Rich minced meat filling.",
          cat: "Pastries",
        },
        {
          id: 2,
          name: "Chicken Pie",
          price: 1000,
          desc: "Creamy chicken filling.",
          cat: "Pastries",
        },
        {
          id: 3,
          name: "Sourdough Loaf",
          price: 3500,
          desc: "Fermented for 48 hours.",
          cat: "Bread",
        },
        {
          id: 4,
          name: "Banana Bread",
          price: 2500,
          desc: "Moist and sweet.",
          cat: "Cakes",
        },
        {
          id: 5,
          name: "Chocolate Cake",
          price: 8000,
          desc: "6-inch decadent cake.",
          cat: "Cakes",
        },
      ],
    },
  },
  food_catering: {
    name: "Catering & Events",
    description: "Bulk ordering and event focused.",
    defaultContent: {
      headline: "Fresh meals, made daily",
      subtext: "Order directly from our menu on WhatsApp.",
      ctaPrimary: "Book Catering",
      menu: [
        {
          id: 1,
          name: "Wedding Platter",
          price: 150000,
          desc: "Serves 50 guests. Rice, Protein, Salad.",
          cat: "Packages",
        },
        {
          id: 2,
          name: "Corporate Lunch",
          price: 85000,
          desc: "Serves 20 guests. Individual packs.",
          cat: "Packages",
        },
        {
          id: 3,
          name: "Party Chops",
          price: 45000,
          desc: "Assorted finger foods tray.",
          cat: "Trays",
        },
        {
          id: 4,
          name: "Zobo Gallon",
          price: 5000,
          desc: "5 Litres fresh zobo.",
          cat: "Drinks",
        },
      ],
    },
  },

  // SERVICES
  service_salon: {
    name: "Salon & Beauty",
    description: "Elegant layout for beauty professionals.",
    defaultContent: {
      headline: "Professional beauty services",
      subtext: "Book your appointment easily via WhatsApp.",
      ctaPrimary: "Book Appointment",
      services: [
        {
          id: 1,
          name: "Braids (Waist Length)",
          price: 15000,
          duration: "4 hrs",
          paymentRule: "deposit",
          description:
            "Neat and long-lasting box braids. Price includes hair extensions.",
          included: ["Hair Extensions", "Wash & Condition", "Styling"],
        },
        {
          id: 2,
          name: "Wash & Set",
          price: 5000,
          duration: "1 hr",
          paymentRule: "pay_after",
          description: "Deep cleansing wash and professional setting.",
          included: ["Deep Condition", "Scalp Massage"],
        },
        {
          id: 3,
          name: "Full Glam Makeup",
          price: 25000,
          duration: "1.5 hrs",
          paymentRule: "pay_to_confirm",
          description: "Perfect for weddings, photoshoots, and special events.",
          included: ["Lashes", "Contour", "Long-wear Setting"],
        },
      ],
    },
  },
  service_professional: {
    name: "Professional / Consultant",
    description: "Trust-building layout for experts.",
    defaultContent: {
      headline: "Expert consultation for your business",
      subtext: "Book a strategy session to grow your vision.",
      ctaPrimary: "Schedule Session",
      services: [
        {
          id: 1,
          name: "Strategy Session",
          price: 50000,
          duration: "1 hr",
          paymentRule: "pay_to_confirm",
          description:
            "Intensive 1-on-1 strategy call to solve your biggest blockers.",
          included: ["Recording", "Action Plan PDF"],
        },
        {
          id: 2,
          name: "Document Review",
          price: 25000,
          duration: "3 days",
          paymentRule: "pay_to_confirm",
          description:
            "Comprehensive review of your legal or business documents.",
          included: ["Redline Edits", "Feedback Call"],
        },
      ],
    },
  },
  service_mechanic: {
    name: "Mechanic / Repair",
    description: "Problem-solving layout for trades.",
    defaultContent: {
      headline: "Reliable auto repair services",
      subtext: "Fast, transparent, and professional repairs.",
      ctaPrimary: "Book Repair",
      services: [
        {
          id: 1,
          name: "Full Service",
          price: 15000,
          duration: "2 hrs",
          paymentRule: "pay_after",
          description: "Complete vehicle checkup including oil change.",
          included: [
            "Oil Change",
            "Filter Replacement",
            "Fluid Top-up",
            "Brake Check",
          ],
        },
        {
          id: 2,
          name: "Diagnostics",
          price: 5000,
          duration: "30 min",
          paymentRule: "pay_after",
          description:
            "Advanced computer diagnostics to identify engine faults.",
          included: ["Error Code Report", "Repair Estimate"],
        },
      ],
    },
  },
};

export const getDefaultConfig = (
  templateId: StorefrontId,
): StorefrontConfig => {
  let microId: MicroTemplateId = "retail_fashion";
  if (templateId === "food") microId = "food_restaurant";
  if (templateId === "services") microId = "service_salon";

  return {
    templateId,
    microTemplateId: microId,
    theme: "minimal",
    branding: { color: "#000000" },
    content: MICRO_TEMPLATES[microId].defaultContent,
  };
};
