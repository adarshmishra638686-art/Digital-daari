/* ============================================================
   HOME PAGE — Hero, Stats, Services, Why Us, Testimonials, CTA
   Design: Electric Growth — Dark Navy + Sky Blue
   ============================================================ */

import { Link } from "wouter";
import {
  Search, MapPin, Globe, Palette, Video, Camera, Share2, MousePointer,
  Star, ArrowRight, CheckCircle, TrendingUp, Users, Award, Zap,
  ChevronRight, Phone, MessageCircle
} from "lucide-react";
import { useScrollAnimation, useCountUp } from "@/hooks/useScrollAnimation";

// ---- Data ----
const services = [
  { icon: Search, title: "Search Engine Optimization", desc: "Rank higher on Google and drive organic traffic that converts into real customers.", color: "#00AEEF" },
  { icon: MapPin, title: "Local SEO", desc: "Dominate local search results and attract customers in your area who are ready to buy.", color: "#0072BC" },
  { icon: Globe, title: "Website Designing", desc: "Professional, fast, and conversion-optimized websites that make your brand shine online.", color: "#00AEEF" },
  { icon: Palette, title: "Graphic Design", desc: "Stunning visuals, logos, and brand identity that make your business unforgettable.", color: "#0072BC" },
  { icon: Video, title: "Video Editing", desc: "Cinematic, engaging video content that tells your story and captivates your audience.", color: "#00AEEF" },
  { icon: Camera, title: "Photoshoots & Videoshoots", desc: "Professional photography and videography that showcases your brand at its best.", color: "#0072BC" },
  { icon: Share2, title: "Social Media Marketing", desc: "Build a powerful social presence that engages your audience and drives consistent growth.", color: "#00AEEF" },
  { icon: MousePointer, title: "Pay Per Click (PPC)", desc: "Data-driven ad campaigns that deliver immediate results and maximum ROI.", color: "#0072BC" },
];

const stats = [
  { value: 200, suffix: "+", label: "Happy Clients", icon: Users },
  { value: 500, suffix: "%", label: "Average ROI Increase", icon: TrendingUp },
  { value: 5, suffix: "+", label: "Years of Experience", icon: Award },
  { value: 98, suffix: "%", label: "Client Retention Rate", icon: Star },
];

const whyUs = [
  { icon: Zap, title: "Results-Driven Approach", desc: "Every strategy we build is tied to measurable outcomes — leads, rankings, and revenue." },
  { icon: Users, title: "Dedicated Account Manager", desc: "You get a dedicated expert who knows your business and is always just a message away." },
  { icon: TrendingUp, title: "Transparent Reporting", desc: "Real-time dashboards and monthly reports so you always know exactly what's happening." },
  { icon: Award, title: "Proven Track Record", desc: "200+ clients served across industries with documented growth in traffic and conversions." },
  { icon: CheckCircle, title: "Full-Service Agency", desc: "From SEO to video production — everything your brand needs under one roof." },
  { icon: Star, title: "No Long-Term Lock-ins", desc: "We earn your trust every month. No binding contracts, just consistent results." },
];

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Restaurant Owner",
    text: "Digitaldaari transformed our online presence completely. Our Google rankings went from page 5 to page 1 in just 3 months. Footfall increased by 60%!",
    rating: 5,
    avatar: "RS",
  },
  {
    name: "Priya Mehta",
    role: "E-commerce Founder",
    text: "The website they built for us is absolutely stunning and loads super fast. Our conversion rate doubled within the first month. Highly recommend!",
    rating: 5,
    avatar: "PM",
  },
  {
    name: "Arjun Patel",
    role: "Real Estate Agent",
    text: "Their Local SEO service is a game-changer. I now get 15-20 qualified leads every week from Google alone. Best investment I've made for my business.",
    rating: 5,
    avatar: "AP",
  },
];

// ---- Sub-components ----
function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const { ref, isVisible } = useScrollAnimation();
  const count = useCountUp(stat.value, isVisible);
  return (
    <div
      ref={ref}
      className="text-center"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: `all 0.6s ease ${index * 0.1}s`,
      }}
    >
      <div className="text-4xl md:text-5xl font-black font-['Montserrat'] gradient-text mb-1">
        {count}{stat.suffix}
      </div>
      <div className="text-slate-400 text-sm font-['DM_Sans']">{stat.label}</div>
    </div>
  );
}

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const { ref, isVisible } = useScrollAnimation();
  const Icon = service.icon;
  return (
    <div
      ref={ref}
      className="card-glow rounded-xl p-6 bg-[#0D1230] group"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: `all 0.5s ease ${(index % 4) * 0.1}s`,
      }}
    >
      <div className="service-icon-wrap mb-4">
        <Icon size={22} className="text-[#00AEEF]" />
      </div>
      <h3 className="text-white font-bold text-base mb-2 font-['Montserrat']">{service.title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed font-['DM_Sans'] mb-4">{service.desc}</p>
      <Link href="/services">
        <span className="text-[#00AEEF] text-sm font-semibold font-['DM_Sans'] flex items-center gap-1 group-hover:gap-2 transition-all">
          Learn More <ChevronRight size={14} />
        </span>
      </Link>
    </div>
  );
}

