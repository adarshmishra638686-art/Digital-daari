/* ============================================================
   ABOUT PAGE — Brand story, mission, vision, team, CTA
   Design: Electric Growth — Dark Navy + Sky Blue
   ============================================================ */

import { Link } from "wouter";
import {
  Target, Eye, Heart, Zap, Users, TrendingUp, Award, CheckCircle,
  ArrowRight, MessageCircle
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const values = [
  { icon: Target, title: "Results First", desc: "We measure success by the growth we deliver, not the hours we bill." },
  { icon: Heart, title: "Client Obsessed", desc: "Your success is our success. We treat every client like our only client." },
  { icon: Zap, title: "Always Innovating", desc: "Digital marketing evolves fast. We stay ahead so you stay ahead." },
  { icon: Award, title: "Uncompromising Quality", desc: "From strategy to execution, we hold ourselves to the highest standards." },
];

const differentiators = [
  "Full-service agency — SEO, design, video, ads under one roof",
  "Dedicated account manager for every client",
  "Transparent monthly reporting with real metrics",
  "No long-term lock-in contracts",
  "Proven results across 200+ local businesses",
  "Deep understanding of the Indian market",
  "Creative + data-driven approach combined",
  "WhatsApp-first communication for quick support",
];

const audience = [
  { icon: "🏪", title: "Local Businesses", desc: "Restaurants, salons, clinics, retail shops looking to attract more local customers." },
  { icon: "🚀", title: "Startups", desc: "Early-stage companies that need to build brand awareness and acquire their first customers fast." },
  { icon: "🛠️", title: "Service Providers", desc: "Contractors, consultants, coaches, and professionals who want more inbound leads." },
  { icon: "⭐", title: "Personal Brands", desc: "Influencers, speakers, and creators who want to build authority and monetize their audience." },
];

export default function About() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: missionRef, isVisible: missionVisible } = useScrollAnimation();
  const { ref: diffRef, isVisible: diffVisible } = useScrollAnimation();

  return (
    <div className="min-h-screen" style={{ background: "#06091A" }}>

      {/* ===== HERO ===== */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-full" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(0,174,239,0.08) 0%, transparent 70%)" }} />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-[#00AEEF] text-sm font-bold font-['Montserrat'] uppercase tracking-widest mb-4 block">Our Story</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-['Montserrat'] text-white mb-6">
              We Are <span className="gradient-text">Digitaldaari</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl font-['DM_Sans'] leading-relaxed">
              A premium digital marketing and creative agency on a mission to help local businesses, startups, and personal brands grow faster, smarter, and stronger online.
            </p>
          </div>
        </div>
      </section>

      {/* ===== BRAND STORY ===== */}
      <section className="section-pad" style={{ background: "#0D1230" }}>
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#00AEEF] text-sm font-bold font-['Montserrat'] uppercase tracking-widest mb-3 block">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-black font-['Montserrat'] text-white mb-6">
                Born From a Simple Belief:<br />
                <span className="gradient-text">Every Business Deserves to Grow</span>
              </h2>
              <div className="space-y-4 text-slate-400 font-['DM_Sans'] leading-relaxed">
                <p>
                  Digitaldaari was founded with one clear purpose: to give local businesses and startups access to the same world-class digital marketing strategies that big corporations use — at a price that makes sense.
                </p>
                <p>
                  We saw too many talented business owners struggling online. Not because their products or services weren't good enough, but because they didn't have the right digital presence. We decided to change that.
                </p>
                <p>
                  Today, Digitaldaari is a full-service digital marketing and creative agency serving 200+ clients across India. From SEO and website design to professional photography and video production — we handle everything so you can focus on what you do best: running your business.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663571710539/2AKrWQ2ThXRHggBVBCqHwp/about-visual-AeUonEMd8pGqgi8LaH6wBM.webp"
                alt="Digitaldaari Digital Marketing Services"
                className="w-full rounded-2xl"
                style={{ border: "1px solid rgba(0,174,239,0.2)", boxShadow: "0 0 40px rgba(0,174,239,0.1)" }}
              />
              {/* Floating stat cards */}
              <div className="absolute -bottom-6 -left-6 bg-[#0D1230] border border-[rgba(0,174,239,0.3)] rounded-xl p-4 shadow-xl">
                <div className="text-3xl font-black font-['Montserrat'] gradient-text">200+</div>
                <div className="text-slate-400 text-xs font-['DM_Sans']">Happy Clients</div>
              </div>
              <div className="absolute -top-6 -right-6 bg-[#0D1230] border border-[rgba(0,174,239,0.3)] rounded-xl p-4 shadow-xl">
                <div className="text-3xl font-black font-['Montserrat'] gradient-text">5★</div>
                <div className="text-slate-400 text-xs font-['DM_Sans']">Google Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MISSION & VISION ===== */}
      <section className="section-pad" style={{ background: "#06091A" }}>
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card-glow rounded-2xl p-8 bg-[#0D1230]">
              <div className="service-icon-wrap mb-5">
                <Target size={24} className="text-[#00AEEF]" />
              </div>
              <h3 className="text-2xl font-black font-['Montserrat'] text-white mb-4">Our Mission</h3>
              <p className="text-slate-400 font-['DM_Sans'] leading-relaxed">
                To empower local businesses, startups, and personal brands with world-class digital marketing strategies that drive measurable growth — making premium digital services accessible to every business, regardless of size.
              </p>
            </div>
            <div className="card-glow rounded-2xl p-8 bg-[#0D1230]">
              <div className="service-icon-wrap mb-5">
                <Eye size={24} className="text-[#00AEEF]" />
              </div>
              <h3 className="text-2xl font-black font-['Montserrat'] text-white mb-4">Our Vision</h3>
              <p className="text-slate-400 font-['DM_Sans'] leading-relaxed">
                To become India's most trusted digital marketing partner for local businesses — known not just for the results we deliver, but for the relationships we build and the businesses we transform along the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="section-pad" style={{ background: "#0D1230" }}>
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-[#00AEEF] text-sm font-bold font-['Montserrat'] uppercase tracking-widest mb-3 block">What We Stand For</span>
            <h2 className="text-3xl md:text-4xl font-black font-['Montserrat'] text-white">
              Our Core <span className="gradient-text">Values</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="card-glow rounded-xl p-6 bg-[#06091A] text-center">
                  <div className="service-icon-wrap mx-auto mb-4">
                    <Icon size={22} className="text-[#00AEEF]" />
                  </div>
                  <h4 className="text-white font-bold text-base mb-2 font-['Montserrat']">{v.title}</h4>
                  <p className="text-slate-400 text-sm font-['DM_Sans'] leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== WHAT MAKES US DIFFERENT ===== */}
      <section className="section-pad" style={{ background: "#06091A" }}>
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#00AEEF] text-sm font-bold font-['Montserrat'] uppercase tracking-widest mb-3 block">Why Choose Us</span>
              <h2 className="text-3xl md:text-4xl font-black font-['Montserrat'] text-white mb-6">
                What Makes Digitaldaari <span className="gradient-text">Different</span>
              </h2>
              <p className="text-slate-400 font-['DM_Sans'] leading-relaxed mb-8">
                We're not just another agency. We're your growth partner — invested in your success as much as you are.
              </p>
              <Link href="/contact">
                <button className="shimmer-btn text-white font-bold text-sm px-7 py-3.5 rounded-xl font-['Montserrat'] tracking-wide hover:scale-105 transition-all duration-300 flex items-center gap-2">
                  Work With Us <ArrowRight size={16} />
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {differentiators.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-[#0D1230] border border-[rgba(0,174,239,0.1)] hover:border-[rgba(0,174,239,0.3)] transition-colors">
                  <CheckCircle size={18} className="text-[#00AEEF] flex-shrink-0" />
                  <span className="text-slate-300 text-sm font-['DM_Sans']">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TARGET AUDIENCE ===== */}
      <section className="section-pad" style={{ background: "#0D1230" }}>
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-[#00AEEF] text-sm font-bold font-['Montserrat'] uppercase tracking-widest mb-3 block">Who We Serve</span>
            <h2 className="text-3xl md:text-4xl font-black font-['Montserrat'] text-white mb-4">
              Built For <span className="gradient-text">Ambitious Businesses</span>
            </h2>
            <p className="text-slate-400 font-['DM_Sans'] max-w-xl mx-auto">
              We work best with businesses that are serious about growth and ready to invest in their digital future.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {audience.map((a) => (
              <div key={a.title} className="card-glow rounded-xl p-6 bg-[#06091A] text-center">
                <div className="text-4xl mb-4">{a.icon}</div>
                <h4 className="text-white font-bold text-base mb-2 font-['Montserrat']">{a.title}</h4>
                <p className="text-slate-400 text-sm font-['DM_Sans'] leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section
        className="relative section-pad overflow-hidden"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663571710539/2AKrWQ2ThXRHggBVBCqHwp/cta-bg-fFKXsuvhuVkYZUHHac7WC3.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(6,9,26,0.88)" }} />
        <div className="container relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-['Montserrat'] text-white mb-6">
            Let's Build Something <span className="gradient-text">Amazing Together</span>
          </h2>
          <p className="text-slate-300 text-lg font-['DM_Sans'] max-w-xl mx-auto mb-8">
            Ready to take your business to the next level? Book a free strategy call and let's map out your growth plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <button className="shimmer-btn text-white font-black text-base px-8 py-4 rounded-xl font-['Montserrat'] tracking-wide hover:scale-105 transition-all duration-300 flex items-center gap-2">
                Get Free Consultation <ArrowRight size={18} />
              </button>
            </Link>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white font-black text-base px-8 py-4 rounded-xl font-['Montserrat'] tracking-wide hover:bg-[#22C55E] transition-all duration-300"
            >
              <MessageCircle size={18} />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
