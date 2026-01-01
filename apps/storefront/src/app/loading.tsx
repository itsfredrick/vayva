import { ProductGridSkeleton } from "@/components/Skeletons";

export default function Loading() {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <ProductGridSkeleton />
        </div>
    );
}
