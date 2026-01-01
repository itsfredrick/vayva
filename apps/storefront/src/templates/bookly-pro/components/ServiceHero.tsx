import React from "react";

interface ServiceHeroProps {
  headline?: string;
  subheadline?: string;
}

export const ServiceHero = ({
  headline = "Look Sharp, Feel Confident.",
  subheadline = "Professional grooming services tailored to your style.",
}: ServiceHeroProps) => {
  return (
    <section className="bg-white py-12 px-6 border-b border-gray-100">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Open Today: 9AM - 8PM
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            {headline}
          </h1>
          <p className="text-lg text-gray-500 max-w-md mx-auto md:mx-0">
            {subheadline}
          </p>
          <div className="flex items-center gap-4 justify-center md:justify-start pt-2">
            <button className="bg-gray-900 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-gray-800 transition-all">
              View Services
            </button>
            <button className="text-gray-600 font-medium hover:text-blue-600 px-4">
              Our Story
            </button>
          </div>
        </div>

        {/* Visual (Abstract or Photo) */}
        <div className="flex-1 w-full relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
          <img
            src="https://placehold.co/800x600/1E3A8A/FFFFFF?text=Barber+Shop"
            alt="Hero"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </section>
  );
};
