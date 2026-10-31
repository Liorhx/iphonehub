'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  // Store currently open index, null if all closed. By default, first is open or all closed like Cashify.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;

        return (
          <div
            key={idx}
            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
              isOpen
                ? 'border-brand-emerald bg-white shadow-subtle ring-2 ring-brand-emerald/15'
                : 'border-zinc-200/80 bg-white hover:border-zinc-300 shadow-xs'
            }`}
          >
            {/* Question Header Button */}
            <button
              type="button"
              onClick={() => toggleFaq(idx)}
              className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left transition-colors"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isOpen
                      ? 'bg-emerald-100 text-brand-emerald font-bold'
                      : 'bg-zinc-100 text-zinc-500'
                  }`}
                >
                  <span className="text-xs font-black">Q{idx + 1}</span>
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-zinc-950 tracking-tight leading-snug">
                  {faq.q}
                </h3>
              </div>

              {/* Cashify-styled Rotating Chevron */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isOpen
                    ? 'bg-emerald-50 text-brand-emerald rotate-180'
                    : 'bg-zinc-100 text-zinc-400 group-hover:text-zinc-700'
                }`}
              >
                <ChevronDown className="w-4 h-4 stroke-[2.5]" />
              </div>
            </button>

            {/* Collapsible Answer (Cashify Smooth Dropdown Style) */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
              }`}
            >
              <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-zinc-100 text-xs sm:text-sm text-zinc-600 leading-relaxed space-y-2">
                <p className="pl-10 text-zinc-600 font-medium">
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
