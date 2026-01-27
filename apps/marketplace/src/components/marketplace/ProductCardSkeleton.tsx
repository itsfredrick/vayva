import React from "react";
import { Card, Skeleton } from "@vayva/ui";

export interface ProductCardSkeletonProps {
  className?: string;
}

export function ProductCardSkeleton({
  className,
}: ProductCardSkeletonProps): React.JSX.Element {
  return (
    <Card className={className}>
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <div className="pt-2">
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
    </Card>
  );
}
