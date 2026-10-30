'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Clock,
  ArrowLeft,
  MapPin,
  Calendar,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Order, OrderStatus } from '@/types';

export default function OrderTrackingPage({
  params,
}: {
  params: { id: string };
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center text-zinc-500">
        Loading tracking details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-zinc-900">Order Not Found</h2>
        <p className="text-sm text-zinc-500">
          We could not find an order with reference &quot;{params.id}&quot;.
        </p>
        <Link
          href="/account"
          className="inline-block bg-brand-black text-white px-5 py-2.5 rounded-xl text-xs font-bold"
        >
          Back to My Account
        </Link>
      </div>
    );
  }

  const trackingSteps: OrderStatus[] = [
    'Order Placed',
    'Payment Confirmed',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];

  const currentStepIndex = trackingSteps.indexOf(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
        <div>
          <Link
            href="/account"
            className="text-xs font-bold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Order Tracking: #{order.orderNumber}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Carrier: {order.carrier || 'BlueDart Express'} • Airway Bill: {order.trackingNumber || 'BD-882910471IN'}
          </p>
        </div>

        <span className="bg-emerald-100 text-brand-emeraldDark px-3.5 py-1.5 rounded-full text-xs font-bold">
          {order.orderStatus}
        </span>
      </div>

      {/* Visual Stepper */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-subtle space-y-6">
        <h3 className="font-extrabold text-base text-zinc-900">Shipment Progress</h3>

        <div className="relative flex items-center justify-between max-w-2xl mx-auto pt-4 pb-2">
          <div className="absolute top-8 left-6 right-6 h-1 bg-zinc-200 -z-0" />
          <div
            className="absolute top-8 left-6 h-1 bg-brand-emerald transition-all duration-500 -z-0"
            style={{
              width: `${(Math.max(0, currentStepIndex) / (trackingSteps.length - 1)) * 100}%`,
            }}
          />

          {trackingSteps.map((s, idx) => {
            const isCompleted = idx <= currentStepIndex;
            return (
              <div key={s} className="flex flex-col items-center gap-2 z-10">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-brand-emerald text-white ring-4 ring-white shadow-sm'
                      : 'bg-zinc-100 text-zinc-400'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <span
                  className={`text-[11px] font-semibold text-center max-w-[70px] hidden sm:block ${
                    isCompleted ? 'text-zinc-900' : 'text-zinc-400'
                  }`}
                >
                  {s}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Ordered Items */}
        <div className="bg-zinc-50 rounded-3xl border border-zinc-200/80 p-6 space-y-4">
          <h3 className="font-bold text-base text-zinc-900">Device Details</h3>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="relative w-16 h-16 bg-white rounded-xl p-1 shrink-0 border border-zinc-200">
                  <Image src={item.image} alt={item.title} fill className="object-contain" />
                </div>
                <div className="flex-1 text-xs">
                  <h4 className="font-bold text-zinc-900">{item.title}</h4>
                  <p className="text-zinc-500">{item.storage} • {item.condition}</p>
                  <p className="font-extrabold text-zinc-950 mt-0.5">{formatPrice(item.price)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-200 pt-3 text-xs flex justify-between font-bold text-zinc-950">
            <span>Total Paid Amount:</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-zinc-50 rounded-3xl border border-zinc-200/80 p-6 space-y-4">
          <h3 className="font-bold text-base text-zinc-900">Delivery Address</h3>
          <div className="text-xs text-zinc-600 space-y-1">
            <p className="font-bold text-sm text-zinc-900">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}</p>
            <p className="pt-1 font-semibold text-zinc-800">Phone: {order.shippingAddress.phone}</p>
            <p className="pt-2 text-emerald-700 font-bold flex items-center gap-1.5">
              <Truck className="w-4 h-4" /> Pan India Express Delivery
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

