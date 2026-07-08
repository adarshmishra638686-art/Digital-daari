/* ============================================================
   APP.TSX — Routes, global layout, Navbar, Footer, WhatsApp
   Design: Electric Growth — Dark Navy + Sky Blue
   ============================================================ */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import { RouteSeo } from "./components/Seo";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import CaseStudies from "./pages/CaseStudies";
import BlogNew from "./pages/BlogNew";
import BlogPost from "./pages/BlogPost";
import BlogAdmin from "./pages/BlogAdmin";
import AuthPage from "./pages/Auth";
import Contact from "./pages/Contact";
import { useEffect } from "react";

// Scroll to top on route change
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);
  return null;
}
function Router() {
  // make sure to consider if you need authentication for certain routes
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      <RouteSeo />
      {!isAdminRoute && <Navbar />}
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/services" component={Services} />
        <Route path="/case-studies" component={CaseStudies} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/blog" component={BlogNew} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/admin/blog" component={BlogAdmin} />
        <Route path="/contact" component={Contact} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppButton />}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
