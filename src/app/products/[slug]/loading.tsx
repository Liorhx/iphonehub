import React from 'react';

export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-3.5 w-12 bg-zinc-200 rounded-md" />
        <div className="h-3.5 w-3 bg-zinc-200 rounded-md" />
        <div className="h-3.5 w-16 bg-zinc-200 rounded-md" />
        <div className="h-3.5 w-3 bg-zinc-200 rounded-md" />
        <div className="h-3.5 w-32 bg-zinc-200 rounded-md" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Gallery Skeleton */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-zinc-100 border border-zinc-200/80 rounded-3xl h-[380px] sm:h-[500px] flex items-center justify-center p-6 relative overflow-hidden">
            <div className="w-48 h-72 sm:w-60 sm:h-96 rounded-3xl border-4 border-zinc-200/70 bg-zinc-200/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>

          {/* Thumbnails row */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-16 h-18 sm:w-20 sm:h-22 rounded-2xl bg-zinc-100 border border-zinc-200/80 shrink-0"
              />
            ))}
          </div>

          {/* Verification Audit Badges Skeleton */}
          <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4 sm:p-5 space-y-3 mt-6">
            <div className="h-4 w-40 bg-zinc-200 rounded-md" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-zinc-100 rounded-xl" />
              ))}
            </div>
          </div>
        </div>

        {/* Right Info Skeleton */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-20 bg-emerald-100 rounded-full" />
              <div className="h-5 w-24 bg-zinc-200 rounded-full" />
            </div>
            <div className="h-8 w-4/5 bg-zinc-200 rounded-xl" />
            <div className="h-4 w-1/2 bg-zinc-100 rounded-md" />
          </div>

          {/* Price Box */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
            <div className="h-8 w-36 bg-zinc-200 rounded-lg" />
            <div className="h-4 w-28 bg-zinc-100 rounded-md" />
          </div>

          {/* Storage Selectors */}
          <div className="space-y-2">
            <div className="h-3.5 w-28 bg-zinc-200 rounded-md" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-zinc-100 rounded-xl border border-zinc-200" />
              ))}
            </div>
          </div>

          {/* Condition Selectors */}
          <div className="space-y-2">
            <div className="h-3.5 w-28 bg-zinc-200 rounded-md" />
            <div className="grid grid-cols-3 gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-14 bg-zinc-100 rounded-xl border border-zinc-200" />
              ))}
            </div>
          </div>

          {/* Warranty card */}
          <div className="h-16 bg-zinc-100 rounded-2xl border border-zinc-200" />

          {/* Action buttons */}
          <div className="space-y-2.5 pt-2">
            <div className="h-12 w-full bg-zinc-200 rounded-2xl" />
            <div className="h-14 w-full bg-brand-emerald/30 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

