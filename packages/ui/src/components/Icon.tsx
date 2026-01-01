import * as React from "react";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import { LucideProps } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";

export type IconName = keyof typeof dynamicIconImports | (string & {});

export interface IconProps extends LucideProps {
  name: IconName;
  size?: number | string;
}

export const Icon = ({ name, size = 24, ...props }: IconProps) => {
  const kebabName = useMemo(() => {
    return name
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .toLowerCase() as IconName;
  }, [name]);

  const LucideIcon = useMemo(() => {
    const dynamicIcon = (dynamicIconImports as any)[kebabName];
    if (!dynamicIcon) return null;
    return dynamic(dynamicIcon) as any;
  }, [kebabName]);

  if (!LucideIcon) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`Icon ${name} (as ${kebabName}) not found`);
    }
    return null;
  }

  return <LucideIcon size={size} {...props} />;
};
