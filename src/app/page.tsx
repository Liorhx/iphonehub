import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Star,
  CheckCircle2,
  Sparkles,
  Search,
  Check,
  ChevronRight,
  Zap,
  Tag,
  Lock,
} from 'lucide-react';
import { getProducts } from '../services/product.service';
import ProductCard from '../components/products/ProductCard';
import { formatPrice } from '../lib/utils';

export const revalidate = 60;

export default async function HomePage() {
  const allProducts = await getProducts();
  const featuredProducts = allProducts.filter((p) => p.isFeatured).slice(0, 6);
  const bestDeals = allProducts.filter((p) => p.isBestDeal).slice(0, 4);

  const modelTiles = [
    {
      name: 'iPhone 16',
      price: 'From ₹58,999',
      image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-ultramarine?wid=940&hei=1112&fmt=png-alpha',
      href: '/products?family=iPhone%2016',
    },
    {
      name: 'iPhone 15',
      price: 'From ₹48,999',
      image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-blue-select-202309?wid=940&hei=1112&fmt=png-alpha',
      href: '/products?family=iPhone%2015',
    },
    {
      name: 'iPhone 14',
      price: 'From ₹37,999',
      image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-blue-select-202209?wid=940&hei=1112&fmt=png-alpha',
      href: '/products?family=iPhone%2014',
    },
    {
      name: 'iPhone 13',
      price: 'From ₹32,999',
      image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-starlight-select-2021?wid=940&hei=1112&fmt=png-alpha',
      href: '/products?family=iPhone%2013',
    },
  ];

  const reviews = [
    {
      name: 'Vikram Sengupta',
      city: 'Lucknow',
      rating: 5,
      role: 'Bought iPhone 15 Pro (Natural Titanium)',
      comment:
        'Condition was virtually indistinguishable from brand new. Battery health was 94% as advertised. Saved over ₹40,000 compared to retail!',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    },
    {
      name: 'Sneha Patel',
      city: 'Lucknow',
      rating: 5,
      role: 'Sold iPhone 13 (128GB)',
      comment:
        'Cashify offered me ₹24,000. iPhoneHub gave me ₹32,500 after simple door-step inspection and transferred funds instantly via UPI. Super smooth.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    },
    {
      name: 'Arjun Nair',
      city: 'Lucknow',
      rating: 5,
      role: 'Exchanged iPhone 12 for 15 Plus',
      comment:
        'The trade-in process with extra ₹2,500 exchange bonus made the upgrade extremely affordable. Delivery took less than 48 hours.',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    },
  ];

  const faqs = [
    {
      q: 'How does iPhoneHub test and verify pre-owned iPhones?',
      a: 'Every iPhone goes through our rigorous 48-point technical diagnostic audit covering display authenticity, battery health, Face ID, camera sensors, microphone, cellular bands, and clean IMEI verification. Devices that pass receive our official certification seal.',
    },
    {
      q: 'How do I get paid when selling my old iPhone?',
      a: 'Our pickup technician inspects your device at your doorstep in under 10 minutes. Once verified, money is instantly transferred to your UPI or bank account right on the spot before handover.',
    },
    {
      q: 'What warranty is included on purchased devices?',
      a: 'All iPhones purchased from iPhoneHub include a standard 6-month comprehensive warranty covering any hardware defects, plus a 7-day hassle-free replacement policy. Extended 12-month AppleCare style coverage is also available.',
    },
    {
      q: 'Can I pay via EMI or Cash on Delivery?',
      a: 'Yes! We support No-Cost EMI across major banks via Razorpay, instant UPI (Google Pay, PhonePe, Paytm), credit/debit cards, and Cash on Delivery for eligible pincodes.',
    },
  ];

  return (
    <div className="pb-24 sm:pb-28">

      {/* =========================================================================
          MOBILE HOMEPAGE VIEW (Matching User Mockup Pixel-by-Pixel for Mobile)
          ========================================================================= */}
      <div className="block md:hidden">

        {/* Mobile Hero Section with Ambient Neon Wave */}
        <section className="relative bg-[#0B0B0C] text-white pt-3 pb-8 px-4 overflow-hidden">
          {/* Subtle Green Neon Wave on Right */}
          <div className="absolute -right-12 -top-6 w-56 h-56 bg-emerald-500/25 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute right-0 top-12 w-44 h-44 bg-emerald-400/20 blur-2xl rounded-full pointer-events-none" />

          <div className="flex items-center justify-between gap-2 relative z-10">
            {/* Left Headline & Action Buttons */}
            <div className="space-y-3.5 max-w-[58%]">
              <div>
                <h1 className="text-[26px] font-black tracking-tight text-white leading-[1.15]">
                  Premium iPhones.
                </h1>
                <span className="text-[26px] font-black tracking-tight text-[#00DF82] leading-[1.15] block">
                  Better Prices.
                </span>
                <p className="text-zinc-400 text-xs font-normal mt-1.5">
                  Trusted by 50,000+ customers.
                </p>
              </div>

              {/* Stacked Pill Buttons */}
              <div className="space-y-2 pt-1">
                <Link
                  href="/products"
                  className="w-full inline-flex items-center justify-between bg-white text-zinc-950 font-bold text-xs px-4 py-2.5 rounded-full shadow-sm active:scale-95 transition-all"
                >
                  <span>Explore iPhones</span>
                  <span className="text-zinc-950 text-sm font-bold">→</span>
                </Link>
                <Link
                  href="/sell"
                  className="w-full inline-flex items-center justify-between bg-[#141416]/90 border border-zinc-700/80 text-white font-semibold text-xs px-4 py-2.5 rounded-full active:scale-95 transition-all"
                >
                  <span>Sell / Trade-in</span>
                  <span className="text-zinc-400 text-sm font-bold">→</span>
                </Link>
              </div>
            </div>

            {/* Right Angled iPhone 15 Pro Titanium */}
            <div className="relative w-36 h-56 -mr-2 shrink-0">
              <Image
                src="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-naturaltitanium-select?wid=940&hei=1112&fmt=png-alpha"
                alt="iPhone 15 Pro Titanium"
                fill
                priority
                className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] scale-110"
              />
            </div>
          </div>

          {/* Hero Trust Badges (Row of 3 below Hero) */}
          <div className="grid grid-cols-3 gap-1 pt-6 pb-2 text-center border-t border-zinc-800/80 mt-5">
            <div className="flex flex-col items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-zinc-300 stroke-[1.8]" />
              <span className="text-[10px] text-zinc-300 font-medium">100% Original</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-zinc-300 stroke-[1.8]" />
              <span className="text-[10px] text-zinc-300 font-medium">Verified & Tested</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Truck className="w-4 h-4 text-zinc-300 stroke-[1.8]" />
              <span className="text-[10px] text-zinc-300 font-medium">Fast & Secure Delivery</span>
            </div>
          </div>
        </section>

        {/* Curved White Bottom Sheet Container */}
        <div className="rounded-t-[32px] bg-white -mt-4 pt-6 px-4 pb-8 space-y-6 shadow-2xl relative z-10">

          {/* Section: Shop by iPhone */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-extrabold text-zinc-900 tracking-tight">
                Shop by iPhone
              </h2>
              <Link
                href="/products"
                className="text-xs font-semibold text-zinc-400 hover:text-zinc-700 flex items-center gap-0.5"
              >
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 3 Model Cards in a Row */}
            <div className="grid grid-cols-3 gap-2.5">
              {/* iPhone 16 */}
              <Link
                href="/products?family=iPhone%2016"
                className="bg-zinc-50/90 rounded-2xl border border-zinc-200/70 p-2.5 flex flex-col items-center text-center hover:bg-zinc-100/80 active:scale-95 transition-all"
              >
                <div className="relative w-full h-16 flex items-center justify-center">
                  <div className="relative w-9 h-14 -mr-2 z-0 opacity-90 scale-95">
                    <Image
                      src="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-white?wid=940&hei=1112&fmt=png-alpha"
                      alt="iPhone 16 White"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="relative w-10 h-16 z-10 drop-shadow-md">
                    <Image
                      src="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-black?wid=940&hei=1112&fmt=png-alpha"
                      alt="iPhone 16 Black"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <span className="text-xs font-bold text-zinc-900 mt-2">iPhone 16</span>
              </Link>

              {/* iPhone 15 */}
              <Link
                href="/products?family=iPhone%2015"
                className="bg-zinc-50/90 rounded-2xl border border-zinc-200/70 p-2.5 flex flex-col items-center text-center hover:bg-zinc-100/80 active:scale-95 transition-all"
              >
                <div className="relative w-full h-16 flex items-center justify-center">
                  <div className="relative w-9 h-14 -mr-2 z-0 opacity-90 scale-95">
                    <Image
                      src="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pink-select-202309?wid=940&hei=1112&fmt=png-alpha"
                      alt="iPhone 15 Pink"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="relative w-10 h-16 z-10 drop-shadow-md">
                    <Image
                      src="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-blue-select-202309?wid=940&hei=1112&fmt=png-alpha"
                      alt="iPhone 15 Blue"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <span className="text-xs font-bold text-zinc-900 mt-2">iPhone 15</span>
              </Link>

              {/* iPhone 14 */}
              <Link
                href="/products?family=iPhone%2014"
                className="bg-zinc-50/90 rounded-2xl border border-zinc-200/70 p-2.5 flex flex-col items-center text-center hover:bg-zinc-100/80 active:scale-95 transition-all"
              >
                <div className="relative w-full h-16 flex items-center justify-center">
                  <div className="relative w-9 h-14 -mr-2 z-0 opacity-90 scale-95">
                    <Image
                      src="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-blue-select-202209?wid=940&hei=1112&fmt=png-alpha"
                      alt="iPhone 14 Blue"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="relative w-10 h-16 z-10 drop-shadow-md">
                    <Image
                      src="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-midnight-select-202209?wid=940&hei=1112&fmt=png-alpha"
                      alt="iPhone 14 Midnight"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <span className="text-xs font-bold text-zinc-900 mt-2">iPhone 14</span>
              </Link>
            </div>
          </div>

          {/* Section: Upgrade Your iPhone Promo Card */}
          <div className="relative rounded-2xl bg-gradient-to-r from-[#0C1210] via-[#091811] to-[#0A2216] border border-emerald-950/60 p-4 text-white overflow-hidden shadow-sm">
            {/* Subtle Neon Glow */}
            <div className="absolute right-0 top-0 bottom-0 w-36 bg-emerald-500/20 blur-xl pointer-events-none" />

            <div className="flex items-center justify-between gap-2 relative z-10">
              <div className="space-y-1 max-w-[62%]">
                <h3 className="font-extrabold text-base tracking-tight text-white leading-tight">
                  Upgrade Your iPhone
                </h3>
                <p className="text-[11px] text-zinc-300 leading-tight">
                  Get the best value for your old iPhone with instant quote and doorstep pickup.
                </p>
                <div className="pt-2">
                  <Link
                    href="/sell"
                    className="inline-flex items-center gap-1 bg-white text-zinc-950 font-bold text-xs px-4 py-2 rounded-full shadow hover:bg-zinc-100 active:scale-95 transition-all"
                  >
                    Sell Now →
                  </Link>
                </div>
              </div>

              <div className="relative w-24 h-28 shrink-0">
                <Image
                  src="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-naturaltitanium-select?wid=940&hei=1112&fmt=png-alpha"
                  alt="Upgrade iPhone"
                  fill
                  className="object-contain scale-125 translate-x-3 translate-y-1 drop-shadow-xl"
                />
              </div>
            </div>
          </div>

          {/* Section: Why Choose iPhoneHub? (4 horizontal icons) */}
          <div>
            <h3 className="font-extrabold text-base text-zinc-900 mb-3">
              Why Choose iPhoneHub?
            </h3>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-800 shadow-xs">
                  <Tag className="w-5 h-5 text-zinc-800 stroke-[1.8]" />
                </div>
                <span className="text-[11px] font-medium text-zinc-800 mt-1.5 leading-tight">Best Prices</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-800 shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-zinc-800 stroke-[1.8]" />
                </div>
                <span className="text-[11px] font-medium text-zinc-800 mt-1.5 leading-tight">Verified Devices</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-800 shadow-xs">
                  <Truck className="w-5 h-5 text-zinc-800 stroke-[1.8]" />
                </div>
                <span className="text-[11px] font-medium text-zinc-800 mt-1.5 leading-tight">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-800 shadow-xs">
                  <Lock className="w-5 h-5 text-zinc-800 stroke-[1.8]" />
                </div>
                <span className="text-[11px] font-medium text-zinc-800 mt-1.5 leading-tight">Secure Payments</span>
              </div>
            </div>
          </div>

          {/* Section: Featured Devices (Mobile 2-Column Grid) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-base text-zinc-900 tracking-tight">
                Featured Devices
              </h3>
              <Link
                href="/products"
                className="text-xs font-semibold text-brand-emerald hover:text-brand-emeraldDark flex items-center gap-0.5"
              >
                See All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>

          {/* Section: Best Value Deals (Mobile 2-Column Grid) */}
          {bestDeals.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-brand-emerald fill-brand-emerald" />
                  <h3 className="font-extrabold text-base text-zinc-900 tracking-tight">
                    Best Value Deals
                  </h3>
                </div>
                <Link
                  href="/products"
                  className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 flex items-center gap-0.5"
                >
                  Browse <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {bestDeals.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* =========================================================================
          DESKTOP & TABLET HOMEPAGE VIEW (Full Widescreen Experience)
          ========================================================================= */}
      <div className="hidden md:block space-y-20 lg:space-y-24">

        {/* DESKTOP HERO SECTION */}
        <section className="relative bg-[#0B0B0C] text-white pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-12 gap-12 items-center">

              {/* Left Content */}
              <div className="col-span-7 space-y-8 z-10">
                <div className="inline-flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 text-zinc-300 px-3.5 py-1.5 rounded-full text-xs font-medium">
                  <Sparkles className="w-4 h-4 text-brand-emerald" />
                  <span>India&apos;s #1 Apple Certified Exchange</span>
                </div>

                <div className="space-y-3">
                  <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                    Premium iPhones. <br />
                    <span className="text-[#00DF82]">Better Prices.</span>
                  </h1>
                  <p className="text-base text-zinc-400 max-w-xl leading-relaxed">
                    Trusted by 50,000+ customers. Certified pre-owned iPhones with 6 months warranty, doorstep verification, and instant resale cash.
                  </p>
                </div>

                {/* Instant Search Bar */}
                <form
                  action="/products"
                  method="GET"
                  className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-zinc-700/60 max-w-lg flex items-center gap-2"
                >
                  <div className="flex-1 flex items-center pl-3 gap-2">
                    <Search className="w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      name="search"
                      placeholder="Search iPhone models, storage..."
                      className="w-full bg-transparent text-sm text-white placeholder-zinc-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-brand-emerald hover:bg-brand-emeraldHover text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Search
                  </button>
                </form>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-1">
                  <Link
                    href="/products"
                    className="bg-white text-zinc-950 px-6 py-3.5 rounded-full font-bold text-sm hover:bg-zinc-100 transition-all shadow-lg flex items-center gap-2 active:scale-95"
                  >
                    Explore iPhones
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/sell"
                    className="bg-zinc-900/90 border border-zinc-700 text-white px-6 py-3.5 rounded-full font-bold text-sm hover:bg-zinc-800 transition-all flex items-center gap-2 active:scale-95"
                  >
                    Sell / Trade-in
                    <ArrowRight className="w-4 h-4 text-[#00DF82]" />
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-4 gap-4 pt-6 border-t border-zinc-800/80 text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#00DF82] shrink-0" />
                    <span>100% Original</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00DF82] shrink-0" />
                    <span>Verified & Tested</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#00DF82] shrink-0" />
                    <span>Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#00DF82] shrink-0" />
                    <span>Secure Payments</span>
                  </div>
                </div>
              </div>

              {/* Right iPhone Showcase */}
              <div className="col-span-5 relative flex justify-center items-center">
                <div className="relative w-80 h-[520px] animate-float">
                  <Image
                    src="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-naturaltitanium-select?wid=940&hei=1112&fmt=png-alpha"
                    alt="iPhone 15 Pro Titanium"
                    fill
                    priority
                    className="object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)]"
                  />

                  {/* Floating Price Pill */}
                  <div className="absolute top-8 -left-8 bg-white/90 backdrop-blur-md text-brand-black p-3 rounded-2xl shadow-premium border border-zinc-200/80 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-brand-emeraldDark font-bold">
                      -24%
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-zinc-500 uppercase">iPhone 15 Pro</p>
                      <p className="text-sm font-extrabold text-zinc-900">₹88,999</p>
                    </div>
                  </div>

                  {/* Floating Instant Cash Pill */}
                  <div className="absolute bottom-8 -right-6 bg-brand-black/90 backdrop-blur-md text-white p-3 rounded-2xl shadow-premium border border-zinc-700/80 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00DF82] flex items-center justify-center text-zinc-950 font-bold">
                      ₹
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-zinc-400">Instant Trade-in</p>
                      <p className="text-sm font-extrabold text-white">Up to ₹78,000</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* DESKTOP SHOP BY IPHONE MODEL TILES */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                Shop by iPhone
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                Select your favorite generation certified with warranty
              </p>
            </div>
            <Link
              href="/products"
              className="text-sm font-bold text-brand-emerald hover:text-brand-emeraldDark flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {modelTiles.map((tile) => (
              <Link
                key={tile.name}
                href={tile.href}
                                                                    className="group bg-zinc-50 hover:bg-white rounded-3xl border border-zinc-200/80 hover:border-zinc-300 p-6 transition-all duration-300 hover:shadow-cardHover flex flex-col items-center text-center relative overflow-hidden"
                                                                  >
                                                                    <div className="relative w-36 h-40 mb-3 transition-transform duration-300 group-hover:scale-105">
                                                                      <Image
                                                                        src={tile.image}
                                                                        alt={tile.name}
                                                                        fill
                                                                        className="object-contain"
                                                                      />
                                                                    </div>
                                                                    <h3 className="font-bold text-base text-zinc-900">{tile.name}</h3>
                                                                    <p className="text-xs font-semibold text-zinc-500 mt-0.5">{tile.price}</p>
                                                                  </Link>
                                                                ))}
          </div>
        </section>

        {/* DESKTOP SELL OR TRADE-IN PROMOTIONAL BANNER */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-emerald-950 rounded-3xl border border-zinc-800 p-12 relative overflow-hidden flex items-center justify-between gap-8 text-white">
            <div className="space-y-4 max-w-xl z-10">
              <span className="bg-emerald-500/20 text-[#00DF82] border border-emerald-500/30 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                Instant Trade-in
              </span>
              <h2 className="text-4xl font-extrabold text-white tracking-tight">
                Already have an iPhone? <br />
                <span className="text-[#00DF82]">Get the best price in minutes.</span>
              </h2>
              <p className="text-base text-zinc-300 leading-relaxed">
                Answer 5 quick questions about your phone&apos;s condition, get an instant doorstep inspection quote, and receive instant cash via UPI.
              </p>
              <div className="pt-2">
                <Link
                  href="/sell"
                  className="inline-flex items-center gap-2 bg-white hover:bg-zinc-100 text-zinc-950 font-bold px-6 py-3.5 rounded-full text-sm transition-all shadow-md active:scale-95"
                >
                  Sell / Trade-in Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative w-80 h-64 shrink-0">
              <Image
                src="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-naturaltitanium-select?wid=940&hei=1112&fmt=png-alpha"
                alt="Sell iPhone"
                fill
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* DESKTOP FEATURED CERTIFIED PRODUCTS */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                Featured Devices
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                Hand-picked pristine iPhones with verified battery health & warranty
              </p>
            </div>
            <Link
              href="/products"
              className="text-sm font-bold text-brand-emerald hover:text-brand-emeraldDark flex items-center gap-1"
            >
              See All iPhones <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>

        {/* DESKTOP BEST DEALS & VALUE PICKS */}
        {bestDeals.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="bg-zinc-50 rounded-3xl p-10 border border-zinc-200/80">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald flex items-center gap-1.5 mb-1">
                    <Zap className="w-4 h-4" /> Limited Stock Drop
                  </span>
                  <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                    Best Value Deals
                  </h2>
                </div>
                <Link
                  href="/products"
                  className="text-sm font-bold text-zinc-700 hover:text-zinc-950 flex items-center gap-1"
                >
                  Browse All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-4 gap-6">
                {bestDeals.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* DESKTOP WHY CHOOSE US */}
        <section id="why-us" className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
              Why Choose iPhoneHub?
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              The smarter, safer, and most rewarding way to buy and sell Apple devices in India.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 space-y-3 hover:shadow-cardHover transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-brand-emerald flex items-center justify-center font-bold">
                <Tag className="w-6 h-6 text-brand-emerald" />
              </div>
              <h3 className="font-bold text-lg text-zinc-900">Higher Resale Value</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Get up to 25% higher resale quotes compared to traditional trade-in platforms and offline storefronts.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 space-y-3 hover:shadow-cardHover transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg text-zinc-900">48-Point Certified</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Every device is inspected by certified Apple technicians for display authenticity, battery, cameras, and components.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 space-y-3 hover:shadow-cardHover transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg text-zinc-900">Multiple Payment Options</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Instant UPI, No-Cost EMI with major banks, credit/debit cards, and Cash On Delivery with verification.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 space-y-3 hover:shadow-cardHover transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Truck className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-bold text-lg text-zinc-900">Fast & Reliable Delivery</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Free insured pan-India delivery with tamper-proof packaging and real-time BlueDart tracking.
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* =========================================================================
          COMMON SECTIONS: CUSTOMER REVIEWS & FAQS
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-20 space-y-16">

        {/* CUSTOMER REVIEWS */}
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-1 text-amber-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
                <span className="text-xs font-bold text-zinc-700 ml-1">4.9 / 5.0 (2,400+ Verified Reviews)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                Loved by Apple Enthusiasts
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.name}
                className="bg-white rounded-3xl border border-zinc-200/80 p-6 space-y-4 hover:shadow-cardHover transition-shadow"
              >
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-zinc-700 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-zinc-100">
                  <div className="w-10 h-10 rounded-full bg-zinc-200 relative overflow-hidden">
                    <Image src={rev.avatar} alt={rev.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">{rev.name}</h4>
                    <p className="text-xs text-zinc-500">{rev.role} • {rev.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section id="faq" className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-zinc-500 mt-2">
              Everything you need to know about purchasing or selling on iPhoneHub
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                                                                        className="bg-zinc-50 rounded-2xl border border-zinc-200/80 p-5 sm:p-6 space-y-2"
                                                                      >
                                                                        <h3 className="font-bold text-sm sm:text-base text-zinc-900 flex items-center gap-2">
                                                                          <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0" />
                                                                          {faq.q}
                                                                        </h3>
                                                                        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed pl-6">
                                                                          {faq.a}
                                                                        </p>
                                                                      </div>
                                                                    ))}
          </div>
        </section>

      </div>

    </div>
  );
}
