import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import AnimatedDashboard from "./AnimatedDashboard";
import "./ProductionHero.css";

export default function ProductionHero() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Track scroll for parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track mouse for interactive glow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Stagger animations on mount
  useEffect(() => {
    if (!contentRef.current) return;

    const elements = contentRef.current.querySelectorAll(
      "[data-animate]"
    ) as NodeListOf<HTMLElement>;

    elements.forEach((el, index) => {
      const delay = index * 0.12;
      el.style.setProperty("--animation-delay", `${delay}s`);
    });
  }, []);

  return (
    <div
      ref={heroRef}
      className="hero-container relative w-full min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/30 to-slate-950 overflow-hidden pt-32 pb-20"
    >
      {/* Animated background elements */}
      <div className="hero-bg-elements absolute inset-0 overflow-hidden">
        {/* Primary gradient orb */}
        <div
          className="hero-orb hero-orb-primary"
          style={{
            transform: `translateY(${scrollY * 0.3}px) translateX(${mousePos.x * 0.02}px)`,
          }}
        />

        {/* Secondary gradient orb */}
        <div
          className="hero-orb hero-orb-secondary"
          style={{
            transform: `translateY(${scrollY * -0.2}px) translateX(${mousePos.x * -0.015}px)`,
          }}
        />

        {/* Interactive glow effect */}
        <div
          className="hero-glow"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
          }}
        />

        {/* Animated grid background */}
        <div className="hero-grid" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div ref={contentRef} className="space-y-8">
            {/* Badge with animation */}
            <div
              data-animate
              className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 w-fit hover:border-blue-500/60 transition-all duration-300"
            >
              <Sparkles size={16} className="text-blue-400 animate-pulse" />
              <span className="text-sm text-blue-300 font-medium">
                AI-Powered Growth Marketing
              </span>
            </div>

            {/* Headline with word-by-word animation */}
            <h1
              data-animate
              className="hero-headline text-5xl lg:text-6xl font-black text-white leading-tight"
            >
              Scale Your Business with{" "}
              <span className="hero-gradient-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Data-Driven Digital Marketing
              </span>
            </h1>

            {/* Subheadline */}
            <p
              data-animate
              className="hero-subheadline text-lg text-gray-300 leading-relaxed max-w-lg"
            >
              We help brands grow faster with SEO, paid ads, and high-converting
              strategies that deliver real results. Join 200+ businesses already
              scaling with us.
            </p>

            {/* Trust badges with staggered animation */}
            <div data-animate className="hero-trust-badges flex flex-wrap gap-6 pt-4">
              <div className="hero-badge-item flex items-center gap-3 group">
                <div className="hero-badge-icon w-12 h-12 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center group-hover:bg-green-500/20 group-hover:border-green-500/50 transition-all duration-300">
                  <span className="text-green-400 font-bold text-lg">✓</span>
                </div>
                <div>
                  <div className="font-semibold text-white">200+</div>
                  <div className="text-sm text-gray-400">Happy Clients</div>
                </div>
              </div>

              <div className="hero-badge-item flex items-center gap-3 group">
                <div className="hero-badge-icon w-12 h-12 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center group-hover:bg-yellow-500/20 group-hover:border-yellow-500/50 transition-all duration-300">
                  <span className="text-yellow-400 font-bold text-lg">⭐</span>
                </div>
                <div>
                  <div className="font-semibold text-white">5★ Rating</div>
                  <div className="text-sm text-gray-400">Google Reviews</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons with advanced hover effects */}
            <div data-animate className="hero-cta-group flex flex-col sm:flex-row gap-4 pt-6">
              <Link href="/contact">
                <button className="hero-cta-primary group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 active:scale-95">
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-shimmer" />

                  <span className="relative flex items-center justify-center gap-2">
                    Get Free Strategy
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </span>
                </button>
              </Link>

              <Link href="/case-studies">
                <button className="hero-cta-secondary group px-8 py-4 bg-white/5 border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 hover:border-white/40 transition-all duration-300 active:scale-95">
                  <span className="flex items-center justify-center gap-2">
                    View Case Studies
                    <Play size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </button>
              </Link>
            </div>

            {/* Lead magnet with pulse animation */}
            <div
              data-animate
              className="hero-lead-magnet mt-8 p-4 rounded-xl border border-[rgba(0,174,239,0.2)] bg-[rgba(0,174,239,0.05)] inline-block hover:border-[rgba(0,174,239,0.4)] hover:bg-[rgba(0,174,239,0.1)] transition-all duration-300"
            >
              <p className="text-sm font-['DM_Sans'] text-slate-300">
                <span className="text-[#00AEEF] font-bold">FREE for this week:</span> SEO
                Audit + Website Analysis + Custom Marketing Plan
              </p>
            </div>
          </div>

          {/* Right side - Animated Dashboard */}
          <div
            data-animate
            className="hero-dashboard relative h-96 lg:h-full min-h-96"
            style={{
              transform: `translateY(${scrollY * 0.1}px)`,
            }}
          >
            <AnimatedDashboard />
          </div>
        </div>
      </div>

      {/* Scroll indicator with animation */}
      <div className="hero-scroll-indicator absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
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
