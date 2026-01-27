import React from "react";
import Image from "next/image";
import { cn } from "@vayva/ui";

export function BrandLogo({
  className,
  priority,
}: {
  className?: string;
  priority?: boolean;
}): React.JSX.Element {
  return (
    <Image
      src="/vayva-logo-official.svg"
      alt="Vayva"
      width={140}
      height={40}
      priority={priority}
      className={cn("h-6 w-auto", className)}
    />
  );
}
