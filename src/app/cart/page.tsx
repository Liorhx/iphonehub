'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Tag,
  Check,
  Truck,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../lib/utils';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    appliedCoupon,
    applyCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const shipping = 0; // Free pan-India express
  const finalTotal = Math.max(0, subtotal - discount + shipping);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    setCouponError('');

    try {
      const res = await fetch('/api/coupons/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), cartTotal: subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        applyCoupon(data.data);
        setCouponInput('');
      } else {
        setCouponError(data.error || 'Invalid coupon code');
      }
    } catch (err) {
      setCouponError('Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    applyCoupon(null);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">Your Cart is Empty</h1>
          <p className="text-sm text-zinc-500">
            Explore our verified collection of pre-owned and refurbished iPhones.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-brand-black text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-zinc-800 transition-colors shadow-sm"
        >
          Explore iPhones
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Checkout Progress Stepper */}
      <div className="flex items-center justify-center gap-8 text-xs font-bold border-b border-zinc-200 pb-6">
        <div className="flex items-center gap-2 text-brand-emerald">
          <span className="w-6 h-6 rounded-full bg-brand-emerald text-white flex items-center justify-center text-[11px]">
            1
          </span>
          <span>Cart</span>
        </div>
        <div className="w-12 h-0.5 bg-zinc-200" />
        <div className="flex items-center gap-2 text-zinc-400">
          <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-[11px]">
            2
          </span>
          <span>Shipping</span>
        </div>
        <div className="w-12 h-0.5 bg-zinc-200" />
        <div className="flex items-center gap-2 text-zinc-400">
          <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-[11px]">
            3
          </span>
          <span>Payment</span>
        </div>
      </div>

      {/* Main Grid: Cart Items & Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Items */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-xl font-extrabold text-zinc-900">
              Your Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)} items)
            </h2>
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-zinc-500 hover:text-rose-600 transition-colors"
            >
              Clear Cart
            </button>
          </div>

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.product._id}
                className="bg-white rounded-3xl border border-zinc-200/80 p-4 sm:p-5 flex items-center gap-4 shadow-subtle hover:border-zinc-300 transition-all"
              >
                {/* Product Thumbnail */}
                <div className="relative w-20 h-24 sm:w-24 sm:h-28 bg-zinc-50 rounded-2xl p-2 shrink-0">
                  <Image
                    src={item.product.thumbnail || item.product.images[0]}
                    alt={item.product.title}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-1">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="font-bold text-sm sm:text-base text-zinc-900 hover:text-brand-emerald transition-colors line-clamp-1"
                  >
                    {item.product.title}
                  </Link>
                  <p className="text-xs text-zinc-500 font-medium">
                    {item.product.storage} • {item.product.condition} • {item.product.color}
                  </p>
                  {item.selectedWarranty && (
                    <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      + 6M Extended Warranty
                    </span>
                  )}
                  <p className="text-base font-extrabold text-zinc-950 pt-1">
                    {formatPrice(
                      (item.product.price + (item.selectedWarranty?.price || 0)) * item.quantity
                    )}
                  </p>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex flex-col items-end justify-between h-full space-y-3">
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="p-1.5 text-zinc-400 hover:text-rose-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl p-1 text-xs">
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      className="p-1 hover:bg-white rounded-lg transition-colors text-zinc-600"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold w-4 text-center text-zinc-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="p-1 hover:bg-white rounded-lg transition-colors text-zinc-600"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Guarantees */}
          <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200 text-xs text-zinc-600 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-emerald" /> 6 Months Comprehensive Warranty
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-brand-emerald" /> Free Express Shipping
            </span>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-50 rounded-3xl border border-zinc-200/80 p-6 space-y-6">
            <h3 className="font-bold text-lg text-zinc-900">Order Summary</h3>

            {/* Coupon Code Section */}
            <div className="space-y-2">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. WELCOME500)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-zinc-200 rounded-xl focus:outline-none uppercase font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  disabled={couponLoading}
                  className="bg-brand-black text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors"
                >
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </form>

              {couponError && <p className="text-xs text-rose-500">{couponError}</p>}

              {appliedCoupon && (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs text-emerald-800">
                  <span className="font-bold">Applied: {appliedCoupon.code} (-₹{appliedCoupon.discount})</span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-xs text-rose-600 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 text-sm border-t border-zinc-200 pt-4">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-brand-emerald font-semibold">
                  <span>Discount</span>
                  <span>- {formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-600">
                <span>Express Delivery</span>
                <span className="font-semibold text-emerald-700 uppercase text-xs">Free</span>
              </div>
              <div className="border-t border-zinc-200 pt-3 flex justify-between items-baseline">
                <span className="text-base font-bold text-zinc-900">Total</span>
                <span className="text-2xl font-black text-zinc-950">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            {/* Continue to Payment CTA (Desktop only - hidden on mobile to prevent duplicate button) */}
            <button
              onClick={() => {
                setIsCheckingOut(true);
                router.push('/checkout');
              }}
              disabled={isCheckingOut}
              className="hidden md:flex w-full py-4 bg-brand-emerald hover:bg-emerald-600 text-white rounded-2xl font-extrabold text-sm transition-all shadow-md active:scale-[0.99] items-center justify-center gap-2 disabled:opacity-80"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Proceeding to Checkout...
                </>
              ) : (
                <>
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Sticky Checkout Bar (Mobile only - single button) */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-zinc-200/90 p-3 shadow-lg flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-zinc-500 font-semibold block uppercase">Total Amount</span>
          <span className="text-lg font-black text-zinc-950 block -mt-0.5">{formatPrice(finalTotal)}</span>
        </div>
        <button
          onClick={() => {
            setIsCheckingOut(true);
            router.push('/checkout');
          }}
          disabled={isCheckingOut}
          className="flex-1 py-3 px-5 bg-brand-emerald hover:bg-emerald-600 text-white rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 disabled:opacity-80"
        >
          {isCheckingOut ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              Proceed to Checkout
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

    </div>
  );
}

