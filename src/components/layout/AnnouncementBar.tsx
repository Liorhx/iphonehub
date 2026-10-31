import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Zap } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="hidden md:block bg-brand-black text-white text-xs py-2 px-4 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-6 text-zinc-400">
          <span className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Truck className="w-3.5 h-3.5 text-brand-emerald" />
            Pan India Free Delivery
          </span>
          <span className="flex items-center gap-1.5 hover:text-white transition-colors">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald" />
            48-Point Certified Checks
          </span>
          <span className="flex items-center gap-1.5 hover:text-white transition-colors">
            <RefreshCw className="w-3.5 h-3.5 text-brand-emerald" />
            7-Day Easy Replacement
          </span>
        </div>
        <div className="w-full sm:w-auto text-center sm:text-right font-medium flex items-center justify-center gap-2">
          <span className="bg-brand-emerald/20 text-brand-emerald px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1">
            <Zap className="w-2.5 h-2.5" /> FESTIVE DROP
          </span>
          <span>Extra ₹2,500 exchange bonus on all iPhone trade-ins!</span>
        </div>
      </div>
    </div>
  );
}

