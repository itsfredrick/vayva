"use client";

import { Button } from "@vayva/ui";
import { Construction } from "lucide-react";

export default function ComingSoonPage() {
    return (
        <div className="flex h-[60vh] flex-col items-center justify-center p-8 text-center text-gray-500">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
                <Construction className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Coming Soon</h2>
            <p className="max-w-md mt-2 mb-6">This feature is currently under development. Check back later!</p>
            <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
        </div>
    );
}
