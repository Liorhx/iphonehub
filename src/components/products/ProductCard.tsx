'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, BatteryCharging, Shield, Check, ShoppingBag, Loader2 } from 'lucide-react';
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
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const discount = calculateDiscount(product.originalPrice, product.price);
  const isWishlisted = isInWishlist(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1800);
    }, 200);
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
      className="group relative bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/80 hover:border-zinc-300 hover:shadow-cardHover transition-all duration-300 flex flex-col justify-between overflow-hidden p-3 sm:p-5"
    >
      {/* Top Badges */}
      <div className="flex items-center justify-between gap-1 z-10">
        <div className="flex items-center gap-1 flex-wrap">
          {product.isBestDeal ? (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
              Best Seller
            </span>
          ) : (
            <span
              className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border ${getConditionColor(
                product.condition
              )}`}
            >
              {product.condition}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label="Save to Wishlist"
          className="p-1.5 sm:p-2 rounded-full bg-white/90 hover:bg-zinc-100 border border-zinc-200 transition-colors shadow-xs"
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
              isWishlisted ? 'text-rose-500 fill-rose-500' : 'text-zinc-400 hover:text-zinc-700'
            }`}
          />
        </button>
      </div>

      {/* Product Image Link */}
      <Link href={`/products/${product.slug}`} className="block relative my-2 sm:my-5 overflow-hidden">
        <div className="relative w-full h-36 sm:h-52 flex items-center justify-center p-2">
          <Image
            src={product.thumbnail || product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="space-y-2 pt-2 border-t border-zinc-100">
        <Link href={`/products/${product.slug}`} className="block group-hover:text-brand-emerald transition-colors">
          <h3 className="font-bold text-sm sm:text-base text-zinc-900 leading-tight truncate">
            {product.title}
          </h3>
          <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5 font-medium truncate">
            {product.storage} • {product.condition}
          </p>
        </Link>

        {/* Price Row */}
        <div className="pt-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-base sm:text-lg font-black text-zinc-950">
              {formatPrice(product.price)}
            </span>
            {discount > 0 && (
              <span className="text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-50 text-brand-emerald border border-emerald-200">
                {discount}% OFF
              </span>
            )}
          </div>
          {product.originalPrice > product.price && (
            <span className="text-[11px] text-zinc-400 line-through block -mt-0.5">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart button (Full-width sleek mobile button as seen in mockup) */}
        <button
          onClick={handleAddToCart}
          disabled={isAdded || isAdding}
          className={`w-full py-2 sm:py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 shadow-xs ${
            isAdded
              ? 'bg-zinc-900 text-white shadow-sm'
              : 'bg-brand-emerald hover:bg-emerald-600 text-white active:scale-98'
          }`}
        >
          {isAdding ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Adding...
            </>
          ) : isAdded ? (
            <>
              <Check className="w-3.5 h-3.5" /> Added
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

