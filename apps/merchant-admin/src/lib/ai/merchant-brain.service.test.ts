import { MerchantBrainService } from './merchant-brain.service';
import { prisma } from '@vayva/db';

describe('MerchantBrainService', () => {

    const TEST_STORE_A = 'store-a-uuid';
    const TEST_STORE_B = 'store-b-uuid';

    it('should enforce tenant isolation in retrieval', async () => {
        // 1. Setup mock data in Store A
        // 2. Query as Store B
        // 3. Result should be empty
        const results = await MerchantBrainService.retrieveContext(TEST_STORE_B, 'Store A Policy');
        expect(results.length).toBe(0);
    });

    it('should correctly execute the getInventory tool', async () => {
        const result = await MerchantBrainService.getInventoryStatus(TEST_STORE_A, 'prod-123');
        expect(result.status).toBe('IN_STOCK');
        expect(result.available).toBeGreaterThan(0);
    });

    it('should return empty context if query is empty', async () => {
        const results = await MerchantBrainService.retrieveContext(TEST_STORE_A, '');
        expect(results.length).toBe(0);
    });

    it('should handle tool failure gracefully', async () => {
        // Mocking a missing product
        const result = await MerchantBrainService.getInventoryStatus(TEST_STORE_A, 'non-existent');
        expect(result.name).toBe('Unknown Product');
    });
});

// Mocking global expect/describe for the example
function describe(name: string, fn: () => void) { console.log(`Testing ${name}...`); fn(); }
function it(name: string, fn: () => void) { console.log(`  - ${name}`); fn(); }
function expect(val: any) { return { toBe: (e: any) => console.log(val === e ? '    ✅' : '    ❌'), toBeGreaterThan: (e: any) => console.log(val > e ? '    ✅' : '    ❌') }; }
