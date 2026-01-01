const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Create a demo store (Fashion)
  const storeFashion = await prisma.store.upsert({
    where: { slug: "aa-fashion-demo" },
    update: {},
    create: {
      id: "store_aa_fashion",
      name: "A&A FASHION",
      slug: "aa-fashion-demo",
      category: "Fashion",
      onboardingCompleted: true,
      onboardingStatus: "COMPLETE",
      isLive: true,
      settings: {
        theme: {
          primaryColor: "#111111",
          accentColor: "#111111",
          templateId: "vayva-aa-fashion",
        },
      },
    },
  });

  // 2. Create products for Fashion
  const fashionProducts = [
    {
      id: "p1",
      title: "Silk Midi Dress",
      price: 45000,
      description: "Elegant silk midi dress suitable for evening outings.",
      handle: "silk-midi-dress",
      status: "PUBLISHED",
      images: [
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop",
      ],
    },
    {
      id: "p2",
      title: "Linen Two-Piece Set",
      price: 35000,
      description: "Breathable linen set, perfect for summer.",
      handle: "linen-set",
      status: "PUBLISHED",
      images: [
        "https://images.unsplash.com/photo-1515347619252-60a4bd4eff4f?w=800&auto=format&fit=crop",
      ],
    },
  ];

  // Create Default Location for Fashion
  const fashionLocation = await prisma.inventoryLocation.upsert({
    where: { id: "loc_aa_fashion" }, // Assuming ID is predictable or we just create it
    update: {},
    create: {
      id: "loc_aa_fashion",
      storeId: storeFashion.id,
      name: "Main Warehouse",
      isDefault: true,
    },
  });

  for (const p of fashionProducts) {
    const { images, ...pData } = p;
    const product = await prisma.product.upsert({
      where: { id: p.id },
      update: { ...pData, storeId: storeFashion.id },
      create: { ...pData, storeId: storeFashion.id },
    });

    // Create Default Variant & Inventory
    await prisma.productVariant.create({
      data: {
        productId: product.id,
        title: "Default Title",
        options: {},
        price: p.price,
        trackInventory: true,
        InventoryItem: {
          create: {
            available: 50,
            InventoryLocation: {
              connect: { id: fashionLocation.id },
            },
            Product: {
              connect: { id: product.id },
            },
          },
        },
      },
    });

    for (let i = 0; i < images.length; i++) {
      const url = images[i];
      await prisma.productImage.upsert({
        where: { id: `${product.id}_img_${i}` },
        update: { url },
        create: {
          id: `${product.id}_img_${i}`,
          productId: product.id,
          url,
          position: i,
        },
      });
    }
  }

  // 3. Create ChopNow Store (Food)
  const storeFood = await prisma.store.upsert({
    where: { slug: "chopnow-demo" },
    update: {},
    create: {
      id: "store_chopnow",
      name: "ChopNow",
      slug: "chopnow-demo",
      category: "Food",
      onboardingCompleted: true,
      onboardingStatus: "COMPLETE",
      isLive: true,
      settings: {
        theme: {
          primaryColor: "#FF5722",
          accentColor: "#FF5722",
          templateId: "vayva-chopnow",
        },
      },
    },
  });

  // 4. Create Food Products (Meals) with Tags for metadata
  const foodProducts = [
    {
      id: "m1",
      title: "Italian Meatball Pasta",
      price: 350,
      description: "With basil tomato sauce. Italian Usulü Köfteli Makarna.",
      handle: "kofteli-makarna",
      status: "PUBLISHED",
      images: [
        "https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&q=80&w=800",
      ],
      tags: [
        "prepTime:25",
        "kcal:650",
        "protein:28",
        "category:Aile",
        "allergen:Gluten",
        "allergen:Yumurta",
      ],
    },
    {
      id: "m2",
      title: "Chicken Skewers with Veggies",
      price: 280,
      description: "Side of bulgur pilaf. Sebzeli Tavuk Şiş.",
      handle: "tavuk-sis",
      status: "PUBLISHED",
      images: [
        "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&q=80&w=800",
      ],
      tags: ["prepTime:30", "kcal:450", "protein:42", "category:Fit"],
    },
    {
      id: "m3",
      title: "Anatolian Lentil Soup",
      price: 150,
      description: "With croutons. Anadolu Mercimek Çorbası.",
      handle: "mercimek-corbasi",
      status: "PUBLISHED",
      images: [
        "https://images.unsplash.com/photo-1547592166-23acbe32227d?auto=format&fit=crop&q=80&w=800",
      ],
      tags: [
        "prepTime:15",
        "kcal:320",
        "protein:12",
        "category:Hızlı",
        "allergen:Gluten",
      ],
    },
    {
      id: "m4",
      title: "Grilled Salmon",
      price: 550,
      description: "With asparagus and potatoes. Izgara Somon.",
      handle: "izgara-somon",
      status: "PUBLISHED",
      images: [
        "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&q=80&w=800",
      ],
      tags: [
        "prepTime:25",
        "kcal:580",
        "protein:35",
        "category:Premium",
        "isPro:true",
        "allergen:Balık",
      ],
    },
  ];

  // Create Default Location for Food
  const foodLocation = await prisma.inventoryLocation.upsert({
    where: { id: "loc_chopnow" },
    update: {},
    create: {
      id: "loc_chopnow",
      storeId: storeFood.id,
      name: "Kitchen",
      isDefault: true,
    },
  });

  for (const p of foodProducts) {
    const { images, ...pData } = p;
    const product = await prisma.product.upsert({
      where: { id: p.id },
      update: { ...pData, storeId: storeFood.id },
      create: { ...pData, storeId: storeFood.id },
    });

    // Create Default Variant & Inventory for tracking
    const variant = await prisma.productVariant.create({
      data: {
        productId: product.id,
        title: "Default Title",
        options: {},
        price: p.price,
        trackInventory: true,
        InventoryItem: {
          create: {
            available: 100,
            InventoryLocation: {
              connect: { id: foodLocation.id },
            },
            Product: {
              connect: { id: product.id },
            },
          },
        },
      },
    });

    for (let i = 0; i < images.length; i++) {
      const url = images[i];
      await prisma.productImage.upsert({
        where: { id: `${product.id}_img_${i}` },
        update: { url },
        create: {
          id: `${product.id}_img_${i}`,
          productId: product.id,
          url,
          position: i,
        },
      });
    }
  }

  // 5. Create Collections as Weeks
  // Using handle to store dates: week-STARTDATE-ENDDATE
  const weeks = [
    {
      id: "w0",
      title: "Dec 21 - 27",
      handle: "week-2025-12-21",
      storeId: storeFood.id,
    },
    {
      id: "w1",
      title: "Dec 28 - Jan 3",
      handle: "week-2025-12-28",
      storeId: storeFood.id,
    },
  ];

  for (const w of weeks) {
    const col = await prisma.collection.upsert({
      where: { storeId_handle: { storeId: w.storeId, handle: w.handle } },
      update: { title: w.title },
      create: { ...w },
    });

    // Add all products to these weeks for demo purposes
    for (const p of foodProducts) {
      await prisma.collectionProduct.upsert({
        where: {
          collectionId_productId: { collectionId: col.id, productId: p.id },
        },
        update: {},
        create: { collectionId: col.id, productId: p.id },
      });
    }
  }

  // 6. Subscriptions
  const plan = await prisma.aiPlan.upsert({
    where: { name: "STARTER" },
    update: {},
    create: {
      name: "STARTER",
      monthlyTokenLimit: 100000,
      monthlyImageLimit: 50,
      monthlyRequestLimit: 20,
    },
  });

  await prisma.merchantAiSubscription.upsert({
    where: { storeId: storeFashion.id },
    update: {},
    create: {
      storeId: storeFashion.id,
      planId: plan.id,
      planKey: "STARTER",
      periodStart: new Date(),
      periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      trialExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "TRIAL_ACTIVE",
    },
  });

  // 7. Create Orders for ChopNow
  for (let i = 1; i <= 3; i++) {
    const order = await prisma.order.upsert({
      where: { id: `fs_order_${i}` },
      update: {},
      create: {
        id: `fs_order_${i}`,
        storeId: storeFood.id,
        refCode: `FS-REF-${i}`,
        orderNumber: `DLV-${1000 + i}`,
        subtotal: 500 * i,
        total: 500 * i,
        status: "DELIVERED",
        paymentStatus: "SUCCESS",
        customerEmail: `customer${i}@example.com`,
        customerPhone: `+23480000000${i}`,
        createdAt: new Date(Date.now() - i * 86400000 * 7), // Past weeks
        fulfillmentStatus: "DELIVERED",
      },
    });

    // Add 2 random items per order
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: foodProducts[0].id,
        title: foodProducts[0].title,
        price: foodProducts[0].price,
        quantity: 1,
      },
    });
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: foodProducts[1].id,
        title: foodProducts[1].title,
        price: foodProducts[1].price,
        quantity: 2,
      },
    });
  }

  // 8. Create Notifications
  await prisma.notification.createMany({
    data: [
      {
        storeId: storeFashion.id,
        type: "ORDER",
        title: "Order #VV-1024 paid — ₦45,000",
        body: "New order received.",
        severity: "info",
        category: "order",
        createdAt: new Date(Date.now() - 5 * 60000), // 5m ago
      },
      {
        storeId: storeFashion.id,
        type: "AI",
        title: "WhatsApp AI needs approval",
        body: "Confirm delivery window for Order #VV-1024",
        severity: "warning",
        category: "ai",
        createdAt: new Date(Date.now() - 2 * 3600000), // 2h ago
      },
      {
        storeId: storeFashion.id,
        type: "PAYMENT",
        title: "Payout sent to GTBank — ₦120,500",
        body: "Funds transferred successfully.",
        severity: "success",
        category: "finance",
        isRead: true,
        readAt: new Date(),
        createdAt: new Date(Date.now() - 24 * 3600000), // 1d ago
      },
    ],
  });

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
