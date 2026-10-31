'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface PromoSlide {
  id: string;
  badge: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  gradient: string;
  borderColor: string;
  glowColor: string;
  badgeBg: string;
  image: string;
  imageAlt: string;
}

const PROMO_SLIDES: PromoSlide[] = [
  {
    id: 'upgrade',
    badge: '⚡ DOORSTEP PICKUP',
    title: 'Upgrade Your iPhone',
    description: 'Get the best value for your old iPhone with instant quote and doorstep pickup.',
    ctaText: 'Sell Now →',
    ctaLink: '/sell',
    gradient: 'from-[#0A1410] via-[#091D13] to-[#0A291A]',
    borderColor: 'border-emerald-900/60',
    glowColor: 'bg-emerald-500/25',
    badgeBg: 'bg-emerald-500/15 text-[#00DF82] border-emerald-500/30',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-naturaltitanium-select?wid=940&hei=1112&fmt=png-alpha',
    imageAlt: 'Upgrade iPhone 15 Pro Titanium',
  },
  {
    id: 'exchange',
    badge: '🎁 EXTRA ₹2,500 BONUS',
    title: 'Festive Trade-In Bonus',
    description: 'Trade-in any iPhone and get an instant ₹2,500 bonus directly credited on your order.',
    ctaText: 'Check Value →',
    ctaLink: '/sell',
    gradient: 'from-[#080E1C] via-[#0B172E] to-[#0F2347]',
    borderColor: 'border-blue-900/60',
    glowColor: 'bg-cyan-500/25',
    badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-bluetitanium-select?wid=940&hei=1112&fmt=png-alpha',
    imageAlt: 'iPhone 15 Pro Blue Titanium Exchange',
  },
  {
    id: 'warranty',
    badge: '🛡️ 48-POINT CERTIFIED',
    title: '1-Year Full Warranty',
    description: 'Every device undergoes 48 diagnostic audits with 7-day doorstep replacement guarantee.',
    ctaText: 'Explore iPhones →',
    ctaLink: '/products',
    gradient: 'from-[#120B1E] via-[#1B0F2E] to-[#2B1449]',
    borderColor: 'border-purple-900/60',
    glowColor: 'bg-purple-500/25',
    badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-pro-deeppurple-select?wid=940&hei=1112&fmt=png-alpha',
    imageAlt: 'Certified iPhone 14 Pro Deep Purple',
  },
  {
    id: 'emi',
    badge: '💳 ZERO DOWN PAYMENT',
    title: 'Own from ₹3,021/mo',
    description: 'Flexible Razorpay No-Cost EMI across major banks or Cash on Delivery at your doorstep.',
    ctaText: 'Shop Deals →',
    ctaLink: '/products',
    gradient: 'from-[#191108] via-[#261A0C] to-[#3B2810]',
    borderColor: 'border-amber-900/60',
    glowColor: 'bg-amber-500/25',
    badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-pro-gold-select?wid=940&hei=1112&fmt=png-alpha',
    imageAlt: 'iPhone 14 Pro Gold EMI Deals',
  },
];

export default function PromoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = PROMO_SLIDES.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  // Auto-advance carousel every 4.5 seconds unless paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) {
      setIsPaused(false);
      return;
    }
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      nextSlide(); // Swiped left -> next
    } else if (distance < -minSwipeDistance) {
      prevSlide(); // Swiped right -> prev
    }

    touchStartX.current = null;
    touchEndX.current = null;
    setIsPaused(false);
  };

  return (
    <div
      className="relative select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div className="relative overflow-hidden rounded-3xl min-h-[170px]">
        {PROMO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id}
              className={`transition-all duration-500 ease-out ${
                isActive
                  ? 'opacity-100 relative translate-x-0'
                  : 'opacity-0 absolute inset-0 pointer-events-none translate-x-8'
              }`}
            >
              <div
                className={`relative rounded-3xl bg-gradient-to-r ${slide.gradient} border ${slide.borderColor} p-4 sm:p-5 text-white overflow-hidden shadow-card`}
              >
                {/* Dynamic Ambient Neon Glow on Right */}
                <div
                  className={`absolute right-0 top-0 bottom-0 w-44 ${slide.glowColor} blur-2xl pointer-events-none animate-pulseGlow`}
                />

                <div className="flex items-center justify-between gap-2 relative z-10">
                  {/* Left Text & CTA */}
                  <div className="space-y-1.5 max-w-[62%] sm:max-w-[65%]">
                    {/* Badge Pill */}
                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider border backdrop-blur-md ${slide.badgeBg}`}
                    >
                      <span>{slide.badge}</span>
                    </div>

                    <h3 className="font-black text-base sm:text-lg tracking-tight text-white leading-tight">
                      {slide.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-zinc-300 leading-snug line-clamp-2">
                      {slide.description}
                    </p>

                    <div className="pt-2">
                      <Link
                        href={slide.ctaLink}
                        className="inline-flex items-center gap-1 bg-white text-zinc-950 font-extrabold text-xs px-4 py-2 rounded-full shadow-md hover:bg-zinc-100 active:scale-95 transition-all"
                      >
                        <span>{slide.ctaText}</span>
                      </Link>
                    </div>
                  </div>

                  {/* Right 3D Phone Showcase */}
                  <div className="relative w-28 h-32 shrink-0 flex items-center justify-center">
                    <div className="relative w-28 h-32 animate-subtleFloat">
                      <Image
                        src={slide.image}
                        alt={slide.imageAlt}
                        fill
                        className="object-contain scale-125 translate-x-3 translate-y-1 drop-shadow-[0_16px_25px_rgba(0,0,0,0.85)]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots Indicator & Touch Progress */}
      <div className="flex items-center justify-center gap-1.5 pt-3">
        {PROMO_SLIDES.map((s, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isActive ? 'w-6 bg-zinc-900' : 'w-1.5 bg-zinc-300 hover:bg-zinc-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}

