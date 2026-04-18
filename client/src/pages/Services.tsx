/* ============================================================
   SERVICES PAGE — All 9 services with description, benefits, process
   Design: Electric Growth — Dark Navy + Sky Blue
   ============================================================ */

import { useState } from "react";
import { Link } from "wouter";
import {
  Search, MapPin, Globe, Palette, Video, Camera, Share2, MousePointer,
  CheckCircle, ArrowRight, MessageCircle, ChevronDown
} from "lucide-react";

const services = [
  {
    id: "seo",
    icon: Search,
    title: "Search Engine Optimization",
    subtitle: "Rank Higher. Get Found. Grow Faster.",
    description: "Our data-driven SEO strategies are designed to get your website ranking on page 1 of Google for the keywords your customers are actually searching. We combine technical SEO, on-page optimization, and high-quality link building to deliver sustainable, long-term organic growth.",
    benefits: [
      "Rank on page 1 of Google for your target keywords",
      "Drive consistent organic traffic without paying for every click",
      "Build long-term domain authority and brand credibility",
      "Outrank your competitors in search results",
      "Get detailed monthly reports on rankings and traffic",
    ],
    process: [
      { step: "01", title: "SEO Audit", desc: "Complete technical and content audit of your website" },
      { step: "02", title: "Keyword Research", desc: "Identify high-value keywords your customers search" },
      { step: "03", title: "On-Page Optimization", desc: "Optimize content, meta tags, and site structure" },
      { step: "04", title: "Link Building", desc: "Build authoritative backlinks to boost domain authority" },
      { step: "05", title: "Monitor & Report", desc: "Track rankings and refine strategy monthly" },
    ],
    color: "#00AEEF",
  },
  {
    id: "local-seo",
    icon: MapPin,
    title: "Local SEO",
    subtitle: "Dominate Your Local Market.",
    description: "If you serve customers in a specific area, Local SEO is the most powerful tool in your arsenal. We optimize your Google Business Profile, build local citations, and implement geo-targeted strategies that put your business at the top of local search results — right when nearby customers are looking.",
    benefits: [
      "Appear in Google Maps and local search results",
      "Attract customers who are ready to buy right now",
      "Dominate 'near me' searches in your area",
      "Build a strong local reputation with reviews",
      "Outperform local competitors consistently",
    ],
    process: [
      { step: "01", title: "Google Business Optimization", desc: "Complete GBP setup and optimization" },
      { step: "02", title: "Local Citations", desc: "Build consistent NAP across 50+ directories" },
      { step: "03", title: "Local Keyword Strategy", desc: "Target location-specific search terms" },
      { step: "04", title: "Review Management", desc: "Generate and manage customer reviews" },
      { step: "05", title: "Local Link Building", desc: "Earn links from local websites and publications" },
    ],
    color: "#0072BC",
  },
  {
    id: "website",
    icon: Globe,
    title: "Website Designing",
    subtitle: "Your Website Should Work as Hard as You Do.",
    description: "We design and develop professional, fast-loading, mobile-first websites that don't just look beautiful — they convert visitors into customers. Every website we build is optimized for SEO, speed, and user experience, with clear calls-to-action that drive real business results.",
    benefits: [
      "Professional, conversion-optimized design",
      "Mobile-first, fully responsive layout",
      "Lightning-fast loading speed (under 3 seconds)",
      "SEO-ready structure from day one",
      "Easy to update and manage yourself",
    ],
    process: [
      { step: "01", title: "Discovery", desc: "Understand your business, goals, and target audience" },
      { step: "02", title: "Design Mockup", desc: "Create stunning visual designs for your approval" },
      { step: "03", title: "Development", desc: "Build your website with clean, fast code" },
      { step: "04", title: "Testing", desc: "Test across all devices and browsers" },
      { step: "05", title: "Launch & Support", desc: "Go live and provide ongoing maintenance" },
    ],
    color: "#00AEEF",
  },
  {
    id: "graphic-design",
    icon: Palette,
    title: "Graphic Design",
    subtitle: "Make Your Brand Impossible to Ignore.",
    description: "First impressions are everything. Our creative team designs stunning logos, brand identities, social media graphics, brochures, and marketing materials that make your brand stand out from the crowd and leave a lasting impression on your customers.",
    benefits: [
      "Professional logo and brand identity design",
      "Consistent visual language across all platforms",
      "Social media graphics that stop the scroll",
      "Print materials: brochures, business cards, banners",
      "Fast turnaround with unlimited revisions",
    ],
    process: [
      { step: "01", title: "Brand Brief", desc: "Understand your brand personality and target audience" },
      { step: "02", title: "Concept Creation", desc: "Develop multiple design concepts for review" },
      { step: "03", title: "Refinement", desc: "Refine chosen concept based on your feedback" },
      { step: "04", title: "Final Delivery", desc: "Deliver all files in required formats" },
      { step: "05", title: "Brand Guidelines", desc: "Create brand style guide for consistency" },
    ],
    color: "#0072BC",
  },
  {
    id: "video-editing",
    icon: Video,
    title: "Professional Video Editing",
    subtitle: "Turn Raw Footage Into Compelling Stories.",
    description: "Video is the most powerful content format online. Our professional video editors transform your raw footage into cinematic, engaging content that captures attention, tells your story, and drives action — whether for social media, YouTube, ads, or your website.",
    benefits: [
      "Cinematic color grading and professional finishing",
      "Motion graphics and animated text overlays",
      "Music selection and sound design",
      "Optimized for all platforms (YouTube, Instagram, Facebook)",
      "Fast delivery with multiple revision rounds",
    ],
    process: [
      { step: "01", title: "Footage Review", desc: "Review all raw footage and understand the vision" },
      { step: "02", title: "Rough Cut", desc: "Assemble the best clips in a logical sequence" },
      { step: "03", title: "Color & Sound", desc: "Apply color grading and audio enhancement" },
      { step: "04", title: "Graphics & Text", desc: "Add motion graphics, subtitles, and overlays" },
      { step: "05", title: "Final Export", desc: "Deliver in all required formats and resolutions" },
    ],
    color: "#00AEEF",
  },
  {
    id: "photoshoots",
    icon: Camera,
    title: "Photoshoots & Videoshoots",
    subtitle: "Professional Visuals That Elevate Your Brand.",
    description: "High-quality photos and videos are the foundation of a strong online presence. Our professional photographers and videographers capture your products, team, and brand story in a way that builds trust, attracts customers, and sets you apart from the competition.",
    benefits: [
      "Professional product and brand photography",
      "Corporate headshots and team photos",
      "Location and lifestyle shoots",
      "Promotional video production",
      "Fully edited, high-resolution deliverables",
    ],
    process: [
      { step: "01", title: "Pre-Production", desc: "Plan the shoot: concept, location, props, schedule" },
      { step: "02", title: "Shoot Day", desc: "Professional photography/videography session" },
      { step: "03", title: "Culling & Selection", desc: "Select the best shots from the session" },
      { step: "04", title: "Editing & Retouching", desc: "Professional editing and color correction" },
      { step: "05", title: "Delivery", desc: "Deliver high-resolution files ready for use" },
    ],
    color: "#0072BC",
  },
  {
    id: "social-media",
    icon: Share2,
    title: "Social Media Marketing",
    subtitle: "Build a Following. Build a Business.",
    description: "Social media is where your customers spend hours every day. We create and execute comprehensive social media strategies that build your following, engage your audience, and convert followers into paying customers — consistently and at scale.",
    benefits: [
      "Custom content strategy for your brand",
      "Daily content creation and scheduling",
      "Community management and engagement",
      "Influencer collaboration and partnerships",
      "Monthly analytics and performance reports",
    ],
    process: [
      { step: "01", title: "Audit & Strategy", desc: "Analyze current presence and build a content strategy" },
      { step: "02", title: "Content Calendar", desc: "Plan 30 days of content in advance" },
      { step: "03", title: "Content Creation", desc: "Design graphics, write captions, create videos" },
      { step: "04", title: "Posting & Engagement", desc: "Schedule posts and engage with your community" },
      { step: "05", title: "Analyze & Optimize", desc: "Review performance and refine strategy monthly" },
    ],
    color: "#00AEEF",
  },
  {
    id: "ppc",
    icon: MousePointer,
    title: "Pay Per Click (PPC)",
    subtitle: "Get Leads Today. Not Next Month.",
    description: "When you need results fast, PPC advertising delivers. Our certified Google Ads and Meta Ads specialists create highly targeted campaigns that put your business in front of the right people at the right time — maximizing your budget and delivering the highest possible ROI.",
    benefits: [
      "Immediate visibility and lead generation",
      "Highly targeted audience segmentation",
      "Optimized ad copy and landing pages",
      "Daily budget monitoring and optimization",
      "Detailed ROI tracking and reporting",
    ],
    process: [
      { step: "01", title: "Campaign Strategy", desc: "Define goals, audience, and budget allocation" },
      { step: "02", title: "Ad Creation", desc: "Write compelling ad copy and design creatives" },
      { step: "03", title: "Campaign Launch", desc: "Set up targeting, bidding, and tracking" },
      { step: "04", title: "Optimization", desc: "Daily monitoring and A/B testing for best results" },
      { step: "05", title: "Reporting", desc: "Weekly reports on spend, leads, and ROI" },
    ],
    color: "#0072BC",
  },
];

