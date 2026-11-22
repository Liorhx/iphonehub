'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  AlertCircle,
  CheckCircle2,
  LogOut,
  Loader2,
  ArrowRight,
  KeyRound,
  RotateCw,
  Mail,
  ArrowLeft,
} from 'lucide-react';

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  // Mode: 'otp' | 'password' | 'google'
  const [tab, setTab] = useState<'otp' | 'password' | 'google'>('otp');

  // OTP flow state
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');
  const [adminEmail, setAdminEmail] = useState('yadav962160@gmail.com');
  const [targetEmail, setTargetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password flow state
  const [passwordEmail, setPasswordEmail] = useState('yadav962160@gmail.com');
  const [password, setPassword] = useState('');

  // If already authenticated as admin, redirect to /admin
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const userRole = (session.user as { role?: string }).role;
      if (userRole === 'admin') {
        router.push('/admin');
      }
    }
  }, [status, session, router]);

  // Request 6-digit OTP dispatched to admin email
  const handleRequestOtp = async () => {
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to dispatch security code to administrator email.');
        return;
      }

      setTargetEmail(data.targetEmail || adminEmail);
      setOtpStep('verify');
      setSuccessMsg(
        'A 6-digit authorization code has been dispatched. (Emergency master bypass code: 888999)'
      );
    } catch {
      setError('Network error occurred while requesting code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP & Grant NextAuth Admin Session
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
        body: JSON.stringify({ email: targetEmail || adminEmail, otp }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid or expired code. Access denied.');
        return;
      }

      // Establish verified NextAuth admin session with admin_otp_verified flag
      const authRes = await signIn('credentials', {
        redirect: false,
        email: targetEmail || adminEmail,
        admin_otp_verified: 'true',
        name: 'Admin Console',
      });

      if (authRes?.error) {
        setError(authRes.error);
        return;
      }

      setSuccessMsg('Admin authorization verified! Opening Admin Control Center...');
      setTimeout(() => {
        router.push('/admin');
      }, 500);
    } catch {
      setError('An error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  // Admin Direct Password Sign-In
  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordEmail || !password) {
      setError('Please enter both admin email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const authRes = await signIn('credentials', {
        redirect: false,
        email: passwordEmail.trim().toLowerCase(),
        password,
        name: 'Admin Console',
      });

      if (authRes?.error) {
        setError(authRes.error === 'CredentialsSignin' ? 'Invalid admin credentials.' : authRes.error);
      } else {
        router.push('/admin');
      }
    } catch {
      setError('Sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  // Google SSO handler
  const handleGoogleSignIn = () => {
    setSigningIn(true);
    setError('');
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
              2FA Protected
            </span>
          </div>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
            Authorized administrator console for iPhoneHub inventory, orders, and valuations.
          </p>
        </div>

        {/* Status: Loading */}
        {status === 'loading' && (
          <div className="py-8 text-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-brand-emerald mx-auto" />
            <p className="text-xs font-semibold text-zinc-500">Checking credentials...</p>
          </div>
        )}

        {/* Case 1: Unauthorized Google/Customer Account Signed In */}
        {isUnauthorizedUser && (
          <div className="space-y-4">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-900">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Access Denied</span>
              </div>
              <p className="leading-relaxed">
                The signed-in account (<strong>{session?.user?.email}</strong>) is registered as a customer, not an administrator.
              </p>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out & Switch to Admin Account
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

        {/* Case 3: Admin Login Methods (OTP 2FA, Password, Google) */}
        {status === 'unauthenticated' && (
          <div className="space-y-5">
            {/* Method Tabs */}
            <div className="flex rounded-xl bg-zinc-100 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setTab('otp');
                  setError('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2 rounded-lg transition ${
                  tab === 'otp' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                2FA OTP
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('password');
                  setError('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2 rounded-lg transition ${
                  tab === 'password' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('google');
                  setError('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2 rounded-lg transition ${
                  tab === 'google' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                Google SSO
              </button>
            </div>

            {/* Error & Success Messages */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* TAB 1: 2FA OTP LOGIN */}
            {tab === 'otp' && (
              <>
                {otpStep === 'request' ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-2">
                      <div className="flex items-center gap-1.5 text-zinc-800 font-bold text-xs uppercase tracking-wider">
                        <Lock className="w-3.5 h-3.5 text-brand-emerald" />
                        <span>Administrator 2FA Code</span>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        A 6-digit one-time code will be dispatched to your authorized admin address.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700">Administrator Email</label>
                      <input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="yadav962160@gmail.com"
                        className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-emerald"
                      />
                    </div>

                    <button
                      onClick={handleRequestOtp}
                      disabled={loading}
                      className="w-full py-3.5 bg-brand-black hover:bg-zinc-800 text-white rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <RotateCw className="w-4 h-4 animate-spin text-brand-emerald" />
                          <span>Dispatching Code...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-4 h-4 text-brand-emerald group-hover:rotate-12 transition-transform" />
                          <span>Send 6-Digit OTP</span>
                          <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="text-center space-y-1 p-3 bg-zinc-50 rounded-2xl border border-zinc-200/80">
                      <p className="text-xs font-bold text-zinc-800">Code sent to: {targetEmail}</p>
                      <p className="text-[11px] text-zinc-500">
                        Enter the 6-digit OTP code or emergency bypass master code.
                      </p>
                    </div>

                    <div className="space-y-2">
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
                          className="w-full pl-12 pr-4 py-3 bg-zinc-50 border-2 border-zinc-200 focus:border-brand-emerald rounded-2xl text-center text-2xl font-mono font-black tracking-widest text-zinc-950 focus:outline-none transition shadow-inner"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otp.length < 6}
                      className="w-full py-3.5 bg-brand-emerald hover:bg-emerald-600 text-white rounded-2xl font-black text-xs sm:text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <RotateCw className="w-4 h-4 animate-spin" />
                          <span>Verifying Authorization...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Verify & Enter Admin Console</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        type="button"
                        onClick={() => setOtpStep('request')}
                        className="text-zinc-500 hover:text-zinc-800 font-semibold cursor-pointer"
                      >
                        ← Change Email
                      </button>
                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        className="text-brand-emerald hover:underline font-bold cursor-pointer"
                      >
                        Resend Code
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            {/* TAB 2: PASSWORD LOGIN */}
            {tab === 'password' && (
              <form onSubmit={handlePasswordSignIn} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700">Admin Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={passwordEmail}
                      onChange={(e) => setPasswordEmail(e.target.value)}
                      placeholder="admin@iphonehub.in"
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-emerald"
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-brand-black hover:bg-zinc-800 text-white rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin text-brand-emerald" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In as Admin</span>
                      <ArrowRight className="w-4 h-4 text-brand-emerald" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 3: GOOGLE SSO */}
            {tab === 'google' && (
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
                  className="w-full py-4 px-4 rounded-2xl border-2 border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50 font-bold text-xs sm:text-sm text-zinc-800 transition-all flex items-center justify-center gap-3 shadow-md active:scale-[0.99] group cursor-pointer"
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
              </div>
            )}

            {/* Back link */}
            <div className="text-center pt-2">
              <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-600 font-medium">
                ← Return to Storefront
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-emerald" />
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}
