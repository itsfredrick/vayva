
import { test, expect } from '@playwright/test';
import { CustomerAuthService } from '../../apps/merchant-admin/src/lib/storefront/customerAuthService';
import { CustomerOrderService } from '../../apps/merchant-admin/src/lib/storefront/customerOrderService';
import { prisma } from '@vayva/db';

test.describe('Customer Accounts', () => {
    const storeId = 'store_cust_test';
    const email = 'shopper@example.com';

    test.beforeAll(async () => {
        // Cleanup
        await prisma.customerUser.deleteMany({ where: { storeId } });
        await prisma.orderCustomerLink.deleteMany({ where: { storeId } });
    });

    test('Auth Flow', async () => {
        // Signup
        const user = await CustomerAuthService.signup(storeId, { email, password: 'password123' });
        expect(user).toBeTruthy();
        expect(user.email).toBe(email);

        // Login
        const { sessionToken } = await CustomerAuthService.login(storeId, { email, password: 'password123' });
        expect(sessionToken).toBeTruthy();

        // Validate
        const session = await CustomerAuthService.validateSession(sessionToken);
        expect(session).toBeTruthy();
        expect(session?.customerUserId).toBe(user.id);
    });

    test('Order Access Control', async () => {
        // Setup User
        const user = await prisma.customerUser.findFirst({ where: { storeId, email } });
        // Setup Order Link
        const orderId = 'ord_123';
        await prisma.orderCustomerLink.create({
            data: {
                orderId,
                storeId,
                customerUserId: user!.id
            }
        });

        // Valid Access
        const detail = await CustomerOrderService.getOrderDetail(storeId, user!.id, orderId);
        expect(detail.id).toBe(orderId);

        // Invalid Access (Other User)
        const otherUserId = 'user_other'; // Mock ID
        await expect(CustomerOrderService.getOrderDetail(storeId, otherUserId, orderId))
            .rejects.toThrow();
    });

});
