'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, BatteryCharging, Shield, Check, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAdded, setIsAdded] = useState(false);

  const discount = calculateDiscount(product.originalPrice, product.price);
  const isWishlisted = isInWishlist(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const getConditionColor = (cond: string) => {
    switch (cond) {
      case 'Flawless':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Excellent':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Good':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-3xl border border-zinc-200/80 hover:border-zinc-300 hover:shadow-cardHover transition-all duration-300 flex flex-col justify-between overflow-hidden p-4 sm:p-5"
    >
      {/* Top Badges */}
      <div className="flex items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getConditionColor(
              product.condition
            )}`}
          >
            {product.condition}
          </span>
          {discount > 0 && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label="Save to Wishlist"
          className="p-2 rounded-full bg-white/80 hover:bg-zinc-100 border border-zinc-200 transition-colors shadow-sm"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'text-rose-500 fill-rose-500' : 'text-zinc-400 hover:text-zinc-700'
            }`}
          />
        </button>
      </div>

      {/* Product Image Link */}
      <Link href={`/products/${product.slug}`} className="block relative my-4 sm:my-6 overflow-hidden">
        <div className="relative w-full h-48 sm:h-56 flex items-center justify-center p-2">
          <Image
            src={product.thumbnail || product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="space-y-3 pt-2 border-t border-zinc-100">
        <Link href={`/products/${product.slug}`} className="block group-hover:text-brand-emerald transition-colors">
          <h3 className="font-bold text-base sm:text-lg text-zinc-900 leading-tight">
            {product.title}
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5 font-medium">
            {product.storage} • {product.color}
          </p>
        </Link>

        {/* Specs Pill row */}
        <div className="flex items-center gap-3 text-xs text-zinc-600">
          <span className="flex items-center gap-1 bg-zinc-100 px-2 py-0.5 rounded-md">
            <BatteryCharging className="w-3.5 h-3.5 text-brand-emerald" />
            {product.batteryHealth}% Battery
          </span>
          <span className="flex items-center gap-1 bg-zinc-100 px-2 py-0.5 rounded-md text-[11px] truncate">
            <Shield className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            6M Warranty
          </span>
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-extrabold text-zinc-950">
                {formatPrice(product.price)}
              </span>
            </div>
            {product.originalPrice > product.price && (
              <span className="text-xs text-zinc-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 ${
              isAdded
                ? 'bg-brand-emerald text-white shadow-sm'
                : 'bg-brand-black text-white hover:bg-zinc-800 active:scale-95'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

