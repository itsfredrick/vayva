"use client";

import { Button } from "@vayva/ui";
import { CreditCard } from "lucide-react";

export default function BillingPage() {
    return (
        <div className="flex h-[60vh] flex-col items-center justify-center p-8 text-center text-gray-500">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
                <CreditCard className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Billing & Plans</h2>
            <p className="max-w-md mt-2 mb-6">Manage your subscription, view invoices, and update payment methods. This module is currently under maintenance.</p>
            <Button>Contact Support</Button>
        </div>
    );
}
