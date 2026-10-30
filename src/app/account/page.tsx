'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import {
  Package,
  RotateCcw,
  User as UserIcon,
  MapPin,
  Heart,
  LogOut,
  Clock,
  CheckCircle2,
  Truck,
  ExternalLink,
  ChevronRight,
  Shield,
  Smartphone,
} from 'lucide-react';
import { formatPrice } from '../../lib/utils';
import { Order, TradeIn } from '../../types';
import { useWishlist } from '../../context/WishlistContext';

export default function AccountPage() {
  const { data: session } = useSession();
  const { wishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState<'orders' | 'tradeins' | 'profile' | 'addresses' | 'wishlist'>('orders');
  const [orderFilter, setOrderFilter] = useState<'All' | 'Processing' | 'Shipped' | 'Delivered'>('All');
  const [orders, setOrders] = useState<Order[]>([]);
  const [tradeIns, setTradeIns] = useState<TradeIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [ordRes, tiRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/trade-in'),
        ]);
        const ordData = await ordRes.json();
        const tiData = await tiRes.json();
        if (ordData.success) setOrders(ordData.data);
        if (tiData.success) setTradeIns(tiData.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'All') return true;
    return o.orderStatus === orderFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-brand-emeraldDark border border-emerald-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'Processing':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      default:
        return 'bg-zinc-100 text-zinc-700 border border-zinc-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Title */}
      <div className="mb-8 pb-4 border-b border-zinc-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
          Customer Account
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          Welcome back, {session?.user?.name || 'Rahul Yadav'} ({session?.user?.email || 'rahul.demo@iphonehub.in'})
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar (Matches layout in image 1!) */}
        <div className="lg:col-span-3 bg-zinc-50 rounded-3xl border border-zinc-200/80 p-3 space-y-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60'
            }`}
          >
            <Package className="w-4 h-4 text-zinc-500" />
            <span>My Orders</span>
          </button>

          <button
            onClick={() => setActiveTab('tradeins')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'tradeins'
                ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60'
            }`}
          >
            <RotateCcw className="w-4 h-4 text-zinc-500" />
            <span>Trade-in Requests</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'wishlist'
                ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60'
            }`}
          >
            <Heart className="w-4 h-4 text-zinc-500" />
            <span>Saved Wishlist ({wishlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60'
            }`}
          >
            <UserIcon className="w-4 h-4 text-zinc-500" />
            <span>My Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'addresses'
                ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60'
            }`}
          >
            <MapPin className="w-4 h-4 text-zinc-500" />
            <span>Address Book</span>
          </button>

          <div className="border-t border-zinc-200 my-2 pt-1">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-9">
          
          {/* TAB 1: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              {/* Filter Tabs */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  {(['All', 'Processing', 'Shipped', 'Delivered'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setOrderFilter(filter)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        orderFilter === filter
                          ? 'bg-brand-black text-white'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-white rounded-3xl border border-zinc-200/80 p-5 sm:p-6 space-y-4 hover:shadow-subtle transition-shadow"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-zinc-900 text-sm">
                            #{order.orderNumber}
                          </span>
                          <span className="text-zinc-400">•</span>
                          <span className="text-zinc-500 font-medium">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold ${getStatusBadge(
                              order.orderStatus
                            )}`}
                          >
                            {order.orderStatus}
                          </span>
                          <button
                            onClick={() => setSelectedOrderForTracking(order)}
                            className="text-xs font-bold text-brand-emerald hover:underline flex items-center gap-1"
                          >
                            View Details / Track →
                          </button>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="relative w-16 h-16 bg-zinc-50 rounded-xl p-1.5 shrink-0 border border-zinc-100">
                              <Image src={item.image} alt={item.title} fill className="object-contain" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-sm text-zinc-900">{item.title}</h4>
                              <p className="text-xs text-zinc-500">
                                {item.storage} • {item.condition} • Qty {item.quantity}
                              </p>
                            </div>
                            <span className="font-extrabold text-sm text-zinc-950">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-xs text-zinc-600">
                        <span>Paid via {order.paymentMethod} • Shipping: {order.shippingAddress.city}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-400">Total Paid:</span>
                          <span className="font-black text-sm text-zinc-950">
                            {formatPrice(order.total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-zinc-50 rounded-3xl p-12 text-center text-zinc-500 text-sm">
                    No orders found in &quot;{orderFilter}&quot; status.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TRADE-IN REQUESTS */}
          {activeTab === 'tradeins' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <h3 className="font-bold text-lg text-zinc-900">Your Trade-in Requests</h3>
                <Link
                  href="/sell"
                  className="bg-brand-black text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors"
                >
                  + Sell Another iPhone
                </Link>
              </div>

              {tradeIns.map((ti) => (
                <div
                  key={ti._id}
                  className="bg-white rounded-3xl border border-zinc-200/80 p-6 space-y-4 hover:shadow-subtle transition-shadow"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100 text-xs">
                    <span className="font-mono font-bold text-zinc-900 text-sm">
                      {ti.tradeInNumber}
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-[11px] font-bold">
                      {ti.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-base text-zinc-900">{ti.deviceModel}</h4>
                      <p className="text-xs text-zinc-500">
                        {ti.storage} • {ti.condition} Condition • Battery: {ti.issues.batteryHealth}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-400">Estimated Quote</p>
                      <p className="text-xl font-black text-brand-emerald">
                        {formatPrice(ti.finalQuote || ti.estimatedQuote)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-zinc-50 rounded-2xl p-3 text-xs text-zinc-600 space-y-1">
                    <p>
                      <strong>Pickup Scheduled:</strong> {ti.pickupDate} ({ti.pickupTimeSlot})
                    </p>
                    <p>
                      <strong>Doorstep Address:</strong> {ti.pickupAddress.street}, {ti.pickupAddress.city}
                    </p>
                    <p>
                      <strong>Payout Details:</strong> {ti.payoutMethod} ({ti.payoutDetails})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl border border-zinc-200/80 p-8 space-y-6">
              <h3 className="font-bold text-xl text-zinc-900">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-zinc-500 font-bold uppercase">Name</label>
                  <p className="font-bold text-sm text-zinc-900 mt-1">{session?.user?.name || 'Rahul Yadav'}</p>
                </div>
                <div>
                  <label className="text-zinc-500 font-bold uppercase">Email</label>
                  <p className="font-bold text-sm text-zinc-900 mt-1">{session?.user?.email || 'rahul.demo@iphonehub.in'}</p>
                </div>
                <div>
                  <label className="text-zinc-500 font-bold uppercase">Phone Number</label>
                  <p className="font-bold text-sm text-zinc-900 mt-1">+91 98765 43210</p>
                </div>
                <div>
                  <label className="text-zinc-500 font-bold uppercase">Account Role</label>
                  <p className="font-bold text-sm text-brand-emerald mt-1">Verified Customer</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ADDRESS BOOK */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-3xl border border-zinc-200/80 p-8 space-y-4">
              <h3 className="font-bold text-xl text-zinc-900">Saved Addresses</h3>
              <div className="p-4 rounded-2xl border border-brand-emerald bg-emerald-50/20 text-xs space-y-1">
                <span className="font-bold text-brand-emeraldDark bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                  Default Delivery
                </span>
                <p className="font-bold text-sm text-zinc-900 pt-1">Rahul Yadav</p>
                <p className="text-zinc-600">402, Apex Signature Heights, Outer Ring Road</p>
                <p className="text-zinc-600">Bengaluru, Karnataka - 560103</p>
                <p className="text-zinc-600">Mobile: +91 98765 43210</p>
              </div>
            </div>
          )}

          {/* TAB 5: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <h3 className="font-bold text-xl text-zinc-900">Your Saved Wishlist ({wishlist.length})</h3>
              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlist.map((item) => (
                    <div key={item._id} className="bg-white rounded-2xl border border-zinc-200 p-4 flex gap-4">
                      <div className="relative w-20 h-20 bg-zinc-50 rounded-xl p-1 shrink-0">
                        <Image src={item.thumbnail} alt={item.title} fill className="object-contain" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-zinc-900">{item.title}</h4>
                        <p className="text-xs text-zinc-500">{item.storage} • {item.condition}</p>
                        <p className="font-extrabold text-sm text-zinc-950">{formatPrice(item.price)}</p>
                        <Link
                          href={`/products/${item.slug}`}
                          className="inline-block text-xs font-bold text-brand-emerald hover:underline"
                        >
                          View Device →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-zinc-50 rounded-3xl p-12 text-center text-zinc-500 text-sm">
                  Your wishlist is empty. Tap the heart icon on any iPhone to save it.
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* TRACKING MODAL */}
      {selectedOrderForTracking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-zinc-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="font-extrabold text-lg text-zinc-900">
                  Track #{selectedOrderForTracking.orderNumber}
                </h3>
                <p className="text-xs text-zinc-500">
                  Carrier: {selectedOrderForTracking.carrier} • Airway Bill: {selectedOrderForTracking.trackingNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderForTracking(null)}
                className="text-zinc-400 hover:text-zinc-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              {selectedOrderForTracking.statusHistory.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 relative">
                  <div className="w-6 h-6 rounded-full bg-brand-emerald text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <p className="font-bold text-xs sm:text-sm text-zinc-900">{step.status}</p>
                    <p className="text-xs text-zinc-500">{step.description}</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedOrderForTracking(null)}
              className="w-full py-3 bg-brand-black text-white rounded-xl text-xs font-bold hover:bg-zinc-800"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

