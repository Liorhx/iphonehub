'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-white">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 flex items-center justify-center mx-auto text-rose-600 border border-rose-200">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-600">
            500 • Operational Notice
          </span>
          <h1 className="text-2xl font-black text-zinc-950 tracking-tight">
            Something went wrong
          </h1>
          <p className="text-xs text-zinc-500 leading-relaxed">
            An unexpected error occurred. You can retry the operation or return to the storefront.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="px-5 py-3 rounded-2xl bg-brand-black text-white text-xs font-bold hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-md"
          >
            <RotateCcw className="w-4 h-4 text-brand-emerald" />
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-3 rounded-2xl bg-zinc-100 text-zinc-800 text-xs font-bold hover:bg-zinc-200 transition-all flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

