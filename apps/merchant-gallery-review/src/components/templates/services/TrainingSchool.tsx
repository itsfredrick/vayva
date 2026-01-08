import React from "react";
import { TemplateProps } from "../registry";

export const TrainingSchoolTemplate: React.FC<TemplateProps> = ({
  businessName,
  demoMode,
}) => {
  return (
    <div className="font-sans min-h-screen bg-white">
      {/* Academic Header */}
      <header className="border-b border-gray-100 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-serif font-bold text-lg">
            A
          </div>
          <div className="font-bold text-gray-900">
            {businessName || "Apex Academy"}
          </div>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
          <a href="#">Programs</a>
          <a href="#">Admissions</a>
          <a href="#">Portal</a>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded font-bold text-sm hover:bg-blue-700">
          Apply Now
        </button>
      </header>

      {/* Hero */}
      <section className="bg-slate-900 text-white py-20 px-6 text-center">
        <span className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 inline-block">
          Enrollment Open
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Launch your career in Tech.
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto mb-8 text-lg">
          Practical, hands-on training in Data Science, Software Engineering,
          and Product Design. 100% money-back guarantee.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-blue-600 px-8 py-3 rounded font-bold hover:bg-blue-500">
            View Courses
          </button>
          <button className="border border-slate-600 px-8 py-3 rounded font-bold hover:bg-white/5">
            Download Syllabus
          </button>
        </div>
      </section>

      {/* Course Grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Frontend Engineering",
              duration: "6 Months",
              level: "Beginner",
              icon: "💻",
            },
            {
              title: "Data Analysis",
              duration: "4 Months",
              level: "Intermediate",
              icon: "📊",
            },
            {
              title: "Product Design (UI/UX)",
              duration: "3 Months",
              level: "Beginner",
              icon: "🎨",
            },
          ].map((c, i) => (
            <div
              key={i}
              className="border border-gray-200 p-6 rounded-xl hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:bg-blue-50 group-hover:scale-110 transition-all">
                {c.icon}
              </div>
              <h3 className="font-bold text-xl mb-2">{c.title}</h3>
              <div className="flex gap-4 text-sm text-gray-500 mb-6">
                <span>⏱ {c.duration}</span>
                <span>📈 {c.level}</span>
              </div>
              <button className="w-full border border-blue-600 text-blue-600 font-bold py-2 rounded hover:bg-blue-50">
                View Curriculum
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-blue-50 py-12 border-y border-blue-100">
        <div className="max-w-4xl mx-auto flex justify-between text-center px-6">
          <div>
            <div className="text-3xl font-black text-blue-900 mb-1">500+</div>
            <div className="text-xs uppercase font-bold text-blue-400">
              Graduates
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-blue-900 mb-1">92%</div>
            <div className="text-xs uppercase font-bold text-blue-400">
              Employment Rate
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-blue-900 mb-1">4.9</div>
            <div className="text-xs uppercase font-bold text-blue-400">
              Student Rating
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
