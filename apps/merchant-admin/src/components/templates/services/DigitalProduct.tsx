import React from "react";
import { TemplateProps } from "../registry";

export const DigitalProductTemplate: React.FC<TemplateProps> = ({
  businessName,
  demoMode,
}) => {
  return (
    <div className="font-sans min-h-screen bg-indigo-900 text-white selection:bg-pink-500 selection:text-white">
      {/* Minimal Header */}
      <header className="px-6 py-6 flex justify-between items-center absolute top-0 left-0 right-0 z-10 opacity-70">
        <div className="font-bold tracking-tight">
          {businessName || "Creator Hub"}
        </div>
        <button className="text-xs font-bold uppercase tracking-widest border border-white/20 px-4 py-2 rounded-full hover:bg-white/10">
          Log in
        </button>
      </header>

      {/* Split Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left: Product Info */}
        <div className="flex flex-col justify-center px-8 lg:px-20 py-20 lg:py-0">
          <div className="bg-pink-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full w-max mb-6">
            Internal Tool
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            The Ultimate Freelancer OS
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed mb-8 max-w-md">
            Streamline your entire freelance business with this all-in-one
            Notion template. Manage clients, projects, and invoices.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-white text-indigo-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-900/50 flex items-center justify-center gap-2">
              <span>Buy for ₦15,000</span>
              <svg
                className="w-5 h-5 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
            <button className="bg-transparent border border-white/20 text-white px-6 py-4 rounded-xl font-bold hover:bg-white/5 transition-colors">
              View Preview
            </button>
          </div>

          <div className="mt-8 flex items-center gap-4 text-xs text-indigo-300 font-medium">
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>{" "}
              Instant Download
            </span>
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>{" "}
              Lifetime Updates
            </span>
          </div>
        </div>

        {/* Right: Visual */}
        <div className="bg-gradient-to-br from-purple-800 to-indigo-800 flex items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

          {/* Perspective Testup */}
          <div className="relative z-10 perspective-1000 transform rotate-y-12 rotate-x-6 hover:rotate-0 transition-transform duration-700">
            <img
              src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80"
              alt="Dashboard Preview"
              className="rounded-xl shadow-2xl border border-white/10 max-w-lg w-full"
            />
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-white text-indigo-900 p-4 rounded-xl shadow-xl animate-bounce-slow">
              <div className="text-xs font-bold uppercase text-indigo-400 mb-1">
                Rating
              </div>
              <div className="flex gap-1 text-yellow-500">⭐⭐⭐⭐⭐</div>
              <div className="text-2xl font-bold mt-1">5.0</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features (Minimal) */}
      <section className="bg-indigo-950 py-20 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="w-12 h-12 bg-indigo-900 rounded-lg flex items-center justify-center mx-auto mb-4 text-2xl">
              ⚡
            </div>
            <h3 className="font-bold mb-2">Fast Setup</h3>
            <p className="text-sm text-indigo-300">
              Duplicate to your workspace in 30 seconds.
            </p>
          </div>
          <div>
            <div className="w-12 h-12 bg-indigo-900 rounded-lg flex items-center justify-center mx-auto mb-4 text-2xl">
              📱
            </div>
            <h3 className="font-bold mb-2">Mobile Ready</h3>
            <p className="text-sm text-indigo-300">
              Looks perfect on phone, tablet, and desktop.
            </p>
          </div>
          <div>
            <div className="w-12 h-12 bg-indigo-900 rounded-lg flex items-center justify-center mx-auto mb-4 text-2xl">
              🎨
            </div>
            <h3 className="font-bold mb-2">Dark Mode</h3>
            <p className="text-sm text-indigo-300">
              Designed for low-light environments.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
