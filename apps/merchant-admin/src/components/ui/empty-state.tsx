
import { Button } from "@vayva/ui";
import { LucideIcon, PlusCircle } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    actiononClick?: () => void;
}

export function EmptyState({
    icon: Icon = PlusCircle,
    title,
    description,
    actionLabel,
    actionHref,
    actiononClick,
}: EmptyStateProps) {
    return (
        <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed text-center animate-in fade-in-50">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    {description}
                </p>

                {actionLabel && (actionHref || actiononClick) && (
                    actionHref ? (
                        <Link href={actionHref}>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                {actionLabel}
                            </Button>
                        </Link>
                    ) : (
                        <Button onClick={actiononClick}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            {actionLabel}
                        </Button>
                    )
                )}
            </div>
        </div>
    );
}
