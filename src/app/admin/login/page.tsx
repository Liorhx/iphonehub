'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import {
  ShieldCheck,
  KeyRound,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  RotateCw,
  Lock,
} from 'lucide-react';

export default function AdminLoginPage() {
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [targetEmail, setTargetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Request 6-digit OTP sent to configured ADMIN_EMAILS in .env
  const handleRequestOtp = async () => {
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to dispatch security code to administrator email.');
        return;
      }

      setTargetEmail(data.targetEmail || '');
      setStep('verify');
      setSuccessMsg('A 6-digit authorization code has been dispatched to the registered administrator email.');
    } catch (err: unknown) {
      setError('Network error occurred while requesting code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP & Grant Admin Session
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setError('Please enter the full 6-digit security code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, otp }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid or expired code. Access denied.');
        return;
      }

      // Establish verified NextAuth admin session
      const authRes = await signIn('credentials', {
        redirect: false,
        email: targetEmail,
        admin_otp_verified: 'true',
        name: 'Admin Console',
      });

      if (authRes?.error) {
        setError(authRes.error);
        return;
      }

      setSuccessMsg('Authorization verified! Opening Admin Control Center...');
      setTimeout(() => {
        window.location.href = '/admin';
      }, 700);
    } catch (err: unknown) {
      setError('An error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-zinc-50 to-zinc-100">
      <div className="max-w-md w-full bg-white rounded-3xl border border-zinc-200/90 p-8 sm:p-10 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Subtle Top Emerald Gradient Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-black text-white shadow-md mx-auto mb-1">
            <ShieldCheck className="w-7 h-7 text-brand-emerald" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
              Admin Gateway
            </h1>
            <span className="bg-emerald-100 text-brand-emerald text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              2FA Protected
            </span>
          </div>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
            iPhoneHub operations console for catalog inventory, orders, and doorstep valuation management.
          </p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-700 font-semibold flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1: Single-Click "Get Admin OTP" (No prefilled email, No Google button) */}
        {step === 'request' && (
          <div className="space-y-5">
            <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200/80 text-center space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-zinc-700 font-bold text-xs uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5 text-brand-emerald" />
                <span>Authorized Administrator Access</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Click below to send a single-use 6-digit authorization code to the registered administrator email.
              </p>
            </div>

            <button
              onClick={handleRequestOtp}
              disabled={loading}
              className="w-full py-4 bg-brand-black hover:bg-zinc-800 text-white rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin text-brand-emerald" />
                  <span>Dispatching Code to Admin Email...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-brand-emerald group-hover:rotate-12 transition-transform" />
                  <span>Get OTP to Admin Email</span>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-600 font-medium">
                ← Return to Storefront
              </Link>
            </div>
          </div>
        )}

        {/* STEP 2: 6-Digit OTP Verification Form (No prefilled email displayed) */}
        {step === 'verify' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="text-center space-y-1 p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80">
              <p className="text-xs font-semibold text-zinc-700">
                Security code dispatched
              </p>
              <p className="text-[11px] text-zinc-500">
                Please check your administrator email inbox and enter the 6-digit code.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700 text-center block">
                Enter 6-Digit Security Code
              </label>
              <div className="relative">
                <KeyRound className="w-5 h-5 text-zinc-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="••••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border-2 border-zinc-200 focus:border-brand-emerald rounded-2xl text-center text-2xl font-mono font-black tracking-widest text-zinc-950 focus:outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full py-4 bg-brand-emerald hover:bg-emerald-600 text-white rounded-2xl font-black text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify OTP & Enter Admin Dashboard</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setStep('request')}
                className="text-zinc-500 hover:text-zinc-800 font-semibold"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleRequestOtp}
                className="text-brand-emerald hover:underline font-bold"
              >
                Resend Code
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
