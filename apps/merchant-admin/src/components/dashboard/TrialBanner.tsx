"use client";

import { Button } from "@vayva/ui";
import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function TrialBanner() {
    return (
        <div className="bg-indigo-600 text-white px-4 py-3 shadow-md relative z-50">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="bg-white/20 p-1.5 rounded-full">
                        <AlertTriangle className="w-4 h-4 text-indigo-100" />
                    </span>
                    <div>
                        <p className="font-semibold text-sm">You are in Trial Mode</p>
                        <p className="text-xs text-indigo-100 hidden md:block">
                            Store is active but payments are disabled until you complete verification.
                        </p>
                    </div>
                </div>

                <Link href="/onboarding">
                    <Button size="sm" variant="secondary" className="whitespace-nowrap font-medium text-xs h-8">
                        Complete Setup <ArrowRight className="ml-2 w-3 h-3" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
