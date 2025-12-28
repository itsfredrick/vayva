import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../services/auth-service/src/utils/hash';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create Merchant
    const email = 'merchant@vayva.com';
    let merchant = await prisma.user.findUnique({ where: { email } });

    if (!merchant) {
        console.log('Creating merchant...');
        const password = await hashPassword('password123');
        merchant = await prisma.user.create({
            data: {
                email,
                password,
                name: 'Demo Merchant',
            }
        });
    }

    // Create Store
    const sub = 'demo';
    let store = await prisma.store.findUnique({ where: { slug: sub } }); // Schema uses slug, not subdomain

    if (!store) {
        console.log('Creating store...');
        store = await prisma.store.create({
            data: {
                name: 'Demo Store',
                slug: sub, // Schema uses slug
                // status: 'ACTIVE', // Removed as it doesn't exist
                memberships: {
                    create: {
                        userId: merchant.id,
                        role: 'OWNER'
                    }
                }
            }
        });
    }

    // Create Products
    const productsCount = await prisma.product.count({ where: { storeId: store.id } });
    if (productsCount === 0) {
        console.log('Creating products...');
        await prisma.product.createMany({
            data: [
                {
                    storeId: store.id,
                    title: 'Premium Wireless Headphones', // Schema uses title, not name
                    handle: 'premium-wireless-headphones', // Required handle
                    description: 'High-fidelity audio with active noise cancellation.',
                    status: 'ACTIVE',
                },
                {
                    storeId: store.id,
                    title: 'Ergonomic Office Chair',
                    handle: 'ergonomic-office-chair',
                    description: 'All-day comfort with lumbar support.',
                    status: 'ACTIVE',
                },
                {
                    storeId: store.id,
                    title: 'Mechanical Keyboard',
                    handle: 'mechanical-keyboard',
                    description: 'Tactile switches for the ultimate typing experience.',
                    status: 'ACTIVE',
                }
            ]
        });

        // Add variants (prices) manually since createMany doesn't support relation creates easily this way
        const products = await prisma.product.findMany({ where: { storeId: store.id } });
        for (const p of products) {
            await prisma.variant.create({ // Model is Variant
                data: {
                    productId: p.id,
                    title: 'Standard', // Schema uses title, not name
                    price: Math.floor(Math.random() * 50000) + 10000,
                    inventory: 100 // Schema uses inventory, not stock
                }
            });
        }
    }

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
