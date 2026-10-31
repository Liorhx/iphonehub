import React from 'react';
import { Smartphone } from 'lucide-react';

export default function GlobalLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white shadow-xl animate-pulse">
          <Smartphone className="w-7 h-7 text-brand-emerald" />
        </div>
        <div className="absolute -inset-1 rounded-2xl border-2 border-brand-emerald/40 animate-ping pointer-events-none" />
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-brand-emerald animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 rounded-full bg-brand-emerald animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 rounded-full bg-brand-emerald animate-bounce" />
      </div>
    </div>
  );
}

