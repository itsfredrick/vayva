interface WhyItMattersProps {
  children: React.ReactNode;
}

export function WhyItMatters({ children }: WhyItMattersProps) {
  return (
    <div className="bg-blue-50/70 backdrop-blur-sm rounded-xl border border-blue-100 p-4">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm text-blue-900 font-medium mb-1">
            Why this matters
          </p>
          <p className="text-sm text-blue-800">{children}</p>
        </div>
      </div>
    </div>
  );
}
