'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Smartphone, Mail, Lock, ArrowRight, UserCheck } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password: password || 'defaultpass',
        name: name || email.split('@')[0],
      });

      if (res?.error) {
        setError(res.error);
      } else {
        window.location.href = '/account';
      }
    } catch (err) {
      setError('An unexpected error occurred during sign-in.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCustomerDemo = () => {
    setEmail('customer.demo@iphonehub.in');
    setName('Rahul Yadav');
    signIn('credentials', {
      callbackUrl: '/account',
      email: 'customer.demo@iphonehub.in',
      name: 'Rahul Yadav',
      password: 'democustomerpass',
    });
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-zinc-200/80 p-8 sm:p-10 space-y-8 shadow-card">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-brand-black flex items-center justify-center text-white">
              <Smartphone className="w-6 h-6 text-brand-emerald" />
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
            Customer Sign In
          </h1>
          <p className="text-xs text-zinc-500">
            Sign in to track orders, manage trade-in valuations, and checkout faster.
          </p>
        </div>

        {/* Google OAuth Button */}
        <div className="space-y-3">
          <button
            onClick={() => signIn('google', { callbackUrl: '/account' })}
            className="w-full py-3 px-4 rounded-2xl border border-zinc-300 hover:border-zinc-400 bg-white hover:bg-zinc-50 font-bold text-xs sm:text-sm text-zinc-800 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-[0.99]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="h-px bg-zinc-200 flex-1" />
            <span className="text-[11px] font-bold text-zinc-400 uppercase">Or with Email</span>
            <div className="h-px bg-zinc-200 flex-1" />
          </div>
        </div>

        {/* Email form */}
        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          {error && <p className="text-xs text-rose-500 font-semibold">{error}</p>}

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-600">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-emerald"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-600">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-emerald"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-black hover:bg-zinc-800 text-white rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {loading ? 'Signing in...' : 'Sign In as Customer'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Demo Login for Customers Only */}
        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-2">
          <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-center">
            Instant Customer Demo
          </p>
          <button
            onClick={handleQuickCustomerDemo}
            className="w-full py-2.5 px-3 rounded-xl bg-white border border-zinc-200 hover:border-brand-emerald text-xs font-semibold text-zinc-800 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4 text-brand-emerald" />
            👤 Continue as Demo Customer
          </button>
        </div>

      </div>
    </div>
  );
}
