
import { PrismaClient } from '@vayva/db';
const prisma = new PrismaClient();

async function main() {
    const storeId = 'mer_1';

    // Create an Order
    const order = await prisma.order.create({
        data: {
            storeId,
            refCode: `ORD-${Date.now()}`,
            total: 25000.00,
            currency: 'NGN',
            paymentStatus: 'INITIATED',
            status: 'DRAFT',
            // items: { ... } // Simplify for speed, just need order for payment
        }
    });

    console.log(JSON.stringify(order)); // Output JSON for parsing
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
