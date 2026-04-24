import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Sparkles } from "lucide-react";
import AnimatedDashboard from "./AnimatedDashboard";

export default function PremiumHero() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Stagger animation on mount
  useEffect(() => {
    if (!contentRef.current) return;

    const elements = contentRef.current.querySelectorAll(
      "[data-animate]"
    ) as NodeListOf<HTMLElement>;

    elements.forEach((el, index) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = `all 0.6s ease-out ${index * 0.1}s`;

      setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 100);
    });
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative w-full min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/30 to-slate-950 overflow-hidden pt-32 pb-20"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div
          className="absolute top-20 left-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
          style={{
            transform: `translateY(${scrollY * -0.2}px)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div ref={contentRef} className="space-y-8">
            {/* Badge */}
            <div
              data-animate
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 w-fit hover:border-blue-500/60 transition-colors"
            >
              <Sparkles size={16} className="text-blue-400" />
              <span className="text-sm text-blue-300 font-medium">
                AI-Powered Growth Marketing
              </span>
            </div>

            {/* Headline */}
            <h1
              data-animate
              className="text-5xl lg:text-6xl font-black text-white leading-tight"
            >
              Scale Your Business with{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Data-Driven Digital Marketing
              </span>
            </h1>

            {/* Subheadline */}
            <p
              data-animate
              className="text-lg text-gray-300 leading-relaxed max-w-lg"
            >
              We help brands grow faster with SEO, paid ads, and high-converting
              strategies that deliver real results. Join 200+ businesses already
              scaling with us.
            </p>

            {/* Trust badges */}
            <div data-animate className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                  <span className="text-green-400 font-bold text-lg">✓</span>
                </div>
                <div>
                  <div className="font-semibold text-white">200+</div>
                  <div className="text-sm text-gray-400">Happy Clients</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
                  <span className="text-yellow-400 font-bold text-lg">⭐</span>
                </div>
                <div>
                  <div className="font-semibold text-white">5★ Rating</div>
                  <div className="text-sm text-gray-400">Google Reviews</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div data-animate className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link href="/contact">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105">
                  <span className="relative flex items-center justify-center gap-2">
                    Get Free Strategy
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                </button>
              </Link>
              <Link href="/case-studies">
                <button className="px-8 py-4 bg-white/5 border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 hover:border-white/40 transition-all duration-300">
                  View Case Studies
                </button>
              </Link>
            </div>
          </div>

          {/* Right side - Animated Dashboard */}
          <div
            data-animate
            className="relative h-96 lg:h-full min-h-96"
            style={{
              transform: `translateY(${scrollY * 0.1}px)`,
            }}
          >
            <AnimatedDashboard />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-gray-400">Scroll to explore</span>
          <div className="w-6 h-10 border border-gray-600 rounded-full flex justify-center p-2">
            <div className="w-1 h-2 bg-gray-600 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
