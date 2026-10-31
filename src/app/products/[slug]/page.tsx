'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShieldCheck,
  BatteryCharging,
  Truck,
  CheckCircle2,
  Share2,
  ChevronRight,
  Shield,
  Star,
  Zap,
  Check,
  CreditCard,
  RotateCcw,
  Video,
  Play,
  X,
  Loader2,
} from 'lucide-react';
import { Product } from '../../../types';
import { INITIAL_PRODUCTS } from '../../../data/mockProducts';
import { formatPrice, calculateDiscount } from '../../../lib/utils';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';

function ProductSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-3.5 w-12 bg-zinc-200 rounded-md" />
        <div className="h-3.5 w-3 bg-zinc-200 rounded-md" />
        <div className="h-3.5 w-16 bg-zinc-200 rounded-md" />
        <div className="h-3.5 w-3 bg-zinc-200 rounded-md" />
        <div className="h-3.5 w-32 bg-zinc-200 rounded-md" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Gallery Skeleton */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-zinc-100 border border-zinc-200/80 rounded-3xl h-[380px] sm:h-[500px] flex items-center justify-center p-6 relative overflow-hidden">
            <div className="w-48 h-72 sm:w-60 sm:h-96 rounded-3xl border-4 border-zinc-200/70 bg-zinc-200/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-16 h-18 sm:w-20 sm:h-22 rounded-2xl bg-zinc-100 border border-zinc-200/80 shrink-0"
              />
            ))}
          </div>

          <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4 sm:p-5 space-y-3 mt-6">
            <div className="h-4 w-40 bg-zinc-200 rounded-md" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-zinc-100 rounded-xl" />
              ))}
            </div>
          </div>
        </div>

        {/* Right Info Skeleton */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-20 bg-emerald-100 rounded-full" />
              <div className="h-5 w-24 bg-zinc-200 rounded-full" />
            </div>
            <div className="h-8 w-4/5 bg-zinc-200 rounded-xl" />
            <div className="h-4 w-1/2 bg-zinc-100 rounded-md" />
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
            <div className="h-8 w-36 bg-zinc-200 rounded-lg" />
            <div className="h-4 w-28 bg-zinc-100 rounded-md" />
          </div>

          <div className="space-y-2">
            <div className="h-3.5 w-28 bg-zinc-200 rounded-md" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-zinc-100 rounded-xl border border-zinc-200" />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-3.5 w-28 bg-zinc-200 rounded-md" />
            <div className="grid grid-cols-3 gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-14 bg-zinc-100 rounded-xl border border-zinc-200" />
              ))}
            </div>
          </div>

          <div className="h-16 bg-zinc-100 rounded-2xl border border-zinc-200" />

          <div className="space-y-2.5 pt-2">
            <div className="h-12 w-full bg-zinc-200 rounded-2xl" />
            <div className="h-14 w-full bg-brand-emerald/30 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState('128GB');
  const [addExtendedWarranty, setAddExtendedWarranty] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    async function loadDynamicProduct() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products/${params.slug}`);
        const data = await res.json();
        if (data.success && data.data) {
          setProduct(data.data);
          setSelectedStorage(data.data.storage || '128GB');
          setIsLoading(false);
          return;
        }
      } catch (e) {
        // Fallback to static catalogue
      }

      const found =
        INITIAL_PRODUCTS.find((p) => p.slug === params.slug || p._id === params.slug || p.id === params.slug) || null;
      setProduct(found);
      if (found) {
        setSelectedStorage(found.storage);
      }
      setIsLoading(false);
    }

    loadDynamicProduct();
  }, [params.slug]);

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="text-2xl font-bold text-zinc-900">Device Not Found</h1>
        <p className="text-xs text-zinc-500">
          The requested device is currently unavailable or has been removed from inventory.
        </p>
        <div>
          <Link
            href="/products"
            className="inline-block px-5 py-2.5 bg-brand-black text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition"
          >
            ← Back to iPhone Catalog
          </Link>
        </div>
      </div>
    );
  }

  const discount = calculateDiscount(product.originalPrice, product.price);
  const isWishlisted = isInWishlist(product._id);
  const warrantyPrice = 1499;

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      setPincodeStatus('Please enter a valid 6-digit Indian PIN code');
      return;
    }
    setPincodeStatus('Express Delivery Available: Guaranteed Delivery in 2 Business Days (Free)');
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    const warrantyObj = addExtendedWarranty
      ? { type: 'Extended 6-Month Care', price: warrantyPrice, months: 6 }
      : undefined;
    addToCart(product, warrantyObj);
    setTimeout(() => {
      setIsAdding(false);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2200);
    }, 250);
  };

  const handleBuyNow = () => {
    setIsBuying(true);
    const warrantyObj = addExtendedWarranty
      ? { type: 'Extended 6-Month Care', price: warrantyPrice, months: 6 }
      : undefined;
    addToCart(product, warrantyObj);
    router.push('/checkout');
  };

  const similarProducts = INITIAL_PRODUCTS.filter(
    (p) => p._id !== product._id && p.modelFamily === product.modelFamily
  ).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500">
        <Link href="/" className="hover:text-zinc-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-zinc-900 transition-colors">
          iPhones
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-zinc-900 font-medium">{product.title}</span>
      </nav>

      {/* Main Grid: Gallery & Buying Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative bg-zinc-50 border border-zinc-200/80 rounded-3xl p-8 flex items-center justify-center min-h-[420px] sm:min-h-[520px] overflow-hidden">
            <div className="relative w-72 h-80 sm:w-96 sm:h-[450px]">
              <Image
                src={product.images[activeImageIndex] || product.thumbnail}
                alt={product.title}
                fill
                priority
                className="object-contain transition-all duration-300 drop-shadow-xl"
              />
            </div>

            {/* Condition Tag */}
            <div className="absolute top-6 left-6">
              <span className="bg-brand-black text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                Condition: {product.condition}
              </span>
            </div>

            {/* Wishlist Floating Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className="absolute top-6 right-6 p-3 bg-white/90 hover:bg-white rounded-full border border-zinc-200 shadow-sm transition-transform active:scale-90"
              aria-label="Wishlist"
            >
              <Heart
                className={`w-5 h-5 ${
                  isWishlisted ? 'text-rose-500 fill-rose-500' : 'text-zinc-400'
                }`}
              />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl border-2 p-2 bg-zinc-50 shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-brand-black shadow-sm'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-contain p-1" />
                </button>
              ))}
            </div>
          )}

          {/* Inspection Video Banner if available */}
          {product.videoUrl && (
            <div className="bg-gradient-to-r from-zinc-950 to-zinc-900 text-white rounded-3xl p-5 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-emerald/20 flex items-center justify-center text-brand-emerald">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">
                    360° Physical Inspection Video
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Recorded under studio lighting with Cloudinary verification
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowVideoModal(true)}
                className="bg-brand-emerald hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                Watch Video
              </button>
            </div>
          )}

          {/* Device Verification Highlights Box */}
          <div className="bg-zinc-50 rounded-3xl border border-zinc-200/80 p-6 space-y-4">
            <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-emerald" />
              Verified & Certified Report
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-zinc-700 bg-white p-2.5 rounded-xl border border-zinc-200">
                <Check className="w-4 h-4 text-brand-emerald shrink-0" />
                <span>Original Apple display & TrueTone verified</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-700 bg-white p-2.5 rounded-xl border border-zinc-200">
                <Check className="w-4 h-4 text-brand-emerald shrink-0" />
                <span>Battery health certified at {product.batteryHealth}%</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-700 bg-white p-2.5 rounded-xl border border-zinc-200">
                <Check className="w-4 h-4 text-brand-emerald shrink-0" />
                <span>Zero iCloud lock, clean IMEI status</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-700 bg-white p-2.5 rounded-xl border border-zinc-200">
                <Check className="w-4 h-4 text-brand-emerald shrink-0" />
                <span>Comes with complimentary USB-C/Lightning cable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Purchasing & Specifications */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Header & Rating */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-brand-emerald flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {product.rating}
              </span>
              <span className="text-zinc-400">•</span>
              <span className="text-zinc-500 font-medium">({product.reviewsCount} verified reviews)</span>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                {product.title}
              </h1>
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-extrabold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <Check className="w-3 h-3 stroke-[3]" /> Verified
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-zinc-600">
              {product.storage} • {product.color} • {product.condition} Condition
            </p>
          </div>

          {/* Pricing Box */}
          <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-zinc-950">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm font-medium text-zinc-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="bg-emerald-100 text-brand-emeraldDark text-xs font-bold px-2 py-0.5 rounded-full">
                  {discount}% OFF
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 flex items-center gap-1.5 pt-1">
              <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
              EMI starting from ₹{Math.round(product.price / 12).toLocaleString('en-IN')}/month
            </p>
          </div>

          {/* Specs Mini Badges (Camera, Display, Body) */}
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="bg-white border border-zinc-200 rounded-xl p-2.5">
              <p className="text-zinc-400 text-[10px] uppercase font-bold">Storage</p>
              <p className="font-bold text-zinc-800 mt-0.5">{product.storage}</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-2.5">
              <p className="text-zinc-400 text-[10px] uppercase font-bold">Battery</p>
              <p className="font-bold text-brand-emerald mt-0.5">{product.batteryHealth}% Health</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-2.5">
              <p className="text-zinc-400 text-[10px] uppercase font-bold">Warranty</p>
              <p className="font-bold text-zinc-800 mt-0.5">6 Months</p>
            </div>
          </div>

          {/* Storage Capacity Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              Storage Capacity
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['128GB', '256GB', '512GB', '1TB'].map((cap) => (
                <button
                  key={cap}
                  type="button"
                  onClick={() => setSelectedStorage(cap)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    selectedStorage === cap
                      ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  {cap}
                </button>
              ))}
            </div>
          </div>

          {/* Condition Selector (Screen 3 in Mockup) */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              Condition Grade
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'Excellent', desc: 'Like new' },
                { name: 'Good', desc: 'Minor scratches' },
                { name: 'Fair', desc: 'Visible wear' },
              ].map((cond) => {
                const isSelected = product.condition.toLowerCase().includes(cond.name.toLowerCase());
                return (
                  <div
                    key={cond.name}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-brand-emerald bg-emerald-50/60 ring-1 ring-brand-emerald text-emerald-950 font-bold'
                        : 'border-zinc-200 bg-zinc-50/60 text-zinc-600'
                    }`}
                  >
                    <span className="text-xs font-bold block">{cond.name}</span>
                    <span className="text-[10px] text-zinc-400 block">{cond.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Warranty Upgrade */}
          <div
            onClick={() => setAddExtendedWarranty(!addExtendedWarranty)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              addExtendedWarranty
                ? 'bg-emerald-50/70 border-brand-emerald text-emerald-950'
                : 'bg-white border-zinc-200 hover:border-zinc-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                  addExtendedWarranty
                    ? 'bg-brand-emerald border-brand-emerald text-white'
                    : 'border-zinc-300 bg-white'
                }`}
              >
                {addExtendedWarranty && <Check className="w-3.5 h-3.5" />}
              </div>
              <div>
                <p className="text-xs font-bold">Add Extended 6 Months Warranty</p>
                <p className="text-[11px] text-zinc-500">Comprehensive hardware & accidental coverage</p>
              </div>
            </div>
            <span className="text-xs font-bold text-zinc-900">+₹1,499</span>
          </div>

          {/* CTAs: Add to Cart and Buy Now */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={addedSuccess || isAdding}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                addedSuccess
                  ? 'bg-brand-emerald text-white'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 active:scale-[0.99]'
              }`}
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-700" /> Adding...
                </>
              ) : addedSuccess ? (
                <>
                  <Check className="w-4 h-4" /> Added to Bag
                </>
              ) : (
                'Add to Bag'
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isBuying}
              className="w-full py-4 bg-brand-black hover:bg-zinc-800 text-white rounded-2xl font-extrabold text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-80"
            >
              {isBuying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Directing to Checkout...
                </>
              ) : (
                <>
                  Buy Now with Instant Checkout
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* PIN code checker */}
          <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200 space-y-2">
            <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-brand-emerald" /> Check Delivery to Your Pincode
            </label>
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit PIN code..."
                className="flex-1 px-3 py-2 text-xs bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-brand-emerald"
              />
              <button
                type="submit"
                className="bg-brand-black text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-zinc-800"
              >
                Check
              </button>
            </form>
            {pincodeStatus && (
              <p className="text-[11px] font-medium text-emerald-700">{pincodeStatus}</p>
            )}
          </div>

          {/* Specifications Table */}
          <div className="border-t border-zinc-200 pt-6 space-y-3">
            <h3 className="font-bold text-sm text-zinc-900">Technical Specifications</h3>
            <div className="space-y-2 text-xs divide-y divide-zinc-100">
              <div className="flex justify-between py-1.5 text-zinc-600">
                <span className="text-zinc-400">Display</span>
                <span className="font-medium text-right text-zinc-900 max-w-xs">{product.specifications.display}</span>
              </div>
              <div className="flex justify-between py-1.5 text-zinc-600">
                <span className="text-zinc-400">Processor</span>
                <span className="font-medium text-zinc-900">{product.specifications.processor}</span>
              </div>
              <div className="flex justify-between py-1.5 text-zinc-600">
                <span className="text-zinc-400">Camera</span>
                <span className="font-medium text-right text-zinc-900 max-w-xs">{product.specifications.camera}</span>
              </div>
              <div className="flex justify-between py-1.5 text-zinc-600">
                <span className="text-zinc-400">Security</span>
                <span className="font-medium text-zinc-900">{product.specifications.biometrics}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Similar iPhones Recommendation */}
      {similarProducts.length > 0 && (
        <section className="pt-12 border-t border-zinc-200">
          <h2 className="text-2xl font-extrabold text-zinc-900 mb-6">
            Similar iPhones You May Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProducts.map((p) => (
              <div key={p._id} className="bg-white rounded-3xl border border-zinc-200 p-5 space-y-4">
                <div className="relative w-full h-44">
                  <Image src={p.thumbnail} alt={p.title} fill className="object-contain" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900">{p.title}</h4>
                  <p className="text-xs text-zinc-500">{p.storage} • {p.condition}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                  <span className="font-extrabold text-zinc-950">{formatPrice(p.price)}</span>
                  <Link
                    href={`/products/${p.slug}`}
                    className="text-xs font-bold text-brand-emerald hover:text-brand-emeraldDark"
                  >
                    View Device →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Video Modal Lightbox */}
      {showVideoModal && product.videoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-950 rounded-3xl max-w-xl w-full overflow-hidden border border-zinc-800 shadow-2xl relative">
            <div className="p-4 flex items-center justify-between border-b border-zinc-800">
              <span className="text-xs font-bold text-zinc-300 flex items-center gap-2">
                <Video className="w-4 h-4 text-brand-emerald" />
                Physical Inspection Video • {product.title}
              </span>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-zinc-400 hover:text-white font-bold p-1 text-sm"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video w-full bg-black flex items-center justify-center">
              <video
                src={product.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Action Bar (Screen 3 in Mockup) */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-zinc-200/90 p-3 shadow-lg flex items-center gap-3">
        <button
          onClick={handleAddToCart}
          disabled={addedSuccess || isAdding}
          className="flex-1 py-3 px-3 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-900 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
        >
          {isAdding ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-700" /> Adding...
            </>
          ) : addedSuccess ? (
            <>
              <Check className="w-4 h-4 text-brand-emerald" /> Added
            </>
          ) : (
            'Add to Cart'
          )}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={isBuying}
          className="flex-1 py-3 px-3 rounded-xl bg-brand-emerald hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center gap-1 shadow-md transition active:scale-95 disabled:opacity-80"
        >
          {isBuying ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> Loading...
            </>
          ) : (
            'Buy Now'
          )}
        </button>
      </div>

    </div>
  );
}

