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

const ICON_CACHE: Record<string, React.ComponentType<LucideProps>> = {};

export const Icon = ({ name, size = 24, ...props }: IconProps): React.JSX.Element | null => {
  const kebabName = useMemo(() => {
    return name
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .toLowerCase() as IconName;
  }, [name]);

  const LucideIcon = useMemo(() => {
    if (ICON_CACHE[kebabName]) return ICON_CACHE[kebabName];

    const dynamicIcon = (dynamicIconImports as Record<string, () => Promise<{ default: React.ComponentType<LucideProps> }>>)[kebabName];
    if (!dynamicIcon) return null;

    const Comp = dynamic(dynamicIcon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ICON_CACHE[kebabName] = Comp;
    return Comp;
  }, [kebabName]);

  if (!LucideIcon) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`Icon ${name} (as ${kebabName}) not found`);
    }
    return null;
  }

  return <LucideIcon size={size} {...props} />;
};
