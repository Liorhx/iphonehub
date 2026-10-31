'use client';

import React from 'react';
import Link from 'next/link';
import { Smartphone, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-white">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-zinc-100 flex items-center justify-center mx-auto text-zinc-900 border border-zinc-200">
          <Smartphone className="w-8 h-8 text-brand-emerald" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-emerald">
            404 • Device Not Found
          </span>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tight">
            Page Does Not Exist
          </h1>
          <p className="text-xs text-zinc-500 leading-relaxed">
            The page or iPhone listing you are looking for might have been sold, moved, or deleted.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="px-5 py-3 rounded-2xl bg-brand-black text-white text-xs font-bold hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-md"
          >
            <Home className="w-4 h-4 text-brand-emerald" />
            Back to Home
          </Link>
          <Link
            href="/products"
            className="px-5 py-3 rounded-2xl bg-zinc-100 text-zinc-800 text-xs font-bold hover:bg-zinc-200 transition-all flex items-center gap-2"
          >
            Explore iPhones
          </Link>
        </div>
      </div>
    </div>
  );
}

