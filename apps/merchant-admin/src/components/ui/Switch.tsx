import React from "react";
import { cn } from "@vayva/ui";

interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const Switch = ({
  checked,
  onCheckedChange,
  className,
  disabled,
  ...props
}: SwitchProps) => {
  return (
    <div className="relative inline-flex items-center">
      <input
        type="checkbox"
        id={props.id || "switch-toggle"}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        disabled={disabled}
        className="sr-only"
        {...(props as any)}
      />
      <label
        htmlFor={props.id || "switch-toggle"}
        className={cn(
          "w-11 h-6 rounded-full relative transition-colors focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-black cursor-pointer",
          checked ? "bg-green-500" : "bg-gray-200",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        <span
          className={cn(
            "block w-5 h-5 bg-white rounded-full shadow-sm transition-transform transform",
            checked ? "translate-x-5" : "translate-x-0.5",
            "mt-0.5 ml-0.5",
          )}
        />
      </label>
    </div>
  );
};
