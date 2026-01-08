import { EmptyState, Button } from "@vayva/ui";

export default function LogisticsPage() {
    const shipments: any[] = [];

    if (shipments.length === 0) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6 text-white text-3xl">Deliveries</h1>
                <EmptyState
                    title="No deliveries yet"
                    icon="Truck"
                    description="When you start shipping orders to customers, you can track them here."
                    action={<Button className="px-8">View Shipping Settings</Button>}
                />
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-white text-3xl">Deliveries</h1>
        </div>
    );
}
