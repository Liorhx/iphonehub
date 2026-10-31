'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  CreditCard,
  QrCode,
  Truck,
  ArrowRight,
  ChevronRight,
  Check,
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
  const { cart, subtotal, appliedCoupon, clearCart } = useCart();

  const [step, setStep] = useState<2 | 3>(2);

  // Shipping details
  const [fullName, setFullName] = useState('Rahul Yadav');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('rahul.demo@iphonehub.in');
  const [street, setStreet] = useState('402, Apex Signature Heights, Outer Ring Road');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [pinCode, setPinCode] = useState('560103');

  // Payment details
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const shipping = 0;
  const finalTotal = Math.max(0, subtotal - discount + shipping);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !street || !pinCode) {
      alert('Please fill out all required address fields.');
      return;
    }
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);

    try {
      // 1. Create order on backend with inventory & price validation
      const orderPayload = {
        userId: 'user_demo_1',
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
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
          fullName,
          phone,
          street,
          city,
          state,
          pinCode,
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

      // 3. Complete order (COD or Mock Payment Flow)
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
              {paymentMethod === 'COD' ? 'Cash on Delivery Verified' : 'Paid & Confirmed'}
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Checkout Progress Stepper */}
      <div className="flex items-center justify-center gap-8 text-xs font-bold border-b border-zinc-200 pb-6">
        <Link href="/cart" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-700">
          <Check className="w-4 h-4 text-brand-emerald" />
          <span>Cart</span>
        </Link>
        <div className="w-12 h-0.5 bg-brand-emerald" />
        <div
          className={`flex items-center gap-2 ${
            step === 2 ? 'text-brand-emerald' : 'text-zinc-900 font-bold'
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
              step >= 2 ? 'bg-brand-emerald text-white' : 'bg-zinc-100 text-zinc-400'
            }`}
          >
            2
          </span>
          <span>Shipping</span>
        </div>
        <div className={`w-12 h-0.5 ${step === 3 ? 'bg-brand-emerald' : 'bg-zinc-200'}`} />
        <div
          className={`flex items-center gap-2 ${
            step === 3 ? 'text-brand-emerald' : 'text-zinc-400'
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
              step === 3 ? 'bg-brand-emerald text-white' : 'bg-zinc-100 text-zinc-400'
            }`}
          >
            3
          </span>
          <span>Payment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Forms */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* STEP 2: SHIPPING ADDRESS */}
          {step === 2 && (
            <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 space-y-6 shadow-subtle">
              <h2 className="text-xl font-extrabold text-zinc-900">Shipping Address</h2>

              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-600">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-600">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-600">Email Address (for invoices & tracking)</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-emerald"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-600">Street Address / Flat / Floor</label>
                  <input
                    type="text"
                    required
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
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-4 bg-brand-black hover:bg-zinc-800 text-white rounded-2xl font-bold text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    Proceed to Payment Options
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {step === 3 && (
            <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 space-y-6 shadow-subtle">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-zinc-900">Choose Payment Method</h2>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 underline"
                >
                  Edit Address
                </button>
              </div>

              {/* Payment Option Cards */}
              <div className="space-y-3">
                
                {/* UPI */}
                <label
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-brand-black bg-zinc-50'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="w-4 h-4 accent-brand-black"
                    />
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-zinc-900">
                        UPI (PhonePe, Google Pay, Paytm, BHIM)
                      </p>
                      <p className="text-[11px] text-zinc-500">Instant verification & fast dispatch</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-brand-emerald bg-emerald-50 px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </label>

                {/* Credit / Debit Card */}
                <label
                  onClick={() => setPaymentMethod('Card')}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'Card'
                      ? 'border-brand-black bg-zinc-50'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'Card'}
                      onChange={() => setPaymentMethod('Card')}
                      className="w-4 h-4 accent-brand-black"
                    />
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-zinc-900">
                        Credit / Debit Card
                      </p>
                      <p className="text-[11px] text-zinc-500">Visa, MasterCard, RuPay, Amex</p>
                    </div>
                  </div>
                </label>

                {/* No Cost EMI */}
                <label
                  onClick={() => setPaymentMethod('EMI')}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'EMI'
                      ? 'border-brand-black bg-zinc-50'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'EMI'}
                      onChange={() => setPaymentMethod('EMI')}
                      className="w-4 h-4 accent-brand-black"
                    />
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-zinc-900">
                        No-Cost EMI (via Razorpay)
                      </p>
                      <p className="text-[11px] text-zinc-500">Starts from ₹{Math.round(finalTotal / 12).toLocaleString('en-IN')}/mo</p>
                    </div>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-brand-black bg-zinc-50'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="w-4 h-4 accent-brand-black"
                    />
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-zinc-900">
                        Cash on Delivery
                      </p>
                      <p className="text-[11px] text-zinc-500">Pay when you receive the product</p>
                    </div>
                  </div>
                </label>

              </div>

              {/* Pay Now Button */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={processing}
                className="w-full py-4 bg-brand-black hover:bg-zinc-800 text-white rounded-2xl font-extrabold text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {processing ? 'Processing Payment...' : `Pay ${formatPrice(finalTotal)}`}
              </button>

              <p className="text-center text-[11px] text-zinc-400 flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-brand-emerald" /> 256-bit Encrypted & Razorpay Verified Payment
              </p>
            </div>
          )}

        </div>

        {/* Right Column: Mini Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-zinc-50 rounded-3xl border border-zinc-200/80 p-6 space-y-4">
            <h3 className="font-bold text-base text-zinc-900">Items in Bag</h3>
            <div className="space-y-3 divide-y divide-zinc-200/60 text-xs">
              {cart.map((i) => (
                <div key={i.product._id} className="pt-2 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-zinc-900">{i.product.title}</p>
                    <p className="text-zinc-500">{i.product.storage} • Qty {i.quantity}</p>
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
                <span>Express Delivery</span>
                <span className="text-emerald-700 font-bold uppercase">Free</span>
              </div>
              <div className="border-t border-zinc-200 pt-2 flex justify-between font-bold text-sm text-zinc-950">
                <span>Total Amount</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

