import { prisma } from "@vayva/db";


async function main() {
    const email = "dummy-pro@vayva.shop";
    console.log(`Ensuring dummy user for ${email}...`);

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password: "$2b$10$EpRnTzVlqHNP0.fkb//.AO.u./.u/.u/.u/.u/.u/.u/.u/.u", // Placeholder hash
            firstName: "Dummy",
            lastName: "Pro",
            isEmailVerified: true,
        },
    });

    console.log(`User ID: ${user.id}`);

    // Create a store if not exists
    const storeSlug = "dummy-pro-store";
    const existingStore = await prisma.store.findUnique({
        where: { slug: storeSlug },
    });

    if (!existingStore) {
        console.log("Creating store...");
        await prisma.store.create({
            data: {
                name: "Dummy Pro Store",
                slug: storeSlug,
                memberships: {
                    create: {
                        userId: user.id,
                        role: "owner",
                        status: "active",
                    },
                },
            },
        });
        console.log("Store created.");
    } else {
        console.log("Store already exists.");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
