
import { DiscountForm } from "@/components/marketing/DiscountForm";
import { Button } from "@vayva/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewDiscountPage() {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/dashboard/marketing/discounts">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Create Discount</h1>
                    <p className="text-gray-500 text-sm">Configure a new discount rule or coupon code.</p>
                </div>
            </div>

            <DiscountForm />
        </div>
    );
}
