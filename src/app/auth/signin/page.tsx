'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Smartphone,
  ShieldCheck,
  Zap,
  Package,
  Loader2,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Shield,
} from 'lucide-react';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/account';
  const urlError = searchParams?.get('error');

  const { data: session, status } = useSession();

  const [authMethod, setAuthMethod] = useState<'email' | 'google'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string>(
    urlError === 'OAuthCallback' || urlError === 'OAuthSignin'
      ? 'Google Sign-In was cancelled or configuration mismatch. Please use Email Sign-In below.'
      : ''
  );

  // If already authenticated, redirect to callbackUrl
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      router.push(callbackUrl);
    }
  }, [status, session, router, callbackUrl]);

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    setError('');
    signIn('google', { callbackUrl });
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
        name: name.trim() || email.split('@')[0],
      });

      if (res?.error) {
        setError(res.error === 'CredentialsSignin' ? 'Invalid email or password.' : res.error);
      } else {
        router.push(callbackUrl);
      }
    } catch (err: unknown) {
      console.error('Credentials signin error:', err);
      setError('An unexpected error occurred during sign-in.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCustomerDemo = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: 'customer.demo@iphonehub.in',
        name: 'Rahul Yadav',
        password: 'democustomerpass',
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push(callbackUrl);
      }
    } catch {
      setError('Failed to log in with demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-zinc-50 via-white to-zinc-100">
      <div className="max-w-md w-full bg-white rounded-3xl border border-zinc-200/80 p-8 sm:p-10 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Top Emerald Accent Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500" />

        {/* Header & Brand Identity */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center justify-center group">
            <div className="w-13 h-13 rounded-2xl bg-brand-black flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300">
              <Smartphone className="w-7 h-7 text-brand-emerald" />
            </div>
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-zinc-950 tracking-tight sm:text-3xl">
              Customer Sign In
            </h1>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
              Sign in to manage orders, doorstep trade-in valuations, and saved addresses.
            </p>
          </div>
        </div>

        {/* Authenticated State Notice */}
        {status === 'authenticated' && session?.user ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto animate-bounce" />
            <div className="space-y-1">
              <p className="font-extrabold text-sm text-emerald-950">Already Signed In</p>
              <p className="text-xs text-emerald-700">
                Welcome back, {session.user.name || session.user.email}! Redirecting...
              </p>
            </div>
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600 mx-auto" />
          </div>
        ) : (
          <div className="space-y-5">
            {/* Error banner */}
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-semibold">{error}</span>
              </div>
            )}

            {/* Google OAuth Option */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="w-full py-3.5 px-4 rounded-2xl border-2 border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50 font-bold text-xs sm:text-sm text-zinc-800 transition-all flex items-center justify-center gap-3 shadow-xs hover:shadow-md active:scale-[0.99] group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-brand-emerald" />
                  <span>Connecting with Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                  <span className="text-zinc-900 group-hover:text-black">
                    Continue with Google
                  </span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px bg-zinc-200 flex-1" />
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Or Sign In with Email
              </span>
              <div className="h-px bg-zinc-200 flex-1" />
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleCredentialsSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-emerald transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-emerald transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500">
                  Full Name <span className="text-zinc-400 font-normal">(Optional for new accounts)</span>
                </label>
                <input
                  type="text"
                  placeholder="Rahul Yadav"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-emerald transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full py-3.5 bg-brand-black hover:bg-zinc-800 text-white rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-brand-emerald" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In / Create Account</span>
                    <ArrowRight className="w-4 h-4 text-brand-emerald" />
                  </>
                )}
              </button>
            </form>

            {/* Quick 1-Click Demo Customer Access */}
            <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-2 text-center">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                Instant Customer Demo
              </span>
              <button
                type="button"
                onClick={handleQuickCustomerDemo}
                disabled={loading}
                className="w-full py-2.5 px-3 rounded-xl bg-white border border-zinc-200 hover:border-brand-emerald text-xs font-bold text-zinc-800 transition-colors shadow-xs flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-brand-emerald" />
                <span>Continue as Demo Customer</span>
              </button>
            </div>

            {/* Value Proposition Pills */}
            <div className="bg-zinc-50/70 rounded-2xl border border-zinc-200/60 p-3.5 space-y-2 text-xs text-zinc-600">
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-brand-emerald shrink-0" />
                <span className="font-semibold text-zinc-800">100% Seamless</span>
                <span className="text-zinc-400 text-[11px]">— Instant order & trade-in tracking</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-brand-emerald shrink-0" />
                <span className="font-semibold text-zinc-800">Secure Sessions</span>
                <span className="text-zinc-400 text-[11px]">— 256-bit encrypted authentication</span>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="text-center space-y-2.5 pt-1">
              <div>
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Admin Portal Gateway →</span>
                </Link>
              </div>
              <div>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Storefront</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-emerald" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
