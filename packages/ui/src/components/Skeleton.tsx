import { cn } from "../utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800",
                className
            )}
            {...props}
        />
    );
}
