/* ============================================================
   CASE STUDIES PAGE — Problem → Solution → Results
   Design: Electric Growth — Dark Navy + Sky Blue
   ============================================================ */

import { Link } from "wouter";
import {
  TrendingUp, Search, Globe, Share2, ArrowRight, MessageCircle,
  CheckCircle, BarChart2, Users, Star
} from "lucide-react";
import { useScrollAnimation, useCountUp } from "@/hooks/useScrollAnimation";

const caseStudies = [
  {
    id: 1,
    category: "Local SEO",
    icon: Search,
    client: "Sharma's Restaurant",
    industry: "Food & Beverage",
    location: "Delhi, India",
    duration: "3 Months",
    problem: {
      title: "Invisible Online Despite Great Food",
      desc: "Sharma's Restaurant had been serving authentic North Indian cuisine for 12 years, but their online presence was virtually non-existent. They were ranking on page 8 of Google for 'best restaurant near me' and getting only 2-3 online inquiries per week despite having a loyal offline customer base.",
      challenges: [
        "Ranking on page 8 for key local search terms",
        "Unoptimized Google Business Profile with no photos",
        "Zero online reviews despite hundreds of satisfied customers",
        "No local citations or directory listings",
      ],
    },
    solution: {
      title: "Comprehensive Local SEO Overhaul",
      desc: "We implemented a full Local SEO strategy focused on Google Business Profile optimization, systematic review generation, and local citation building.",
      actions: [
        "Complete Google Business Profile optimization with 50+ photos",
        "Implemented review generation system — collected 120+ 5-star reviews",
        "Built citations across 60+ local directories",
        "Created location-specific landing pages",
        "Optimized website for 25 high-intent local keywords",
      ],
    },
    results: [
      { metric: "Google Rankings", before: "Page 8", after: "Position 1-3", icon: TrendingUp },
      { metric: "Weekly Online Inquiries", before: "2-3", after: "25-30", icon: Users },
      { metric: "Monthly Revenue Increase", before: "Baseline", after: "+65%", icon: BarChart2 },
      { metric: "Google Reviews", before: "8 reviews", after: "120+ reviews", icon: Star },
    ],
    testimonial: "Digitaldaari completely transformed our online presence. We went from being invisible on Google to ranking #1 in just 3 months. Our footfall has increased by 60% and we're getting 25+ online table reservations every week!",
    author: "Rajesh Sharma, Owner",
    bgColor: "#00AEEF",
  },
  {
    id: 2,
    category: "Website Design + SEO",
    icon: Globe,
    client: "TechStart Solutions",
    industry: "B2B SaaS Startup",
    location: "Bangalore, India",
    duration: "4 Months",
    problem: {
      title: "Outdated Website Killing Conversions",
      desc: "TechStart Solutions had a great product but their 5-year-old website was costing them leads. The site was slow, not mobile-friendly, and had a 78% bounce rate. They were spending ₹50,000/month on Google Ads but converting less than 1% of visitors.",
      challenges: [
        "78% bounce rate due to poor user experience",
        "Website loading in 8+ seconds on mobile",
        "No clear value proposition or call-to-action",
        "Less than 1% conversion rate on paid traffic",
      ],
    },
    solution: {
      title: "New Website + Conversion Optimization",
      desc: "We redesigned their website from scratch with a conversion-first approach, then implemented technical SEO to reduce dependency on paid ads.",
      actions: [
        "Complete website redesign with conversion-optimized layout",
        "Reduced page load time from 8s to 1.8s",
        "Created clear value proposition and strategic CTAs",
        "Implemented technical SEO foundation",
        "A/B tested landing pages to maximize conversions",
      ],
    },
    results: [
      { metric: "Bounce Rate", before: "78%", after: "32%", icon: TrendingUp },
      { metric: "Conversion Rate", before: "0.8%", after: "4.2%", icon: BarChart2 },
      { metric: "Page Load Speed", before: "8.2 seconds", after: "1.8 seconds", icon: TrendingUp },
      { metric: "Monthly Leads", before: "12 leads", after: "67 leads", icon: Users },
    ],
    testimonial: "The new website Digitaldaari built for us is incredible. Our conversion rate went from 0.8% to 4.2% — that's a 5x improvement! We're now getting 67 qualified leads per month from the same ad spend.",
    author: "Priya Nair, Founder",
    bgColor: "#0072BC",
  },
  {
    id: 3,
    category: "Social Media Marketing",
    icon: Share2,
    client: "Glamour Studio",
    industry: "Beauty & Wellness",
    location: "Mumbai, India",
    duration: "6 Months",
    problem: {
      title: "Zero Social Media Presence",
      desc: "Glamour Studio, a premium beauty salon, had 340 Instagram followers and was posting inconsistently. They were relying entirely on word-of-mouth referrals and saw no growth for 2 years. Their competitors were building massive social followings and attracting new clients daily.",
      challenges: [
        "Only 340 Instagram followers with 0.5% engagement rate",
        "Inconsistent posting — 2-3 times per month",
        "No content strategy or brand identity on social",
        "Zero leads generated from social media",
      ],
    },
    solution: {
      title: "Full Social Media Management + Content Strategy",
      desc: "We developed a comprehensive social media strategy with daily content creation, community management, and targeted paid promotion.",
      actions: [
        "Developed brand identity and content pillars for social",
        "Created and posted 30 pieces of content per month",
        "Ran targeted Instagram and Facebook ad campaigns",
        "Implemented influencer collaboration strategy",
        "Set up WhatsApp Business for lead capture",
      ],
    },
    results: [
      { metric: "Instagram Followers", before: "340", after: "12,400+", icon: Users },
      { metric: "Engagement Rate", before: "0.5%", after: "6.8%", icon: TrendingUp },
      { metric: "Monthly Bookings from Social", before: "0", after: "45+", icon: BarChart2 },
      { metric: "Monthly Revenue from Social", before: "₹0", after: "₹1.8L+", icon: Star },
    ],
    testimonial: "In 6 months, Digitaldaari grew our Instagram from 340 to 12,400 followers. More importantly, we now get 45+ bookings every month directly from social media. It's become our #1 source of new clients!",
    author: "Meena Kapoor, Owner",
    bgColor: "#00AEEF",
  },
];

