/* ============================================================
   NAVBAR — Sticky header with CTA, mobile menu
   Design: Dark navy, electric blue accent, Montserrat font
   ============================================================ */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone, MessageCircle } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <>
    {/* Announcement Bar */}
    <div className="fixed top-0 left-0 right-0 z-50" style={{ background: "linear-gradient(90deg, #0072BC, #00AEEF, #0072BC)", backgroundSize: "200% auto", animation: "shimmer 3s linear infinite" }}>
      <div className="container py-1.5 flex items-center justify-center gap-3 text-center">
        <span className="text-white text-xs font-bold font-['Montserrat'] uppercase tracking-wider">🔥 Limited Offer:</span>
        <span className="text-white text-xs font-['DM_Sans']">Free SEO Audit + Marketing Plan this week only</span>
        <Link href="/contact">
          <span className="text-white text-xs font-bold underline font-['DM_Sans'] hover:no-underline cursor-pointer">Claim Now →</span>
        </Link>
      </div>
    </div>
    <header
      className={`fixed top-7 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "header-scrolled" : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2">
              <img
                src="/Asset%2016@2000x.png"
                alt="Digitaldaari Logo"
                className="h-10 md:h-12 w-auto object-contain max-w-[200px]"
                style={{ filter: "drop-shadow(0 0 8px rgba(0,174,239,0.3))", backgroundColor: "#ffffff", borderRadius: "5px", borderWidth: "3px" }}
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`text-sm font-medium transition-colors duration-200 link-underline font-['DM_Sans'] ${
                    location === link.href
                      ? "text-[#00AEEF]"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+919956138641"
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-[#00AEEF] transition-colors font-['DM_Sans']"
            >
              <Phone size={14} />
              <span>+91 9956138641</span>
            </a>
            <a href="tel:+919956138641">
              <button className="shimmer-btn text-white font-bold text-sm px-5 py-2.5 rounded-lg font-['Montserrat'] tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#00AEEF]/25">
                Free Consultation
              </button>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#0D1230] border-t border-[rgba(0,174,239,0.15)] px-4 py-6">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`block text-base font-medium py-2 border-b border-[rgba(255,255,255,0.05)] font-['DM_Sans'] ${
                    location === link.href ? "text-[#00AEEF]" : "text-slate-300"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <a href="tel:+919956138641">
              <button className="w-full mt-2 shimmer-btn text-white font-bold text-sm px-5 py-3 rounded-lg font-['Montserrat'] tracking-wide">
                Get Free Consultation
              </button>
            </a>
          </nav>
        </div>
      )}
    </header>
    </>
  );
}
