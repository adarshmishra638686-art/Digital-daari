import { useEffect } from "react";
import { useLocation } from "wouter";

type SeoConfig = {
  title: string;
  description: string;
  keywords: string;
};

const defaultSeo: SeoConfig = {
  title: " Digital Marketing & Creative Agency",
  description:
    "Digitaldaari is a premium digital marketing and creative agency offering SEO, Local SEO, Website Design, Social Media Marketing, PPC, Graphic Design, Video Editing, Photoshoots and Videoshoots.",
  keywords:
    "digital marketing agency, SEO, local SEO, website design, social media marketing, PPC, graphic design, video editing, photoshoots",
};

function getSeoForPath(pathname: string): SeoConfig {
  if (pathname === "/") {
    return {
      title: "Digital Marketing & Creative Agency",
      description:
        "Grow your business with SEO, local SEO, website design, social media marketing, PPC, and creative content services from Digitaldaari.",
      keywords:
        "digital marketing agency, SEO, local SEO, website design, social media marketing, PPC, creative agency",
    };
  }

  if (pathname === "/about") {
    return {
      title: "About Digitaldaari — Our Story, Mission & Team",
      description:
        "Learn how Digitaldaari helps local businesses, startups, and personal brands grow faster with results-driven digital marketing.",
      keywords:
        "about Digitaldaari, digital marketing team, agency mission, creative agency, business growth",
    };
  }

  if (pathname === "/services") {
    return {
      title: "Digital Marketing Services — SEO, Web Design, Social Media & PPC",
      description:
        "Explore Digitaldaari's full-service digital marketing offerings including SEO, local SEO, web design, PPC, graphics, video, and social media.",
      keywords:
        "SEO services, local SEO, website design, social media marketing, PPC management, graphic design, video editing",
    };
  }

  if (pathname === "/case-studies") {
    return {
      title: "Case Studies — Digitaldaari Results and Growth Stories",
      description:
        "See real growth stories and measurable results from Digitaldaari client campaigns across SEO, website design, and social media.",
      keywords:
        "case studies, digital marketing results, SEO success stories, website redesign results, social media growth",
    };
  }

  if (pathname === "/blog") {
    return {
      title: "Blog — Digital Marketing Insights by Digitaldaari",
      description:
        "Read digital marketing tips, SEO insights, growth strategies, and case studies from the Digitaldaari blog.",
      keywords:
        "digital marketing blog, SEO blog, content marketing, growth strategies, agency insights",
    };
  }

  if (pathname === "/contact") {
    return {
      title: "Contact Digitaldaari — Free Consultation and Marketing Support",
      description:
        "Get in touch with Digitaldaari for a free consultation, custom strategy, and support for your next growth campaign.",
      keywords:
        "contact Digitaldaari, free consultation, digital marketing support, agency contact, marketing strategy",
    };
  }

  if (pathname === "/auth") {
    return {
      title: "CMS Login — Digitaldaari",
      description: "Private CMS login for Digitaldaari administrators.",
      keywords: "CMS login, admin login, Digitaldaari dashboard",
    };
  }

  if (pathname === "/admin/blog") {
    return {
      title: "Blog Admin — Digitaldaari CMS",
      description:
        "Create, edit, schedule, and manage Digitaldaari blog posts from the CMS dashboard.",
      keywords: "blog admin, CMS dashboard, post management, content management",
    };
  }

  return defaultSeo;
}

function upsertMetaTag(name: string, content: string) {
  const selector = `meta[name="${name}"]`;
  let meta = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", name);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function upsertPropertyTag(property: string, content: string) {
  const selector = `meta[property="${property}"]`;
  let meta = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("property", property);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

export function RouteSeo() {
  const [location] = useLocation();

  useEffect(() => {
    if (typeof document === "undefined") return;

    const seo = getSeoForPath(location);
    document.title = seo.title;
    upsertMetaTag("description", seo.description);
    upsertMetaTag("keywords", seo.keywords);
    upsertPropertyTag("og:title", seo.title);
    upsertPropertyTag("og:description", seo.description);
    upsertPropertyTag("og:type", location === "/blog" ? "blog" : "website");
    upsertCanonical(`${window.location.origin}${location}`);
  }, [location]);

  return null;
}

export function setPageSeo(config: SeoConfig, canonicalPath?: string) {
  if (typeof document === "undefined") return;

  document.title = config.title;
  upsertMetaTag("description", config.description);
  upsertMetaTag("keywords", config.keywords);
  upsertPropertyTag("og:title", config.title);
  upsertPropertyTag("og:description", config.description);
  upsertPropertyTag("og:type", "article");
  upsertCanonical(`${window.location.origin}${canonicalPath ?? window.location.pathname}`);
}
