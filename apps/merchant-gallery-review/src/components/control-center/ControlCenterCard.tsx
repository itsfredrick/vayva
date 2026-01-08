import Link from "next/link";
import { GlassPanel, Icon } from "@vayva/ui";
import { LucideIcon, ArrowRight } from "lucide-react";

interface ControlCenterCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  status?: string;
  disabled?: boolean;
}

export function ControlCenterCard({
  title,
  description,
  icon,
  href,
  status,
  disabled,
}: ControlCenterCardProps) {
  const Content = (
    <GlassPanel
      className={`group relative h-full p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/5 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70 group-hover:bg-white/10 group-hover:text-white">
              <Icon name={icon as any} size={20} />
            </div>
            {status && (
              <span className="rounded-full bg-white/5 px-2 py-1 text-xs font-medium text-white/50">
                {status}
              </span>
            )}
          </div>

          <h3 className="mb-1 flex items-center gap-2 text-lg font-medium text-white">
            <Icon
              name={icon as any}
              className="w-6 h-6 text-primary group-hover:scale-110 transition-transform"
            />
            {title}
          </h3>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>

        <div className="mt-6 flex items-center text-sm font-medium text-white/0 transition-all duration-300 group-hover:text-primary group-hover:text-white">
          <span className="mr-2">Manage</span>
          <ArrowRight size={16} />
        </div>
      </div>
    </GlassPanel>
  );

  if (disabled) {
    return Content;
  }

  return (
    <Link href={href} className="block h-full no-underline">
      {Content}
    </Link>
  );
}
