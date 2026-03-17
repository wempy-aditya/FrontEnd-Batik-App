"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { withBasePath } from "@/lib/basePath";

const HeroSection = () => {
  const [hoverButton, setHoverButton] = useState(null);
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${withBasePath("/background_batik.jpg")}')` }}
      />
      {/* Warm-dark gradient overlay to match other sections */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(160deg, rgba(15,12,6,0.85) 0%, rgba(28,22,9,0.7) 25%, rgba(42,31,13,0.6) 50%, rgba(28,22,9,0.8) 75%, rgba(15,12,6,0.95) 100%)"
        }}
      />

      {/* Floating glow elements - disesuaikan ke warm gold */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-yellow-600/15 rounded-full blur-3xl" style={{ animationDuration: '4s' }}></div>
      </div>

      {/* Content — centered */}
      <div className="container mx-auto px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-amber-50 via-amber-200 to-yellow-400 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            Batik Generative
            <span className="block bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent mt-2">
              AI Platform
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-amber-100/80 leading-relaxed font-light">
            Get to know more about batik and all its patterns. Do research
            about batik products and collaborate with everyone to explore
            more about batiks.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          {/* Solid Gold Button */}
          <button
            onClick={() => router.push("/projects")}
            onMouseEnter={() => setHoverButton("explore")}
            onMouseLeave={() => setHoverButton(null)}
            className="group relative px-8 py-4 text-black font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20 shadow-lg"
            style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
          >
            <div className="flex items-center justify-center gap-2">
              <span>Explore Products</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${hoverButton === "explore" ? "translate-x-1" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-yellow-400/30 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </button>

          {/* Glassmorphism Outline Button */}
          <button
            onClick={() => router.push("/publications")}
            onMouseEnter={() => setHoverButton("publications")}
            onMouseLeave={() => setHoverButton(null)}
            className="group px-8 py-4 bg-white/5 backdrop-blur-sm border border-amber-500/30 text-amber-200 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-amber-500/10 hover:border-amber-400/50"
          >
            <div className="flex items-center justify-center gap-2">
              <span>Our Publications</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${hoverButton === "publications" ? "translate-x-1" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f0c06] to-transparent"></div>
    </section>
  );
};

export default HeroSection;
