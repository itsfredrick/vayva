import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database with test users...\n');

    // Create test stores
    console.log('📦 Creating test stores...');

    // AI Plans
    console.log('🤖 Creating AI Plans...');
    const starterPlan = await prisma.aiPlan.upsert({
        where: { name: 'STARTER' },
        update: {},
        create: {
            name: 'STARTER',
            monthlyTokenLimit: 100000,
            monthlyImageLimit: 50,
            monthlyRequestLimit: 20,
            features: { support: 'standard', models: ['llama-3.1-70b'] }
        }
    });

    const growthPlan = await prisma.aiPlan.upsert({
        where: { name: 'GROWTH' },
        update: {},
        create: {
            name: 'GROWTH',
            monthlyTokenLimit: 5000000,
            monthlyImageLimit: 500,
            monthlyRequestLimit: 2000,
            features: { support: 'priority', models: ['llama-3.1-70b', 'vision-match'] }
        }
    });

    const proPlan = await prisma.aiPlan.upsert({
        where: { name: 'PRO' },
        update: {},
        create: {
            name: 'PRO',
            monthlyTokenLimit: 25000000,
            monthlyImageLimit: 2000,
            monthlyRequestLimit: 10000,
            features: { support: '24/7', models: ['llama-3.1-70b', 'vision-match', 'advanced-persuasion'] }
        }
    });
    console.log('✓ Created AI Plans (Starter, Growth, Pro)\n');

    // Support SLA Policies
    console.log('⏳ Creating Support SLA Policies...');
    const slaPolicies = [
        { plan: 'STARTER', category: 'DEFAULT', responseTimeMinutes: 1440, resolutionTimeMinutes: 2880 }, // 24h / 48h
        { plan: 'GROWTH', category: 'DEFAULT', responseTimeMinutes: 360, resolutionTimeMinutes: 1440 },  // 6h / 24h
        { plan: 'PRO', category: 'DEFAULT', responseTimeMinutes: 60, resolutionTimeMinutes: 720 },      // 1h / 12h
        { plan: 'PRO', category: 'URGENT', responseTimeMinutes: 15, resolutionTimeMinutes: 240 },      // 15m / 4h
    ];

    for (const policy of slaPolicies) {
        await prisma.supportSlaPolicy.create({ data: policy });
    }
    console.log('✓ Created 4 SLA Policies\n');

    // Create test stores
    console.log('📦 Creating test stores...');

    const store1 = await prisma.store.upsert({
        where: { id: 'store_test_1' },
        update: {},
        create: {
            id: 'store_test_1',
            name: 'Demo Food Store',
            slug: 'demo-food',
            category: 'food',
            contacts: {
                email: 'demo@vayva.ng',
                phone: '+2348012345678',
            },
            settings: {
                currency: 'NGN',
                timezone: 'Africa/Lagos',
            },
            plan: 'GROWTH',
            onboardingCompleted: true,
        },
    });

    const store2 = await prisma.store.upsert({
        where: { id: 'store_test_2' },
        update: {},
        create: {
            id: 'store_test_2',
            name: 'Demo Retail Store',
            slug: 'demo-retail',
            category: 'retail',
            contacts: {
                email: 'retail@vayva.ng',
                phone: '+2348087654321',
            },
            settings: {
                currency: 'NGN',
                timezone: 'Africa/Lagos',
            },
            plan: 'PRO',
            onboardingCompleted: true,
        },
    });

    console.log(`✓ Created stores: ${store1.name}, ${store2.name}\n`);

    // Create test users
    console.log('👤 Creating test users...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const user1 = await prisma.user.upsert({
        where: { email: 'demo@vayva.ng' },
        update: {},
        create: {
            id: 'user_test_1',
            email: 'demo@vayva.ng',
            password: hashedPassword,
            firstName: 'Demo',
            lastName: 'Merchant',
            phone: '+2348012345678',
            isEmailVerified: true,
            isPhoneVerified: true,
        },
    });

    const user2 = await prisma.user.upsert({
        where: { email: 'retail@vayva.ng' },
        update: {},
        create: {
            id: 'user_test_2',
            email: 'retail@vayva.ng',
            password: hashedPassword,
            firstName: 'Retail',
            lastName: 'Owner',
            phone: '+2348087654321',
            isEmailVerified: true,
            isPhoneVerified: true,
        },
    });

    console.log(`✓ Created users: ${user1.email}, ${user2.email}`);
    console.log(`  Password for all users: password123\n`);

    // Create store memberships
    console.log('🔗 Creating store memberships...');

    await prisma.membership.upsert({
        where: {
            userId_storeId: {
                userId: user1.id,
                storeId: store1.id,
            },
        },
        update: {},
        create: {
            userId: user1.id,
            storeId: store1.id,
            role: 'OWNER',
            status: 'active',
        },
    });

    await prisma.membership.upsert({
        where: {
            userId_storeId: {
                userId: user2.id,
                storeId: store2.id,
            },
        },
        update: {},
        create: {
            userId: user2.id,
            storeId: store2.id,
            role: 'OWNER',
            status: 'active',
        },
    });

    console.log('✓ Created memberships\n');

    // Create wallets for stores
    console.log('💰 Creating wallets...');

    await prisma.wallet.upsert({
        where: { storeId: store1.id },
        update: {},
        create: {
            storeId: store1.id,
            availableKobo: BigInt(50000 * 100), // ₦50,000 in kobo
            pendingKobo: BigInt(0),
        },
    });

    await prisma.wallet.upsert({
        where: { storeId: store2.id },
        update: {},
        create: {
            storeId: store2.id,
            availableKobo: BigInt(75000 * 100), // ₦75,000 in kobo
            pendingKobo: BigInt(0),
        },
    });

    console.log('✓ Created wallets with initial balances\n');

    // Create sample products
    console.log('📦 Creating sample products...');

    const product1 = await prisma.product.upsert({
        where: { storeId_handle: { storeId: store1.id, handle: 'jollof-rice-special' } },
        update: {},
        create: {
            storeId: store1.id,
            title: 'Jollof Rice Special',
            handle: 'jollof-rice-special',
            description: 'Delicious Nigerian Jollof rice with chicken',
            price: 2500,
            status: 'ACTIVE',
        },
    });

    const product2 = await prisma.product.upsert({
        where: { storeId_handle: { storeId: store2.id, handle: 'classic-white-tshirt' } },
        update: {},
        create: {
            storeId: store2.id,
            title: 'Classic White T-Shirt',
            handle: 'classic-white-tshirt',
            description: 'Premium cotton white t-shirt',
            price: 5000,
            status: 'ACTIVE',
        },
    });

    console.log(`✓ Created products: ${product1.title}, ${product2.title}\n`);

    console.log('✅ Seeding complete!\n');
    console.log('📋 Test Credentials:');
    console.log('   Email: demo@vayva.ng');
    console.log('   Password: password123');
    console.log('   Store: Demo Food Store\n');
    console.log('   Email: retail@vayva.ng');
    console.log('   Password: password123');
    console.log('   Store: Demo Retail Store\n');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
