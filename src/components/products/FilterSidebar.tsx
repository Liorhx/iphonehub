'use client';

import React from 'react';
import { RotateCcw, Search } from 'lucide-react';

interface FilterSidebarProps {
  filters: {
    family: string;
    storage: string;
    condition: string;
    priceRange: string;
    search: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  onClearFilters,
}: FilterSidebarProps) {
  const models = ['All Models', 'iPhone 16', 'iPhone 15', 'iPhone 14', 'iPhone 13', 'iPhone 12'];
  const storages = ['All', '64GB', '128GB', '256GB', '512GB', '1TB'];
  const conditions = ['All Conditions', 'Flawless', 'Excellent', 'Good', 'Fair'];
  const priceRanges = [
    { label: 'All Prices', value: '' },
    { label: '₹20,000 - ₹35,000', value: '20000-35000' },
    { label: '₹35,000 - ₹50,000', value: '35000-50000' },
    { label: '₹50,000 - ₹75,000', value: '50000-75000' },
    { label: '₹75,000 & Above', value: '75000-200000' },
  ];

  const hasActiveFilters =
    filters.family ||
    filters.storage ||
    filters.condition ||
    filters.priceRange ||
    filters.search;

  return (
    <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
        <h3 className="font-bold text-base text-zinc-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs font-semibold text-brand-emerald hover:text-brand-emeraldDark flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear All
          </button>
        )}
      </div>

      {/* Search Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Search
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search iPhones..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-brand-emerald focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Model Family Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Model Series
        </label>
        <div className="space-y-1">
          {models.map((mod) => {
            const val = mod === 'All Models' ? '' : mod;
            const isSelected = filters.family === val;
            return (
              <label
                key={mod}
                className="flex items-center gap-2.5 text-sm text-zinc-700 hover:text-brand-black cursor-pointer py-1"
              >
                <input
                  type="radio"
                  name="family"
                  checked={isSelected}
                  onChange={() => onFilterChange('family', val)}
                  className="accent-brand-black w-4 h-4"
                />
                <span className={isSelected ? 'font-semibold text-zinc-950' : ''}>
                  {mod}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Storage Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Storage
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {storages.map((st) => {
            const val = st === 'All' ? '' : st;
            const isSelected = filters.storage === val;
            return (
              <button
                key={st}
                type="button"
                onClick={() => onFilterChange('storage', val)}
                className={`py-1.5 px-2 text-xs rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-brand-black text-white border-brand-black font-semibold'
                    : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-300'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Condition Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Condition
        </label>
        <div className="space-y-1">
          {conditions.map((cond) => {
            const val = cond === 'All Conditions' ? '' : cond;
            const isSelected = filters.condition === val;
            return (
              <label
                key={cond}
                className="flex items-center gap-2.5 text-sm text-zinc-700 hover:text-brand-black cursor-pointer py-1"
              >
                <input
                  type="radio"
                  name="condition"
                  checked={isSelected}
                  onChange={() => onFilterChange('condition', val)}
                  className="accent-brand-black w-4 h-4"
                />
                <span className={isSelected ? 'font-semibold text-zinc-950' : ''}>
                  {cond}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Price Range
        </label>
        <div className="space-y-1">
          {priceRanges.map((pr) => {
            const isSelected = filters.priceRange === pr.value;
            return (
              <label
                key={pr.label}
                className="flex items-center gap-2.5 text-sm text-zinc-700 hover:text-brand-black cursor-pointer py-1"
              >
                <input
                  type="radio"
                  name="priceRange"
                  checked={isSelected}
                  onChange={() => onFilterChange('priceRange', pr.value)}
                  className="accent-brand-black w-4 h-4"
                />
                <span className={isSelected ? 'font-semibold text-zinc-950' : ''}>
                  {pr.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

    </div>
  );
}

