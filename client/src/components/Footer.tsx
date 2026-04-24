/* ============================================================
   FOOTER — Full footer with links, contact, social media
   Design: Dark navy surface, electric blue accents
   ============================================================ */

import { Link } from "wouter";
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube, Twitter } from "lucide-react";

const services = [
  "Search Engine Optimization",
  "Local SEO",
  "Website Designing",
  "Graphic Design",
  "Video Editing",
  "Photoshoots & Videoshoots",
  "Social Media Marketing",
  "Pay Per Click (PPC)",
];

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#06091A", borderTop: "1px solid rgba(0,174,239,0.12)" }}>
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img
              src="/Asset%2016@2000x.png"
              alt="Digitaldaari"
              className="h-12 w-auto mb-4" style={{backgroundColor: '#ffffff', borderRadius: '5px', borderWidth: '3px'}}
            />
            <p className="text-slate-400 text-sm leading-relaxed font-['DM_Sans'] mb-6">
              We are a premium digital marketing and creative agency helping local businesses, startups, and personal brands grow online with data-driven strategies.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#111840] border border-[rgba(0,174,239,0.2)] flex items-center justify-center text-slate-400 hover:text-[#00AEEF] hover:border-[#00AEEF] transition-all duration-200">
                <Instagram size={16} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#111840] border border-[rgba(0,174,239,0.2)] flex items-center justify-center text-slate-400 hover:text-[#00AEEF] hover:border-[#00AEEF] transition-all duration-200">
                <Facebook size={16} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#111840] border border-[rgba(0,174,239,0.2)] flex items-center justify-center text-slate-400 hover:text-[#00AEEF] hover:border-[#00AEEF] transition-all duration-200">
                <Youtube size={16} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#111840] border border-[rgba(0,174,239,0.2)] flex items-center justify-center text-slate-400 hover:text-[#00AEEF] hover:border-[#00AEEF] transition-all duration-200">
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold text-base mb-5 font-['Montserrat'] uppercase tracking-wider">
              Our Services
            </h4>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s}>
                  <Link href="/services">
                    <span className="text-slate-400 text-sm hover:text-[#00AEEF] transition-colors font-['DM_Sans'] flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00AEEF] opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      {s}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-5 font-['Montserrat'] uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>
                    <span className="text-slate-400 text-sm hover:text-[#00AEEF] transition-colors font-['DM_Sans'] flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00AEEF] opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      {l.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-base mb-5 font-['Montserrat'] uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+919956138641" className="flex items-start gap-3 text-slate-400 hover:text-[#00AEEF] transition-colors group">
                  <div className="service-icon-wrap w-9 h-9 mt-0.5 flex-shrink-0">
                    <Phone size={14} className="text-[#00AEEF]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-['DM_Sans'] mb-0.5">Call Us</p>
                    <p className="text-sm font-medium font-['DM_Sans']">+91 9956138641</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:hello@digitaldaari.com" className="flex items-start gap-3 text-slate-400 hover:text-[#00AEEF] transition-colors group">
                  <div className="service-icon-wrap w-9 h-9 mt-0.5 flex-shrink-0">
                    <Mail size={14} className="text-[#00AEEF]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-['DM_Sans'] mb-0.5">Email Us</p>
                    <p className="text-sm font-medium font-['DM_Sans']">hello@digitaldaari.com</p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-slate-400">
                  <div className="service-icon-wrap w-9 h-9 mt-0.5 flex-shrink-0">
                    <MapPin size={14} className="text-[#00AEEF]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-['DM_Sans'] mb-0.5">Location</p>
                    <p className="text-sm font-medium font-['DM_Sans']">Delhi</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: "1px solid rgba(0,174,239,0.08)" }}>
        <div className="container py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-slate-500 text-sm font-['DM_Sans']">
              © 2024 Digitaldaari. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-slate-500 text-sm font-['DM_Sans'] hover:text-slate-300 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="text-slate-500 text-sm font-['DM_Sans'] hover:text-slate-300 cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
