'use client';

import React, { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  AlertCircle,
  CheckCircle2,
  LogOut,
  Loader2,
  ArrowRight,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [signingIn, setSigningIn] = useState(false);

  // If user is already authenticated as admin, redirect to /admin
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const userRole = (session.user as { role?: string }).role;
      if (userRole === 'admin') {
        router.push('/admin');
      }
    }
  }, [status, session, router]);

  const handleGoogleSignIn = () => {
    setSigningIn(true);
    signIn('google', { callbackUrl: '/admin' });
  };

  const isUnauthorizedUser =
    status === 'authenticated' &&
    session?.user &&
    (session.user as { role?: string }).role !== 'admin';

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-zinc-50 to-zinc-100">
      <div className="max-w-md w-full bg-white rounded-3xl border border-zinc-200/90 p-8 sm:p-10 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Top Emerald Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600" />

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
              Protected
            </span>
          </div>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
            Authorized administrator operations for iPhoneHub inventory, orders, and valuations.
          </p>
        </div>

        {/* Status: Loading */}
        {status === 'loading' && (
          <div className="py-8 text-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-brand-emerald mx-auto" />
            <p className="text-xs font-semibold text-zinc-500">Checking credentials...</p>
          </div>
        )}

        {/* Case 1: Unauthorized Google Account Signed In */}
        {isUnauthorizedUser && (
          <div className="space-y-4">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-900">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Access Denied</span>
              </div>
              <p className="leading-relaxed">
                The signed-in Google account (<strong>{session?.user?.email}</strong>) is not registered as an administrator.
              </p>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out & Use Admin Google Account
            </button>

            <div className="text-center pt-2">
              <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-600 font-medium">
                ← Return to Customer Storefront
              </Link>
            </div>
          </div>
        )}

        {/* Case 2: Authorized Admin Session Verified */}
        {status === 'authenticated' && (session?.user as { role?: string })?.role === 'admin' && (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="font-extrabold text-sm text-emerald-950">Admin Verified</h3>
            <p className="text-xs text-emerald-700">Opening Admin Dashboard...</p>
          </div>
        )}

        {/* Case 3: Simple Google Login Button (Default) */}
        {status === 'unauthenticated' && (
          <div className="space-y-4">
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 text-center space-y-1.5">
              <div className="flex items-center justify-center gap-1.5 text-zinc-700 font-bold text-xs uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5 text-brand-emerald" />
                <span>Single Sign-On</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Sign in with the Google account configured in your <code className="bg-zinc-200/60 px-1 py-0.5 rounded font-mono">ADMIN_EMAILS</code> environment variable.
              </p>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={signingIn}
              className="w-full py-4 px-4 rounded-2xl border-2 border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50 font-bold text-xs sm:text-sm text-zinc-800 transition-all flex items-center justify-center gap-3 shadow-md active:scale-[0.99] group"
            >
              {signingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-brand-emerald" />
                  <span>Connecting to Google...</span>
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
                  <span>Login with Google</span>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-600 font-medium">
                ← Return to Customer Storefront
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