// ---- Main Component ----
export default function Home() {
  const heroRef = useScrollAnimation();
  const statsRef = useScrollAnimation();
  const whyRef = useScrollAnimation();
  const testimonialsRef = useScrollAnimation();
  const ctaRef = useScrollAnimation();

  return (
    <div className="min-h-screen" style={{ background: "#06091A" }}>

      {/* ===== HERO SECTION ===== */}
      <section
        className="relative min-h-screen flex items-center pt-28 overflow-hidden"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663571710539/2AKrWQ2ThXRHggBVBCqHwp/hero-bg-8SxTT79aV5ntSmzyUNCTpT.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(6,9,26,0.92) 0%, rgba(6,9,26,0.75) 50%, rgba(6,9,26,0.85) 100%)" }} />

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle, #00AEEF, transparent)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl" style={{ background: "radial-gradient(circle, #0072BC, transparent)" }} />

        <div className="container relative z-10 py-20">
          <div className="max-w-4xl">
            {/* Urgency badge */}
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="badge-urgent">🤖 AI-Powered Digital Marketing</span>
              <span className="text-slate-400 text-sm font-['DM_Sans']">Smart strategies that scale your business</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black font-['Montserrat'] text-white leading-tight mb-6">
              Grow Your Business<br />
              <span className="gradient-text">10X Faster</span> With<br />
              Digital Marketing
            </h1>

            {/* Subheadline */}
            <p className="text-slate-300 text-lg md:text-xl font-['DM_Sans'] leading-relaxed mb-8 max-w-2xl">
              We help local businesses, startups, and personal brands dominate online with proven SEO, stunning websites, viral social media, and high-converting ad campaigns.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              {["200+ Happy Clients", "5★ Google Rating", "500% Avg. ROI"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#00AEEF]" />
                  <span className="text-slate-300 text-sm font-['DM_Sans']">{item}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <button className="shimmer-btn text-white font-bold text-base px-8 py-4 rounded-xl font-['Montserrat'] tracking-wide hover:scale-105 hover:shadow-xl hover:shadow-[#00AEEF]/30 transition-all duration-300 flex items-center gap-2">
                  Get Free Consultation
                  <ArrowRight size={18} />
                </button>
              </Link>
              <a
                href="https://wa.link/qgr50h"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] text-white font-bold text-base px-8 py-4 rounded-xl font-['Montserrat'] tracking-wide hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(0,174,239,0.4)] transition-all duration-300"
              >
                <MessageCircle size={18} className="text-[#25D366]" />
                Get Free Audit
              </a>
            </div>

            {/* Lead magnet */}
            <div className="mt-8 p-4 rounded-xl border border-[rgba(0,174,239,0.2)] bg-[rgba(0,174,239,0.05)] inline-block">
              <p className="text-sm font-['DM_Sans'] text-slate-300">
                <span className="text-[#00AEEF] font-bold">FREE for this week:</span> SEO Audit + Website Analysis + Custom Marketing Plan
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-slate-400 text-xs font-['DM_Sans']">Scroll to explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#00AEEF] to-transparent" />
        </div>
      </section>

      {/* ===== STATS BAND ===== */}
      <section style={{ background: "#0D1230", borderTop: "1px solid rgba(0,174,239,0.1)", borderBottom: "1px solid rgba(0,174,239,0.1)" }}>
        <div className="container py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section className="section-pad" style={{ background: "#06091A" }}>
        <div className="container">
          {/* Section header */}
          <div className="text-center mb-14">
            <span className="text-[#00AEEF] text-sm font-bold font-['Montserrat'] uppercase tracking-widest mb-3 block">What We Do</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-['Montserrat'] text-white mb-4">
              Services That Drive <span className="gradient-text">Real Results</span>
            </h2>
            <p className="text-slate-400 text-lg font-['DM_Sans'] max-w-2xl mx-auto">
              From SEO to stunning visuals — we offer everything your business needs to dominate online and convert visitors into paying customers.
            </p>
          </div>

          {/* Services grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service, i) => (
              <ServiceCard key={service.title} service={service} index={i} />
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link href="/services">
              <button className="border border-[rgba(0,174,239,0.4)] text-[#00AEEF] font-bold text-sm px-8 py-3.5 rounded-xl font-['Montserrat'] tracking-wide hover:bg-[rgba(0,174,239,0.1)] transition-all duration-300 flex items-center gap-2 mx-auto">
                View All Services <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section
        className="section-pad relative overflow-hidden"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663571710539/2AKrWQ2ThXRHggBVBCqHwp/services-bg-W92pAwPMLF7V5NTZy5UzDd.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(6,9,26,0.88)" }} />
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div>
              <span className="text-[#00AEEF] text-sm font-bold font-['Montserrat'] uppercase tracking-widest mb-3 block">Why Digitaldaari</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-['Montserrat'] text-white mb-6">
                We Don't Just Market.<br />
                <span className="gradient-text">We Deliver Growth.</span>
              </h2>
              <p className="text-slate-400 text-lg font-['DM_Sans'] leading-relaxed mb-8">
                Most agencies promise results. We prove them. With transparent reporting, dedicated account managers, and a results-first approach, Digitaldaari is the growth partner your business deserves.
              </p>
              <Link href="/contact">
                <button className="shimmer-btn text-white font-bold text-sm px-7 py-3.5 rounded-xl font-['Montserrat'] tracking-wide hover:scale-105 transition-all duration-300 flex items-center gap-2">
                  Start Growing Today <ArrowRight size={16} />
                </button>
              </Link>
            </div>

            {/* Right: Features grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {whyUs.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="card-glow rounded-xl p-5 bg-[rgba(13,18,48,0.8)]">
                    <div className="service-icon-wrap mb-3">
                      <Icon size={20} className="text-[#00AEEF]" />
                    </div>
                    <h4 className="text-white font-bold text-sm mb-1.5 font-['Montserrat']">{item.title}</h4>
                    <p className="text-slate-400 text-xs leading-relaxed font-['DM_Sans']">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section-pad" style={{ background: "#06091A" }}>
        <div className="container">
          <div className="text-center mb-14">
            <span className="text-[#00AEEF] text-sm font-bold font-['Montserrat'] uppercase tracking-widest mb-3 block">Client Stories</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-['Montserrat'] text-white mb-4">
              What Our Clients <span className="gradient-text">Say About Us</span>
            </h2>
            <p className="text-slate-400 text-lg font-['DM_Sans'] max-w-xl mx-auto">
              Real results from real businesses. Here's what our clients say after working with Digitaldaari.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={t.name} className="testimonial-card">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="text-[#F59E0B] fill-[#F59E0B]" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-slate-300 text-sm leading-relaxed font-['DM_Sans'] mb-6 italic">
                  "{t.text}"
                </p>
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm font-['Montserrat']">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm font-['Montserrat']">{t.name}</p>
                    <p className="text-slate-500 text-xs font-['DM_Sans']">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LEAD MAGNETS ===== */}
      <section style={{ background: "#0D1230", borderTop: "1px solid rgba(0,174,239,0.1)" }}>
        <div className="container py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black font-['Montserrat'] text-white mb-3">
              Get These <span className="gradient-text">FREE Resources</span> Today
            </h2>
            <p className="text-slate-400 font-['DM_Sans']">No strings attached. Just pure value to help your business grow.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { title: "Free SEO Audit", desc: "Discover why your website isn't ranking and get a detailed action plan.", icon: Search, cta: "Claim Free SEO Audit" },
              { title: "Free Website Demo", desc: "See exactly how your new website will look before we build it.", icon: Globe, cta: "Get Free Website Demo" },
              { title: "Free Marketing Plan", desc: "A custom 90-day marketing roadmap tailored to your business goals.", icon: TrendingUp, cta: "Get My Free Plan" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="card-glow rounded-xl p-6 bg-[#06091A] text-center">
                  <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2 font-['Montserrat']">{item.title}</h3>
                  <p className="text-slate-400 text-sm font-['DM_Sans'] mb-5">{item.desc}</p>
                  <Link href="/contact">
                    <button className="w-full shimmer-btn text-white font-bold text-sm py-3 rounded-lg font-['Montserrat'] tracking-wide hover:scale-105 transition-transform duration-200">
                      {item.cta}
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA SECTION ===== */}
      <section
        className="relative section-pad overflow-hidden"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663571710539/2AKrWQ2ThXRHggBVBCqHwp/cta-bg-fFKXsuvhuVkYZUHHac7WC3.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(6,9,26,0.85)" }} />
        <div className="container relative z-10 text-center">
          <span className="badge-urgent mb-4 inline-block">Act Now — Limited Slots</span>
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-black font-['Montserrat'] text-white mb-6">
            Ready to <span className="gradient-text">10X Your Business?</span>
          </h2>
          <p className="text-slate-300 text-lg md:text-xl font-['DM_Sans'] max-w-2xl mx-auto mb-10">
            Join 200+ businesses that trust Digitaldaari to grow their online presence. Book your free strategy call today — we only take 5 new clients per month.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <button className="shimmer-btn text-white font-black text-lg px-10 py-5 rounded-xl font-['Montserrat'] tracking-wide hover:scale-105 hover:shadow-2xl hover:shadow-[#00AEEF]/40 transition-all duration-300 flex items-center gap-3">
                Book Free Strategy Call <Phone size={20} />
              </button>
            </Link>
            <a
              href="https://wa.link/qgr50h"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#25D366] text-white font-black text-lg px-10 py-5 rounded-xl font-['Montserrat'] tracking-wide hover:bg-[#22C55E] hover:scale-105 transition-all duration-300"
            >
              <MessageCircle size={20} />
              WhatsApp Us Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
