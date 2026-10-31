import React from 'react';

export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 animate-pulse">
      {/* Header & Search */}
      <div className="space-y-3">
        <div className="h-8 w-48 bg-zinc-200 rounded-xl" />
        <div className="h-4 w-72 bg-zinc-100 rounded-md" />
        <div className="h-11 w-full max-w-md bg-zinc-100 rounded-2xl border border-zinc-200" />
      </div>

      {/* Filter Chips Placeholder */}
      <div className="flex items-center gap-2 overflow-hidden py-1">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-8 w-24 bg-zinc-100 rounded-full shrink-0 border border-zinc-200" />
        ))}
      </div>

      {/* Grid of Product Skeletons */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 pt-2">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/80 p-3 sm:p-5 space-y-4 shadow-subtle"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 w-16 bg-zinc-200 rounded-full" />
              <div className="w-7 h-7 bg-zinc-100 rounded-full" />
            </div>
            <div className="w-full h-36 sm:h-48 bg-zinc-100 rounded-2xl flex items-center justify-center">
              <div className="w-20 h-28 bg-zinc-200/60 rounded-xl" />
            </div>
            <div className="space-y-2 pt-2 border-t border-zinc-100">
              <div className="h-4 w-3/4 bg-zinc-200 rounded-md" />
              <div className="h-3 w-1/2 bg-zinc-100 rounded-md" />
              <div className="h-6 w-24 bg-zinc-200 rounded-md pt-1" />
              <div className="h-9 w-full bg-emerald-100/60 rounded-xl mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

