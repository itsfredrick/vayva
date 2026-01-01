import React from "react";
import { TemplateProps } from "../registry";

export const FashionDesignerTemplate: React.FC<TemplateProps> = ({
  businessName,
  demoMode,
}) => {
  return (
    <div className="font-serif min-h-screen bg-neutral-900 text-neutral-200">
      {/* Minimalist Logo Header */}
      <header className="px-8 py-10 flex justify-between items-end sticky top-0 z-50 mix-blend-difference bg-neutral-900/50 backdrop-blur-sm">
        <div className="text-3xl font-light tracking-[0.2em] uppercase leading-none">
          {businessName ? businessName.split(" ")[0] : "ADE"}
          <br />
          <span className="font-bold">
            {businessName ? businessName.split(" ")[1] : "KUNLE"}
          </span>
        </div>
        <button className="text-xs font-bold uppercase tracking-widest border border-white/20 px-6 py-3 hover:bg-white hover:text-black transition-colors">
          Book Consultation
        </button>
      </header>

      {/* Lookbook Grid */}
      <section className="px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "The Agbada Series",
              year: "2024",
              img: "https://images.unsplash.com/photo-1550614000-4b9519e007d4?w=800&q=80",
            },
            {
              title: "Senator Suits",
              year: "2023",
              img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
            },
            {
              title: "Traditional Bridal",
              year: "2024",
              img: "https://images.unsplash.com/photo-1545959734-633b28b78b5e?w=800&q=80",
            },
            {
              title: "Casual Friday",
              year: "2023",
              img: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative cursor-pointer overflow-hidden"
            >
              <div className="aspect-[3/4] bg-neutral-800">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700 grayscale group-hover:grayscale-0"
                />
              </div>
              <div className="absolute bottom-6 left-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <div className="text-xs font-bold tracking-widest mb-1 text-neutral-400">
                  {item.year}
                </div>
                <h3 className="text-2xl font-light italic">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bespoke Process */}
      <section className="px-8 py-20 bg-neutral-800 text-center">
        <h2 className="text-sm font-bold uppercase tracking-[0.3em] mb-12 text-neutral-500">
          The Bespoke Process
        </h2>
        <div className="flex flex-col md:flex-row justify-center gap-12 max-w-4xl mx-auto">
          {[
            {
              step: "01",
              title: "Consultation",
              desc: "We discuss your style, fabric preference, and occasion.",
            },
            {
              step: "02",
              title: "Measurement",
              desc: "Precise fitting to ensure the perfect cut for your frame.",
            },
            {
              step: "03",
              title: "Fitting",
              desc: "Intermediate fittings to adjust details before final delivery.",
            },
          ].map((s, i) => (
            <div key={i} className="flex-1">
              <div className="text-4xl font-light text-neutral-700 mb-4">
                {s.step}
              </div>
              <h3 className="text-lg font-bold mb-2 uppercase tracking-wider">
                {s.title}
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed font-sans">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
