import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Determine template type basic on ID convention or random for now
  // In real app, this would look up the template metadata
  const isFood = id.includes("culinary") || id.includes("food");
  const isService = id.includes("service") || id.includes("booking");
  const isRetail = !isFood && !isService;

  const baseContext = {
    templateId: id,
    engine: "vayva-storefront-v1",
    currency: "NGN",
    theme: {
      colors: {
        primary: "#000000",
        secondary: "#ffffff",
        accent: isFood ? "#f59e0b" : isService ? "#8b5cf6" : "#3b82f6",
      },
      fonts: {
        heading: "Inter",
        body: "Inter",
      },
    },
    supportedDevices: ["desktop", "mobile"],
  };

  let demoData;

  if (isFood) {
    demoData = {
      businessName: "Mama's Kitchen",
      hero: {
        title: "Authentic Nigerian Cuisine",
        subtitle: "Delivered fresh to your doorstep.",
        image:
          "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=2070&auto=format&fit=crop",
      },
      categories: [
        { id: "c1", name: "Main Dishes" },
        { id: "c2", name: "Soups" },
        { id: "c3", name: "Sides" },
      ],
      products: [
        {
          id: "p1",
          name: "Jollof Rice Special",
          price: 2500,
          image:
            "https://images.unsplash.com/photo-1623961990059-28356e226a77?q=80&w=2071&auto=format&fit=crop",
          category: "c1",
        },
        {
          id: "p2",
          name: "Egusi Soup",
          price: 3000,
          image:
            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
          category: "c2",
        },
        {
          id: "p3",
          name: "Fried Plantain",
          price: 800,
          image:
            "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?q=80&w=2069&auto=format&fit=crop",
          category: "c3",
        },
      ],
    };
  } else if (isService) {
    demoData = {
      businessName: "Luxe Salon",
      hero: {
        title: "Look Good, Feel Good",
        subtitle: "Premium beauty services for everyone.",
        image:
          "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974&auto=format&fit=crop",
      },
      services: [
        {
          id: "s1",
          name: "Haircut & Style",
          price: 5000,
          duration: 60,
          image:
            "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2069&auto=format&fit=crop",
        },
        {
          id: "s2",
          name: "Manicure",
          price: 3000,
          duration: 45,
          image:
            "https://images.unsplash.com/photo-1632345031635-c6370f381f21?q=80&w=2070&auto=format&fit=crop",
        },
        {
          id: "s3",
          name: "Facial Treatment",
          price: 15000,
          duration: 90,
          image:
            "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop",
        },
      ],
    };
  } else {
    // Retail
    demoData = {
      businessName: "Urban Threads",
      hero: {
        title: "New Summer Collection",
        subtitle: "Minimalist styles for everyday wear.",
        image:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
      },
      products: [
        {
          id: "p1",
          name: "Classic White Tee",
          price: 5000,
          image:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop",
        },
        {
          id: "p2",
          name: "Denim Jacket",
          price: 12500,
          image:
            "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop",
        },
        {
          id: "p3",
          name: "Canvas Sneakers",
          price: 18000,
          image:
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1964&auto=format&fit=crop",
        },
        {
          id: "p4",
          name: "Leather Bag",
          price: 25000,
          image:
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop",
        },
      ],
    };
  }

  return NextResponse.json({
    ...baseContext,
    demoData,
  });
}