function ServiceSection({ service }: { service: typeof services[0] }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = service.icon;

  return (
    <div id={service.id} className="card-glow rounded-2xl overflow-hidden bg-[#0D1230]">
      {/* Header */}
      <div className="p-8">
        <div className="flex items-start gap-5">
          <div className="service-icon-wrap flex-shrink-0">
            <Icon size={24} className="text-[#00AEEF]" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-black font-['Montserrat'] text-white mb-1">{service.title}</h2>
            <p className="text-[#00AEEF] font-semibold font-['DM_Sans'] mb-4">{service.subtitle}</p>
            <p className="text-slate-400 font-['DM_Sans'] leading-relaxed">{service.description}</p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8">
          <h3 className="text-white font-bold text-lg font-['Montserrat'] mb-4">Key Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {service.benefits.map((b) => (
              <div key={b} className="flex items-start gap-2">
                <CheckCircle size={16} className="text-[#00AEEF] flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm font-['DM_Sans']">{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Process Toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-6 flex items-center gap-2 text-[#00AEEF] font-semibold text-sm font-['DM_Sans'] hover:text-white transition-colors"
        >
          {expanded ? "Hide Process" : "View Our Process"}
          <ChevronDown size={16} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Process Steps */}
      {expanded && (
        <div className="border-t border-[rgba(0,174,239,0.1)] p-8 bg-[rgba(0,174,239,0.03)]">
          <h3 className="text-white font-bold text-lg font-['Montserrat'] mb-6">Our Process</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {service.process.map((p, i) => (
              <div key={p.step} className="text-center">
                <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center mx-auto mb-3 text-white font-black text-sm font-['Montserrat']">
                  {p.step}
                </div>
                <h4 className="text-white font-bold text-sm mb-1 font-['Montserrat']">{p.title}</h4>
                <p className="text-slate-400 text-xs font-['DM_Sans'] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="px-8 pb-8">
        <Link href="/contact">
          <button className="shimmer-btn text-white font-bold text-sm px-6 py-3 rounded-xl font-['Montserrat'] tracking-wide hover:scale-105 transition-all duration-300 flex items-center gap-2">
            Get Started with {service.title} <ArrowRight size={16} />
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <div className="min-h-screen" style={{ background: "#06091A" }}>

      {/* ===== HERO ===== */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-full" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(0,174,239,0.08) 0%, transparent 70%)" }} />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-[#00AEEF] text-sm font-bold font-['Montserrat'] uppercase tracking-widest mb-4 block">What We Offer</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-['Montserrat'] text-white mb-6">
              Services That Drive <span className="gradient-text">Real Business Growth</span>
            </h1>
            <p className="text-slate-300 text-lg font-['DM_Sans'] leading-relaxed mb-8">
              From SEO to stunning visuals — we offer everything your business needs to dominate online and convert visitors into paying customers.
            </p>
            <div className="inline-flex items-center gap-2 bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.3)] rounded-full px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
              <span className="text-[#F59E0B] text-sm font-bold font-['DM_Sans']">Free consultation available — Book now before slots fill up</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {services.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-xs font-medium font-['DM_Sans'] px-4 py-2 rounded-full border border-[rgba(0,174,239,0.2)] text-slate-400 hover:text-[#00AEEF] hover:border-[#00AEEF] transition-all duration-200"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES LIST ===== */}
      <section className="section-pad" style={{ background: "#06091A" }}>
        <div className="container">
          <div className="space-y-8">
            {services.map((service) => (
              <ServiceSection key={service.id} service={service} />
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
          <h2 className="text-3xl md:text-4xl font-black font-['Montserrat'] text-white mb-4">
            Not Sure Which Service You Need?
          </h2>
          <p className="text-slate-300 text-lg font-['DM_Sans'] max-w-xl mx-auto mb-8">
            Book a free consultation and we'll recommend the exact services that will deliver the best results for your specific business.
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
