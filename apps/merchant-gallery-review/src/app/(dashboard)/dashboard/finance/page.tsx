import { EmptyState, Button } from "@vayva/ui";

export default function FinancePage() {
    const transactions: any[] = [];

    if (transactions.length === 0) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6 text-white text-3xl">Finance</h1>
                <EmptyState
                    title="No transactions yet"
                    icon="Wallet"
                    description="Your earnings and payouts will appear here once you start making sales."
                    action={<Button disabled className="px-8">Withdraw Funds</Button>}
                />
            </div>
        );
    }


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Finance</h1>
        </div>
    );
}
