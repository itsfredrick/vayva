
import { PrismaClient } from '@vayva/db';
const prisma = new PrismaClient();

async function main() {
    const storeId = 'mer_1';

    console.log(`Checking for store: ${storeId}...`);

    const store = await prisma.store.findUnique({
        where: { id: storeId }
    });

    if (!store) {
        console.log(`Store ${storeId} not found. Creating...`);
        // We need an owner user first usually, but let's check Store schema requirements
        // Assuming Store creation logic here. 
        // Forced to create minimal valid store record
        await prisma.store.create({
            data: {
                id: storeId,
                name: "Vayva Merchant Store",
                slug: "vayva-store",
                ownerId: "user_1", // Mock owner
                status: "ACTIVE",
                businessType: "RETAIL"
            }
        });
        console.log(`Store created.`);
    } else {
        console.log(`Store exists.`);
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
