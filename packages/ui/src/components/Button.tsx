"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";
import { motion, hoverLift, tapScale } from "../motion";
import { Icon } from "./Icon";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-text-inverse hover:bg-primary-hover shadow-sm hover:shadow-md",
        secondary:
          "bg-background border border-primary text-primary hover:bg-background-light",
        outline:
          "border border-border text-text-primary hover:bg-background-light",
        ghost: "hover:bg-background-light text-text-primary",
        link: "text-accent underline-offset-4 hover:underline",
        destructive:
          "bg-status-danger text-text-inverse hover:bg-status-danger/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const BaseButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        // @ts-ignore: framer-motion refs are compatible but types can be strict
        ref={ref}
        disabled={props.disabled || isLoading}
        whileHover={!props.disabled && !isLoading ? hoverLift : undefined}
        whileTap={!props.disabled && !isLoading ? tapScale : undefined}
        {...(props as any)}
      >
        {isLoading && (
          <Icon name="loader" className="mr-2 h-4 w-4 animate-spin" />
        )}
        {children}
      </motion.button>
    );
  },
);
BaseButton.displayName = "Button";

export { BaseButton as Button, buttonVariants };
