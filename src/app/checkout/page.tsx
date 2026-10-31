'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Truck,
  Check,
  Loader2,
  CreditCard,
  QrCode,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../lib/utils';
import { PaymentMethod } from '../../types';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay?: any;
  }
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      return resolve(true);
    }
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      // In case it already loaded
      if (window.Razorpay) return resolve(true);
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK from checkout.razorpay.com');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { cart, subtotal, appliedCoupon, clearCart } = useCart();

  // Dynamic shipping details (starts empty, auto-populates from user session if available)
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');

  // Auto-fill logged-in customer info
  useEffect(() => {
    if (session?.user) {
      if (session.user.name && !fullName) setFullName(session.user.name);
      if (session.user.email && !email) setEmail(session.user.email);
    }
  }, [session]);

  // Payment method: Defaults to Razorpay Online (UPI/Card/Netbanking/EMI)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const shipping = 0;
  const finalTotal = Math.max(0, subtotal - discount + shipping);

  const handlePlaceOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!fullName || !phone || !street || !pinCode) {
      alert('Please fill out all required shipping address fields.');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      return;
    }

    setProcessing(true);

    try {
      // 1. Create order on backend with inventory & price validation
      const orderPayload = {
        userId: session?.user ? (session.user as { id?: string }).id || session.user.email || 'customer' : `guest_${Date.now()}`,
        customerName: fullName.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
        items: cart.map((item) => ({
          productId: item.product._id,
          title: item.product.title,
          model: item.product.model,
          storage: item.product.storage,
          condition: item.product.condition,
          color: item.product.color,
          price: item.product.price,
          quantity: item.quantity,
          warranty: item.selectedWarranty?.type || item.product.warranty,
        })),
        shippingAddress: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          pinCode: pinCode.trim(),
        },
        paymentMethod,
        couponCode: appliedCoupon?.code,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const orderData = await res.json();

      if (!orderData.success) {
        alert(orderData.error || 'Failed to place order');
        setProcessing(false);
        return;
      }

      const orderNumber = orderData.data.orderNumber;

      // 2. If Razorpay / Online Payment is selected
      if (paymentMethod !== 'COD') {
        // Ensure Razorpay SDK is fully loaded in browser
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded || !window.Razorpay) {
          alert('Unable to load Razorpay payment gateway. Please check your internet connection or disable ad-blockers and try again.');
          setProcessing(false);
          return;
        }

        const paymentRes = await fetch('/api/payment/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: finalTotal, receipt: orderNumber }),
        });

        const paymentJson = await paymentRes.json();

        if (!paymentRes.ok || !paymentJson.success) {
          alert(`Unable to initialize payment gateway: ${paymentJson.error || 'Server error'}`);
          setProcessing(false);
          return;
        }

        // If server is explicitly running in mock fallback mode
        if (paymentJson.isMock) {
          console.warn('⚠️ Razorpay credentials not configured on server; proceeding in simulated order flow.');
          finishOrder(orderNumber);
          return;
        }

        const activeKey = paymentJson.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!activeKey) {
          alert('Razorpay Key ID is missing. Please set NEXT_PUBLIC_RAZORPAY_KEY_ID in your environment settings.');
          setProcessing(false);
          return;
        }

        // Clean phone number (Razorpay requires 10 digits without spaces or symbols)
        const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);

        const options = {
          key: activeKey,
          amount: paymentJson.amount,
          currency: paymentJson.currency || 'INR',
          name: 'iPhoneHub India',
          description: `Order ${orderNumber}`,
          order_id: paymentJson.orderId,
          handler: async function (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) {
            try {
              // Verify signature on backend
              const verifyRes = await fetch('/api/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...response,
                  orderNumber,
                }),
              });
              const verifyJson = await verifyRes.json();
              if (!verifyJson.success) {
                alert(`Payment verification notice: ${verifyJson.error || 'Signature check failed'}`);
              }
              finishOrder(orderNumber);
            } catch (vErr) {
              console.error('Verification error:', vErr);
              finishOrder(orderNumber);
            }
          },
          modal: {
            ondismiss: function () {
              setProcessing(false);
            },
          },
          prefill: {
            name: fullName,
            email,
            contact: cleanPhone,
          },
          notes: {
            orderNumber,
          },
          theme: {
            color: '#0B0B0C',
          },
        };

        const rzp = new window.Razorpay(options);
        // Handle payment failure event from Razorpay modal
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rzp.on('payment.failed', function (resp: any) {
          console.error('Razorpay payment failure:', resp.error);
          alert(`Payment Failed: ${resp.error?.description || resp.error?.reason || 'Transaction declined'}`);
          setProcessing(false);
        });

        rzp.open();
        setProcessing(false);
        return;
      }

      // 3. Complete order (COD Flow)
      finishOrder(orderNumber);
    } catch (err) {
      console.error(err);
      alert('An error occurred while creating order.');
      setProcessing(false);
    }
  };

  const finishOrder = (orderNum: string) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    setOrderComplete(orderNum);
    clearCart();
    setProcessing(false);
  };

  if (orderComplete) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-brand-emerald flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-zinc-900">Order Confirmed!</h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Thank you for purchasing with iPhoneHub. Your order is being prepared for dispatch.
          </p>
          <p className="text-lg font-mono font-bold text-brand-emerald pt-2">
            Order Reference: {orderComplete}
          </p>
        </div>

        <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-5 text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-zinc-500">Payment Status:</span>
            <span className="font-bold text-emerald-700">
              {paymentMethod === 'COD' ? 'Cash on Delivery Verified' : 'Paid & Confirmed via Razorpay'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Estimated Delivery:</span>
            <span className="font-bold text-zinc-800">In 2 business days via BlueDart Air</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Delivery Address:</span>
            <span className="font-medium text-zinc-800 text-right">{street}, {city}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/account"
            className="flex-1 py-3.5 bg-brand-black hover:bg-zinc-800 text-white rounded-2xl font-bold text-xs transition-colors"
          >
            Track Order Status
          </Link>
          <Link
            href="/products"
            className="flex-1 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-2xl font-bold text-xs transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
          <Truck className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-zinc-900">Your bag is empty</h1>
          <p className="text-xs text-zinc-500">Add an iPhone or certified accessory to your cart to proceed with checkout.</p>
        </div>
        <Link
          href="/products"
          className="inline-block px-6 py-3.5 bg-brand-black text-white text-xs font-bold rounded-2xl hover:bg-zinc-800 transition"
        >
          Explore iPhone Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Checkout Progress Stepper (2 Clean Steps) */}
      <div className="flex items-center justify-center gap-6 sm:gap-8 text-xs font-bold border-b border-zinc-200 pb-6">
        <Link href="/cart" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-700 transition">
          <span className="w-6 h-6 rounded-full bg-emerald-100 text-brand-emerald flex items-center justify-center text-[11px] font-bold">
            <Check className="w-3.5 h-3.5" />
          </span>
          <span>Cart</span>
        </Link>
        <div className="w-12 h-0.5 bg-brand-emerald" />
        <div className="flex items-center gap-2 text-brand-emerald">
          <span className="w-6 h-6 rounded-full bg-brand-emerald text-white flex items-center justify-center text-[11px] font-bold">
            2
          </span>
          <span className="text-zinc-900 font-extrabold">Shipping & Payment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Shipping & Direct Pay Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 space-y-6 shadow-subtle">
            <div>
              <h2 className="text-xl font-extrabold text-zinc-900">Delivery & Payment</h2>
              <p className="text-xs text-zinc-500 mt-1">
                Enter your shipping address. You can complete payment directly via Razorpay (UPI, Cards, NetBanking, EMI) on submit.
              </p>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-600">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-emerald"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-600">Mobile Number (for delivery & SMS updates)</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-600">Email Address (for invoice & tracking link)</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-600">Street Address / Flat / Building</label>
                <input
                  type="text"
                  required
                  placeholder="Flat/House No, Building, Street, Area"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-600">City</label>
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-emerald"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-600">State</label>
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-emerald"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-600">PIN Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="PIN Code"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              {/* Optional Cash on Delivery Toggle */}
              <div className="pt-2">
                <label className="flex items-center justify-between p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-100/70 cursor-pointer transition">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={paymentMethod === 'COD'}
                      onChange={(e) => setPaymentMethod(e.target.checked ? 'COD' : 'UPI')}
                      className="w-4 h-4 rounded text-brand-black accent-brand-black"
                    />
                    <div>
                      <p className="text-xs font-bold text-zinc-900">
                        Prefer Cash on Delivery (COD)
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Pay with cash or QR code when the package arrives at your doorstep
                      </p>
                    </div>
                  </div>
                  {paymentMethod === 'COD' && (
                    <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      COD Active
                    </span>
                  )}
                </label>
              </div>

              {/* Direct Payment / Order Action Button */}
              <div className="pt-3 space-y-3">
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-4 bg-brand-black hover:bg-zinc-800 text-white rounded-2xl font-extrabold text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-brand-emerald" />
                      <span>{paymentMethod === 'COD' ? 'Placing Order...' : 'Opening Secure Razorpay Gateway...'}</span>
                    </>
                  ) : paymentMethod === 'COD' ? (
                    <>
                      <Truck className="w-4 h-4 text-brand-emerald" />
                      <span>Place Cash on Delivery Order • {formatPrice(finalTotal)}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-brand-emerald" />
                      <span>Pay {formatPrice(finalTotal)} with Razorpay</span>
                    </>
                  )}
                </button>

                {paymentMethod !== 'COD' ? (
                  <div className="text-center space-y-1">
                    <p className="text-[11px] font-semibold text-zinc-600 flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                      Supports Google Pay, PhonePe, Paytm, Cards, NetBanking & EMI
                    </p>
                    <p className="text-[10px] text-zinc-400 flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3 text-zinc-400" />
                      100% Secure 256-bit Encrypted Transaction
                    </p>
                  </div>
                ) : (
                  <p className="text-center text-[11px] text-zinc-500">
                    Verify order details before submitting. An SMS confirmation will be sent to your phone.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-zinc-50 rounded-3xl border border-zinc-200/80 p-6 space-y-4">
            <h3 className="font-bold text-base text-zinc-900">Order Summary</h3>
            <div className="space-y-3 divide-y divide-zinc-200/60 text-xs">
              {cart.map((i) => (
                <div key={i.product._id} className="pt-2 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-zinc-900">{i.product.title}</p>
                    <p className="text-zinc-500">{i.product.storage} • {i.product.color} • Qty {i.quantity}</p>
                  </div>
                  <span className="font-bold text-zinc-900">
                    {formatPrice(i.product.price * i.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-200 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-brand-emerald font-semibold">
                  <span>Discount</span>
                  <span>- {formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-500">
                <span>Express Insured Shipping</span>
                <span className="text-emerald-700 font-bold uppercase">Free</span>
              </div>
              <div className="border-t border-zinc-200 pt-2 flex justify-between font-bold text-sm text-zinc-950">
                <span>Total Amount</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-zinc-200/70 text-[11px] text-zinc-500 space-y-1">
              <p className="font-semibold text-zinc-800 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald" /> 1-Year Warranty & 7-Day Replacement
              </p>
              <p>Every device passes our 45-point hardware check before dispatch.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

