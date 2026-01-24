import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

export const Textarea = ({
  value,
  onChange,
  placeholder,
  rows,
  className,
  ...props
}: TextareaProps) => (
  <textarea
    className={`w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all resize-none ${className}`}
    value={(value as any)}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    {...(props as any)}
  />
);
