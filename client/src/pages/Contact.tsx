/* ============================================================
   CONTACT PAGE — Form, click-to-call, WhatsApp, lead magnets
   Design: Electric Growth — Dark Navy + Sky Blue
   ============================================================ */

import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Clock, CheckCircle, ArrowRight, Send } from "lucide-react";

const services = [
  "Search Engine Optimization (SEO)",
  "Local SEO",
  "Website Designing",
  "Graphic Design",
  "Video Editing",
  "Photoshoots / Videoshoots",
  "Social Media Marketing",
  "Pay Per Click (PPC)",
  "Multiple Services",
  "Not Sure — Need Advice",
];

const faqs = [
  {
    q: "How quickly will I see results?",
    a: "For SEO, you'll typically see initial improvements in 60-90 days and significant results in 3-6 months. For PPC and social media, results can be seen within the first 2-4 weeks.",
  },
  {
    q: "Do you have long-term contracts?",
    a: "No. We believe in earning your business every month. We offer monthly rolling agreements with no long-term lock-in. You can cancel anytime with 30 days notice.",
  },
  {
    q: "What is your pricing?",
    a: "Our pricing is customized based on your specific needs, industry, and goals. We offer packages for every budget. Book a free consultation to get a custom quote.",
  },
  {
    q: "Do you work with businesses outside India?",
    a: "Yes! While we specialize in the Indian market, we work with clients globally. Our digital marketing strategies are effective for businesses worldwide.",
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen" style={{ background: "#06091A" }}>

      {/* ===== HERO ===== */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-full" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(0,174,239,0.08) 0%, transparent 70%)" }} />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-[#00AEEF] text-sm font-bold font-['Montserrat'] uppercase tracking-widest mb-4 block">Get In Touch</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-['Montserrat'] text-white mb-6">
              Let's Grow Your <span className="gradient-text">Business Together</span>
            </h1>
            <p className="text-slate-300 text-lg font-['DM_Sans'] leading-relaxed">
              Book a free consultation and get a custom strategy for your business. We respond within 2 hours during business hours.
            </p>
            <div className="inline-flex items-center gap-2 mt-4 bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.3)] rounded-full px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
              <span className="text-[#F59E0B] text-sm font-bold font-['DM_Sans']">Only 5 new client slots available this month</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <section className="section-pad" style={{ background: "#06091A" }}>
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-10">

            {/* ===== CONTACT INFO ===== */}
            <div className="space-y-6">
              {/* Quick contact cards */}
              <a
                href="tel:+919876543210"
                className="block card-glow rounded-xl p-5 bg-[#0D1230] group"
              >
                <div className="flex items-center gap-4">
                  <div className="service-icon-wrap flex-shrink-0">
                    <Phone size={20} className="text-[#00AEEF]" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-['DM_Sans'] mb-0.5">Call Us Directly</p>
                    <p className="text-white font-bold font-['Montserrat']">+91 98765 43210</p>
                    <p className="text-slate-500 text-xs font-['DM_Sans']">Mon-Sat, 9am-7pm IST</p>
                  </div>
                </div>
              </a>

              <a
                href="https://wa.me/919876543210?text=Hi%20Digitaldaari!%20I%20want%20a%20free%20consultation."
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl p-5 bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[#25D366]/20 border border-[#25D366]/30 flex items-center justify-center flex-shrink-0">
                    <MessageCircle size={22} className="text-[#25D366]" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-['DM_Sans'] mb-0.5">WhatsApp Us</p>
                    <p className="text-white font-bold font-['Montserrat']">Chat on WhatsApp</p>
                    <p className="text-slate-500 text-xs font-['DM_Sans']">Typically replies in minutes</p>
                  </div>
                </div>
              </a>

              <a
                href="mailto:hello@digitaldaari.com"
                className="block card-glow rounded-xl p-5 bg-[#0D1230]"
              >
                <div className="flex items-center gap-4">
                  <div className="service-icon-wrap flex-shrink-0">
                    <Mail size={20} className="text-[#00AEEF]" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-['DM_Sans'] mb-0.5">Email Us</p>
                    <p className="text-white font-bold font-['Montserrat'] text-sm">hello@digitaldaari.com</p>
                    <p className="text-slate-500 text-xs font-['DM_Sans']">We reply within 2 hours</p>
                  </div>
                </div>
              </a>

              <div className="card-glow rounded-xl p-5 bg-[#0D1230]">
                <div className="flex items-center gap-4">
                  <div className="service-icon-wrap flex-shrink-0">
                    <Clock size={20} className="text-[#00AEEF]" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-['DM_Sans'] mb-0.5">Business Hours</p>
                    <p className="text-white font-bold font-['Montserrat'] text-sm">Mon – Sat: 9am – 7pm</p>
                    <p className="text-slate-500 text-xs font-['DM_Sans']">Sunday: By appointment</p>
                  </div>
                </div>
              </div>

              {/* Free resources */}
              <div className="rounded-xl p-5 bg-[rgba(0,174,239,0.05)] border border-[rgba(0,174,239,0.2)]">
                <h4 className="text-white font-bold text-sm font-['Montserrat'] mb-3">What You Get — Free</h4>
                <ul className="space-y-2">
                  {[
                    "Free SEO Audit (₹5,000 value)",
                    "Free Website Analysis",
                    "Custom 90-Day Marketing Plan",
                    "Competitor Analysis Report",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-slate-300 text-xs font-['DM_Sans']">
                      <CheckCircle size={13} className="text-[#00AEEF] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ===== CONTACT FORM ===== */}
            <div className="lg:col-span-2">
              <div className="card-glow rounded-2xl p-8 bg-[#0D1230]">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-5">
                      <CheckCircle size={32} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-black font-['Montserrat'] text-white mb-3">
                      Thank You! We'll Be In Touch.
                    </h3>
                    <p className="text-slate-400 font-['DM_Sans'] mb-6">
                      Your message has been received. Our team will contact you within 2 hours during business hours.
                    </p>
                    <a
                      href="https://wa.me/919876543210?text=Hi%20I%20just%20submitted%20the%20contact%20form%20on%20your%20website."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold text-sm px-6 py-3 rounded-xl font-['Montserrat'] hover:bg-[#22C55E] transition-colors"
                    >
                      <MessageCircle size={16} />
                      Also reach us on WhatsApp
                    </a>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h2 className="text-2xl font-black font-['Montserrat'] text-white mb-2">
                        Book Your Free Consultation
                      </h2>
                      <p className="text-slate-400 font-['DM_Sans'] text-sm">
                        Fill out the form below and we'll get back to you within 2 hours with a custom strategy for your business.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Name */}
                        <div>
                          <label className="block text-slate-300 text-sm font-medium font-['DM_Sans'] mb-2">
                            Full Name <span className="text-[#00AEEF]">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            className="w-full bg-[#06091A] border border-[rgba(0,174,239,0.2)] rounded-xl px-4 py-3.5 text-white placeholder-slate-500 font-['DM_Sans'] text-sm focus:outline-none focus:border-[#00AEEF] transition-colors"
                          />
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-slate-300 text-sm font-medium font-['DM_Sans'] mb-2">
                            Phone Number <span className="text-[#00AEEF]">*</span>
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            className="w-full bg-[#06091A] border border-[rgba(0,174,239,0.2)] rounded-xl px-4 py-3.5 text-white placeholder-slate-500 font-['DM_Sans'] text-sm focus:outline-none focus:border-[#00AEEF] transition-colors"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-slate-300 text-sm font-medium font-['DM_Sans'] mb-2">
                          Email Address <span className="text-[#00AEEF]">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          className="w-full bg-[#06091A] border border-[rgba(0,174,239,0.2)] rounded-xl px-4 py-3.5 text-white placeholder-slate-500 font-['DM_Sans'] text-sm focus:outline-none focus:border-[#00AEEF] transition-colors"
                        />
                      </div>

                      {/* Service */}
                      <div>
                        <label className="block text-slate-300 text-sm font-medium font-['DM_Sans'] mb-2">
                          Service Interested In <span className="text-[#00AEEF]">*</span>
                        </label>
                        <select
                          name="service"
                          required
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full bg-[#06091A] border border-[rgba(0,174,239,0.2)] rounded-xl px-4 py-3.5 text-white font-['DM_Sans'] text-sm focus:outline-none focus:border-[#00AEEF] transition-colors appearance-none"
                        >
                          <option value="" disabled className="text-slate-500">Select a service...</option>
                          {services.map((s) => (
                            <option key={s} value={s} className="bg-[#0D1230]">{s}</option>
                          ))}
                        </select>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-slate-300 text-sm font-medium font-['DM_Sans'] mb-2">
                          Tell Us About Your Business
                        </label>
                        <textarea
                          name="message"
                          rows={4}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Briefly describe your business and what you're looking to achieve..."
                          className="w-full bg-[#06091A] border border-[rgba(0,174,239,0.2)] rounded-xl px-4 py-3.5 text-white placeholder-slate-500 font-['DM_Sans'] text-sm focus:outline-none focus:border-[#00AEEF] transition-colors resize-none"
                        />
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full shimmer-btn text-white font-black text-base py-4 rounded-xl font-['Montserrat'] tracking-wide hover:scale-[1.02] hover:shadow-xl hover:shadow-[#00AEEF]/30 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            Get My Free Consultation
                            <ArrowRight size={18} />
                          </>
                        )}
                      </button>

                      <p className="text-slate-500 text-xs font-['DM_Sans'] text-center">
                        By submitting, you agree to be contacted by Digitaldaari. We never spam or share your information.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="section-pad" style={{ background: "#0D1230" }}>
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[#00AEEF] text-sm font-bold font-['Montserrat'] uppercase tracking-widest mb-3 block">FAQ</span>
              <h2 className="text-3xl md:text-4xl font-black font-['Montserrat'] text-white">
                Frequently Asked <span className="gradient-text">Questions</span>
              </h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="card-glow rounded-xl bg-[#06091A] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="text-white font-bold text-sm font-['Montserrat'] pr-4">{faq.q}</span>
                    <span className={`text-[#00AEEF] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}>
                      +
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 border-t border-[rgba(0,174,239,0.1)]">
                      <p className="text-slate-400 text-sm font-['DM_Sans'] leading-relaxed pt-4">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
