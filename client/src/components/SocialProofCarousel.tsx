import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import './SocialProofCarousel.css';

interface Testimonial {
  id: number;
  clientName: string;
  clientTitle: string;
  clientLogo: string;
  testimonial: string;
  rating: number;
  result: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    clientName: 'TechStart India',
    clientTitle: 'SaaS Startup',
    clientLogo: '🚀',
    testimonial: 'Digitaldaari increased our organic traffic by 350% in just 6 months. Their SEO strategy is phenomenal!',
    rating: 5,
    result: '+350% Organic Traffic'
  },
  {
    id: 2,
    clientName: 'E-Commerce Pro',
    clientTitle: 'Online Retail',
    clientLogo: '🛍️',
    testimonial: 'Our conversion rate doubled after implementing their PPC campaigns. Best investment ever!',
    rating: 5,
    result: '2x Conversion Rate'
  },
  {
    id: 3,
    clientName: 'Design Studio Delhi',
    clientTitle: 'Creative Agency',
    clientLogo: '🎨',
    testimonial: 'The social media strategy transformed our brand presence. We got 500+ qualified leads!',
    rating: 5,
    result: '500+ Qualified Leads'
  },
  {
    id: 4,
    clientName: 'Fitness Brands',
    clientTitle: 'Health & Wellness',
    clientLogo: '💪',
    testimonial: 'Their video editing and content strategy made us go viral. Highly recommend!',
    rating: 5,
    result: '2M+ Video Views'
  },
  {
    id: 5,
    clientName: 'Real Estate Hub',
    clientTitle: 'Property Developer',
    clientLogo: '🏢',
    testimonial: 'Local SEO strategy brought us 200+ property inquiries. Game changer for our business!',
    rating: 5,
    result: '200+ Inquiries/Month'
  },
  {
    id: 6,
    clientName: 'Beauty & Salon',
    clientTitle: 'Luxury Spa',
    clientLogo: '✨',
    testimonial: 'Website redesign + social media marketing resulted in 150% booking increase!',
    rating: 5,
    result: '150% Bookings'
  }
];

export default function SocialProofCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  // Auto-rotate carousel
  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setDirection('right');
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const handlePrev = () => {
    setDirection('left');
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAutoPlay(true), 8000);
  };

  const handleNext = () => {
    setDirection('right');
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAutoPlay(true), 8000);
  };

  const getVisibleTestimonials = () => {
    const items = [];
    for (let i = 0; i < 3; i++) {
      items.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return items;
  };

  return (
    <div className="social-proof-carousel-container">
      <div className="carousel-wrapper">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="carousel-arrow carousel-arrow-left"
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Testimonials Grid */}
        <div className="testimonials-grid">
          {getVisibleTestimonials().map((testimonial, idx) => (
            <div
              key={testimonial.id}
              className={`testimonial-card ${direction === 'right' ? 'slide-in-right' : 'slide-in-left'}`}
              style={{
                animationDelay: `${idx * 0.1}s`
              }}
            >
              {/* Client Logo & Name */}
              <div className="client-header">
                <div className="client-logo">{testimonial.clientLogo}</div>
                <div className="client-info">
                  <h4 className="client-name">{testimonial.clientName}</h4>
                  <p className="client-title">{testimonial.clientTitle}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="rating">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={16} className="star-icon" fill="currentColor" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="testimonial-text">"{testimonial.testimonial}"</p>

              {/* Result Badge */}
              <div className="result-badge">
                <span className="result-icon">📈</span>
                <span className="result-text">{testimonial.result}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="carousel-arrow carousel-arrow-right"
          aria-label="Next testimonial"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Carousel Indicators */}
      <div className="carousel-indicators">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            className={`indicator ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => {
              setCurrentIndex(idx);
              setIsAutoPlay(false);
              setTimeout(() => setIsAutoPlay(true), 8000);
            }}
            aria-label={`Go to testimonial ${idx + 1}`}
          />
        ))}
      </div>

      {/* Auto-play toggle */}
      <div className="autoplay-toggle">
        <button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className={`autoplay-btn ${isAutoPlay ? 'playing' : 'paused'}`}
        >
          {isAutoPlay ? '▶ Auto-playing' : '⏸ Paused'}
        </button>
      </div>
    </div>
  );
}
