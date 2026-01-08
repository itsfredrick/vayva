import { ReactNode } from "react";

interface StepCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function StepCard({ title, subtitle, children, footer }: StepCardProps) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-8 md:p-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
          {title}
        </h1>
        {subtitle && <p className="text-lg text-slate-600">{subtitle}</p>}
      </div>

      <div className="space-y-6">{children}</div>

      {footer && (
        <div className="mt-8 pt-6 border-t border-slate-200">{footer}</div>
      )}
    </div>
  );
}
