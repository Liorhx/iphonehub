'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ChevronRight,
  Package,
  ShoppingBag,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Order, TradeIn } from '@/types';

export default function MyOrdersPage() {
  const router = useRouter();

  // Mode: 'Buy' (Purchased orders) or 'Sell' (Trade-in / sell requests)
  const [mode, setMode] = useState<'Buy' | 'Sell'>('Buy');

  // Status Filter for Buy
  const [buyStatusFilter, setBuyStatusFilter] = useState<'All' | 'Processing' | 'Shipped' | 'Delivered'>('All');

  // Status Filter for Sell
  const [sellStatusFilter, setSellStatusFilter] = useState<'All' | 'Scheduled' | 'Inspecting' | 'Completed'>('All');

  const [orders, setOrders] = useState<Order[]>([]);
  const [tradeIns, setTradeIns] = useState<TradeIn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrdersData() {
      try {
        const [ordRes, tiRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/trade-in'),
        ]);
        const ordData = await ordRes.json();
        const tiData = await tiRes.json();

        if (ordData.success) {
          setOrders(ordData.data || []);
        }
        if (tiData.success) {
          setTradeIns(tiData.data || []);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrdersData();
  }, []);

  // Filter Buy Orders
  const filteredOrders = orders.filter((order) => {
    if (buyStatusFilter === 'All') return true;
    return order.orderStatus === buyStatusFilter;
  });

  // Filter Sell Trade-Ins
  const filteredTradeIns = tradeIns.filter((ti) => {
    if (sellStatusFilter === 'All') return true;
    if (sellStatusFilter === 'Scheduled') return ti.status === 'Pickup Scheduled' || ti.status === 'Quote Generated';
    if (sellStatusFilter === 'Inspecting') return ti.status === 'Inspection in Progress' || ti.status === 'Device Picked Up';
    if (sellStatusFilter === 'Completed') return ti.status === 'Payment Transferred' || ti.status === 'Price Approved';
    return true;
  });

  const getOrderStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-[#EAFBF3] text-[#0A7A53] border border-[#C2F3DD]';
      case 'Shipped':
        return 'bg-[#EAFBF3] text-[#0A7A53] border border-[#C2F3DD]';
      case 'Processing':
      case 'Order Placed':
      case 'Payment Confirmed':
        return 'bg-[#FFF6E5] text-[#B4690E] border border-[#FDE5B5]';
      case 'Cancelled':
        return 'bg-[#FDE8E8] text-[#9B1C1C] border border-[#F8B4B4]';
      default:
        return 'bg-zinc-100 text-zinc-700 border border-zinc-200';
    }
  };

  const getTradeInStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Payment Transferred':
      case 'Price Approved':
        return 'bg-[#EAFBF3] text-[#0A7A53] border border-[#C2F3DD]';
      case 'Pickup Scheduled':
      case 'Quote Generated':
        return 'bg-[#FFF6E5] text-[#B4690E] border border-[#FDE5B5]';
      case 'Device Picked Up':
      case 'Inspection in Progress':
        return 'bg-[#EBF5FF] text-[#1E429F] border border-[#C3DDFD]';
      case 'Cancelled':
        return 'bg-[#FDE8E8] text-[#9B1C1C] border border-[#F8B4B4]';
      default:
        return 'bg-zinc-100 text-zinc-700 border border-zinc-200';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 sm:py-8 space-y-5 pb-24">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-1 rounded-full hover:bg-zinc-100 text-zinc-900 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>
        <h1 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
          My Orders
        </h1>
      </div>

      {/* Segmented Control (Buy vs Sell) */}
      <div className="bg-zinc-100/90 rounded-2xl p-1 flex border border-zinc-200/70 shadow-xs">
        <button
          type="button"
          onClick={() => setMode('Buy')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
            mode === 'Buy'
              ? 'bg-[#0E524E] text-white shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => setMode('Sell')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
            mode === 'Sell'
              ? 'bg-[#0E524E] text-white shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          Sell
        </button>
      </div>

      {/* Horizontal Status Filter Tabs */}
      {mode === 'Buy' ? (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {(['All', 'Processing', 'Shipped', 'Delivered'] as const).map((filter) => {
            const isActive = buyStatusFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setBuyStatusFilter(filter)}
                className={`relative px-4 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#EAFBF3] text-[#0A7A53] font-bold border border-[#C2F3DD]'
                    : 'bg-zinc-100/90 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
                }`}
              >
                <span>{filter}</span>
                {isActive && (
                  <span className="block w-4 h-0.5 bg-[#0A7A53] rounded-full mx-auto mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {(['All', 'Scheduled', 'Inspecting', 'Completed'] as const).map((filter) => {
            const isActive = sellStatusFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setSellStatusFilter(filter)}
                className={`relative px-4 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#EAFBF3] text-[#0A7A53] font-bold border border-[#C2F3DD]'
                    : 'bg-zinc-100/90 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
                }`}
              >
                <span>{filter}</span>
                {isActive && (
                  <span className="block w-4 h-0.5 bg-[#0A7A53] rounded-full mx-auto mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Orders List Content */}
      <div className="space-y-3 pt-1">
        {loading ? (
          // Shimmer loading skeletons
          <div className="space-y-3 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-zinc-200/80 p-3.5 flex items-center gap-3.5"
              >
                <div className="w-16 h-20 bg-zinc-100 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-28 bg-zinc-200 rounded-md" />
                  <div className="h-3 w-36 bg-zinc-100 rounded-md" />
                  <div className="h-4 w-20 bg-zinc-200 rounded-md" />
                </div>
                <div className="h-6 w-16 bg-zinc-100 rounded-full shrink-0" />
              </div>
            ))}
          </div>
        ) : mode === 'Buy' ? (
          filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const firstItem = order.items?.[0];
              const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 1;

              return (
                <Link
                  key={order._id}
                  href={`/orders/${order.orderNumber || order._id}`}
                  className="bg-white rounded-2xl border border-zinc-200/80 p-3.5 flex items-center justify-between gap-3 hover:border-zinc-300 hover:shadow-subtle transition-all active:scale-[0.99] group"
                >
                  {/* Left Device Thumbnail */}
                  <div className="relative w-16 h-20 bg-zinc-50 rounded-2xl border border-zinc-200/60 p-1.5 shrink-0 flex items-center justify-center">
                    <Image
                      src={
                        firstItem?.image ||
                        'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-naturaltitanium-select?wid=940&hei=1112&fmt=png-alpha'
                      }
                      alt={firstItem?.title || 'iPhone'}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Middle Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-extrabold text-sm text-zinc-950 truncate tracking-tight">
                      #{order.orderNumber}
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium">
                      {formatDate(order.createdAt)} • {totalItems} {totalItems === 1 ? 'item' : 'items'}
                    </p>
                    <p className="font-extrabold text-sm text-zinc-950 pt-0.5">
                      {formatPrice(order.total)}
                    </p>
                  </div>

                  {/* Right Status Badge & Arrow */}
                  <div className="flex flex-col items-end justify-between self-stretch shrink-0 py-0.5">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${getOrderStatusBadgeClass(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="bg-zinc-50 rounded-3xl p-10 border border-zinc-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-zinc-900">No Orders in &quot;{buyStatusFilter}&quot;</h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  When you purchase an iPhone, it will appear here with live tracking.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 bg-brand-emerald text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-600 transition"
                >
                  Explore iPhones
                </Link>
              </div>
            </div>
          )
        ) : filteredTradeIns.length > 0 ? (
          filteredTradeIns.map((ti) => (
            <div
              key={ti._id}
              className="bg-white rounded-2xl border border-zinc-200/80 p-3.5 flex items-center justify-between gap-3 hover:border-zinc-300 hover:shadow-subtle transition-all group"
            >
              {/* Left Device Thumbnail */}
              <div className="relative w-16 h-20 bg-zinc-50 rounded-2xl border border-zinc-200/60 p-1.5 shrink-0 flex items-center justify-center">
                <Image
                  src="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-naturaltitanium-select?wid=940&hei=1112&fmt=png-alpha"
                  alt={ti.deviceModel}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Middle Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <h3 className="font-extrabold text-sm text-zinc-950 truncate tracking-tight">
                  #{ti.tradeInNumber}
                </h3>
                <p className="text-xs text-zinc-400 font-medium truncate">
                  {formatDate(ti.createdAt)} • {ti.deviceModel} ({ti.storage})
                </p>
                <p className="font-extrabold text-sm text-brand-emerald pt-0.5">
                  {formatPrice(ti.estimatedQuote)}
                </p>
              </div>

              {/* Right Status Badge */}
              <div className="flex flex-col items-end justify-between self-stretch shrink-0 py-0.5">
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${getTradeInStatusBadgeClass(
                    ti.status
                  )}`}
                >
                  {ti.status}
                </span>
                <span className="text-[10px] text-zinc-400 font-medium">Doorstep Pickup</span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-zinc-50 rounded-3xl p-10 border border-zinc-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-zinc-900">No Trade-ins in &quot;{sellStatusFilter}&quot;</h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                Sell your old iPhone for instant doorstep cash with zero hassle.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/sell"
                className="inline-flex items-center gap-1.5 bg-[#0E524E] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs hover:bg-[#0A3D3A] transition"
              >
                Sell an iPhone
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

