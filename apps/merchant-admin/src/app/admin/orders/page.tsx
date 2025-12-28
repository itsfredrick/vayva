import { Metadata } from 'next';
import { OrdersPageClient } from './OrdersPageClient';

export const metadata: Metadata = {
    title: 'Orders | Vayva Dashboard',
    description: 'View and manage your store orders',
};

export default function OrdersPage() {
    return <OrdersPageClient />;
}
