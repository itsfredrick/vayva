import React from "react";
import { PDPSkeleton } from "@/components/Skeletons";

export default function Loading(): React.JSX.Element {
    return (
        <div className="bg-white">
            <PDPSkeleton />
        </div>
    );
}
