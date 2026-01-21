"use client";

import React, { useState } from "react";
import { Button } from "@vayva/ui";
import { ArrowUpRight } from "lucide-react";
import { WithdrawModal } from "./WithdrawModal";

export function WithdrawFundsTrigger() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>
                <ArrowUpRight className="mr-2 h-4 w-4" /> Withdraw Funds
            </Button>
            <WithdrawModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}