function MetricCard({ metric, index }: { metric: typeof caseStudies[0]["results"][0]; index: number }) {
  const { ref, isVisible } = useScrollAnimation();
  const Icon = metric.icon;
  return (
    <div
      ref={ref}
      className="bg-[#06091A] border border-[rgba(0,174,239,0.15)] rounded-xl p-5"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: `all 0.5s ease ${index * 0.1}s`,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} className="text-[#00AEEF]" />
        <span className="text-slate-400 text-xs font-['DM_Sans']">{metric.metric}</span>
      </div>
      <div className="flex items-end gap-3">
        <div>
          <p className="text-slate-500 text-xs font-['DM_Sans'] mb-1">Before</p>
          <p className="text-slate-400 font-bold font-['Montserrat'] text-sm">{metric.before}</p>
        </div>
        <ArrowRight size={14} className="text-[#00AEEF] mb-1 flex-shrink-0" />
        <div>
          <p className="text-slate-500 text-xs font-['DM_Sans'] mb-1">After</p>
          <p className="text-[#00AEEF] font-black font-['Montserrat'] text-lg">{metric.after}</p>
        </div>
      </div>
    </div>
  );
}

export default function CaseStudies() {
  return (
    <div className="min-h-screen" style={{ background: "#06091A" }}>

      {/* ===== HERO ===== */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-full" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(0,174,239,0.08) 0%, transparent 70%)" }} />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-[#00AEEF] text-sm font-bold font-['Montserrat'] uppercase tracking-widest mb-4 block">Proven Results</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-['Montserrat'] text-white mb-6">
              Real Businesses. <span className="gradient-text">Real Results.</span>
            </h1>
            <p className="text-slate-300 text-lg font-['DM_Sans'] leading-relaxed">
              Don't just take our word for it. See exactly how we've helped businesses like yours achieve remarkable growth through data-driven digital marketing.
            </p>
          </div>
        </div>
      </section>

      {/* ===== CASE STUDIES ===== */}
      <section className="section-pad" style={{ background: "#06091A" }}>
        <div className="container">
          <div className="space-y-16">
            {caseStudies.map((cs, idx) => {
              const Icon = cs.icon;
              return (
                <div key={cs.id} className="rounded-2xl overflow-hidden border border-[rgba(0,174,239,0.15)]" style={{ background: "#0D1230" }}>
                  {/* Case Study Header */}
                  <div className="p-8 border-b border-[rgba(0,174,239,0.1)]">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="service-icon-wrap">
                          <Icon size={22} className="text-[#00AEEF]" />
                        </div>
                        <div>
                          <span className="text-[#00AEEF] text-xs font-bold font-['Montserrat'] uppercase tracking-widest">{cs.category}</span>
                          <h2 className="text-2xl font-black font-['Montserrat'] text-white">{cs.client}</h2>
                          <p className="text-slate-400 text-sm font-['DM_Sans']">{cs.industry} · {cs.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-[rgba(0,174,239,0.1)] border border-[rgba(0,174,239,0.2)] rounded-full px-4 py-2">
                        <span className="text-[#00AEEF] text-sm font-bold font-['DM_Sans']">Duration: {cs.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="grid lg:grid-cols-2 gap-10">
                      {/* Problem */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                            <span className="text-red-400 text-xs font-bold">!</span>
                          </div>
                          <h3 className="text-white font-bold text-lg font-['Montserrat']">The Problem</h3>
                        </div>
                        <h4 className="text-red-400 font-semibold text-sm font-['DM_Sans'] mb-3">{cs.problem.title}</h4>
                        <p className="text-slate-400 text-sm font-['DM_Sans'] leading-relaxed mb-4">{cs.problem.desc}</p>
                        <ul className="space-y-2">
                          {cs.problem.challenges.map((c) => (
                            <li key={c} className="flex items-start gap-2 text-sm text-slate-400 font-['DM_Sans']">
                              <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Solution */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-full bg-[rgba(0,174,239,0.1)] border border-[rgba(0,174,239,0.3)] flex items-center justify-center">
                            <span className="text-[#00AEEF] text-xs font-bold">✓</span>
                          </div>
                          <h3 className="text-white font-bold text-lg font-['Montserrat']">Our Solution</h3>
                        </div>
                        <h4 className="text-[#00AEEF] font-semibold text-sm font-['DM_Sans'] mb-3">{cs.solution.title}</h4>
                        <p className="text-slate-400 text-sm font-['DM_Sans'] leading-relaxed mb-4">{cs.solution.desc}</p>
                        <ul className="space-y-2">
                          {cs.solution.actions.map((a) => (
                            <li key={a} className="flex items-start gap-2 text-sm text-slate-300 font-['DM_Sans']">
                              <CheckCircle size={14} className="text-[#00AEEF] mt-0.5 flex-shrink-0" />
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Results */}
                    <div className="mt-10">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center">
                          <TrendingUp size={14} className="text-white" />
                        </div>
                        <h3 className="text-white font-bold text-lg font-['Montserrat']">The Results</h3>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {cs.results.map((r, i) => (
                          <MetricCard key={r.metric} metric={r} index={i} />
                        ))}
                      </div>
                    </div>

                    {/* Testimonial */}
                    <div className="mt-8 p-6 rounded-xl bg-[rgba(0,174,239,0.05)] border border-[rgba(0,174,239,0.15)]">
                      <p className="text-slate-300 text-sm font-['DM_Sans'] leading-relaxed italic mb-4">
                        "{cs.testimonial}"
                      </p>
                      <p className="text-[#00AEEF] font-bold text-sm font-['Montserrat']">— {cs.author}</p>
                    </div>
                  </div>
                </div>
              );
            })}
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
          <h2 className="text-3xl md:text-4xl font-black font-['Montserrat'] text-white mb-4">
            Ready to Be Our <span className="gradient-text">Next Success Story?</span>
          </h2>
          <p className="text-slate-300 text-lg font-['DM_Sans'] max-w-xl mx-auto mb-8">
            Book a free strategy call and let's discuss how we can deliver similar results for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <button className="shimmer-btn text-white font-black text-base px-8 py-4 rounded-xl font-['Montserrat'] tracking-wide hover:scale-105 transition-all duration-300 flex items-center gap-2">
                Get Free Strategy Call <ArrowRight size={18} />
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
