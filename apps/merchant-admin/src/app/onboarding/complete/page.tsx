"use client";

import { Button } from "@vayva/ui";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function OnboardingSuccessPage() {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 relative overflow-hidden">
            {/* Celebration Effect - Confetti removed for simplicity */}

            <div className="max-w-md w-full text-center space-y-8 z-10">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="text-green-600 w-10 h-10" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900">You're All Set!</h1>
                <p className="text-gray-600 text-lg">
                    Your store is now live and ready to accept orders.
                </p>

                <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-left space-y-4 shadow-sm">
                    <h3 className="font-semibold text-gray-900">Next Steps</h3>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                            <span className="text-sm text-gray-600">Add your first product to start selling.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                            <span className="text-sm text-gray-600">Share your store link with customers.</span>
                        </li>
                    </ul>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-4">
                    <Link href="/dashboard">
                        <Button size="lg" className="w-full flex items-center justify-center gap-2">
                            Go to Dashboard <ArrowRight size={16} />
                        </Button>
                    </Link>
                    <Link href="/products/new">
                        <Button variant="outline" size="lg" className="w-full">
                            Add First Product
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
