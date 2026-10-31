'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, ArrowUpDown, Smartphone } from 'lucide-react';
import ProductCard from '../../components/products/ProductCard';
import FilterSidebar from '../../components/products/FilterSidebar';
import { Product } from '../../types';
import { INITIAL_PRODUCTS } from '../../data/mockProducts';

function ProductsContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    family: searchParams?.get('family') || '',
    storage: searchParams?.get('storage') || '',
    condition: searchParams?.get('condition') || '',
    priceRange: searchParams?.get('priceRange') || '',
    search: searchParams?.get('search') || '',
  });

  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating' | 'newest'>('newest');

  // Fetch live products from database catalog
  useEffect(() => {
    async function fetchLiveProducts() {
      try {
        const res = await fetch('/api/products');
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setProducts(json.data);
        }
      } catch (err) {
        console.warn('Using catalogue cache:', err);
      }
    }
    fetchLiveProducts();
  }, []);

  // Handle URL params on initial load
  useEffect(() => {
    if (!searchParams) return;
    const familyParam = searchParams.get('family');
    const searchParam = searchParams.get('search');
    const conditionParam = searchParams.get('condition');
    if (familyParam || searchParam || conditionParam) {
      setFilters((prev) => ({
        ...prev,
        family: familyParam || prev.family,
        search: searchParam || prev.search,
        condition: conditionParam || prev.condition,
      }));
    }
  }, [searchParams]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      family: '',
      storage: '',
      condition: '',
      priceRange: '',
      search: '',
    });
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.model.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q) ||
          p.storage.toLowerCase().includes(q)
      );
    }

    if (filters.family) {
      result = result.filter((p) => p.modelFamily.toLowerCase() === filters.family.toLowerCase());
    }

    if (filters.storage) {
      result = result.filter((p) => p.storage === filters.storage);
    }

    if (filters.condition) {
      result = result.filter((p) => p.condition.toLowerCase() === filters.condition.toLowerCase());
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (min) result = result.filter((p) => p.price >= min);
      if (max) result = result.filter((p) => p.price <= max);
    }

    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, filters, sortBy]);

  const families = ['All', 'iPhone 16', 'iPhone 15', 'iPhone 14', 'iPhone 13', 'iPhone 12'];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-10 space-y-5">
      
      {/* Mobile-Friendly Search Header */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search iPhone models, storage, color..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-brand-emerald focus:bg-white transition"
          />
          <span className="absolute left-3.5 top-3.5 text-zinc-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          {filters.search && (
            <button
              onClick={() => handleFilterChange('search', '')}
              className="absolute right-3 top-3 text-xs bg-zinc-200 text-zinc-600 rounded-full w-5 h-5 flex items-center justify-center hover:bg-zinc-300"
            >
              ×
            </button>
          )}
        </div>

        {/* Filter Pills & Sort Row */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-xl text-xs font-bold text-zinc-800 transition"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {(filters.storage || filters.condition || filters.priceRange) && (
                <span className="w-2 h-2 rounded-full bg-brand-emerald" />
              )}
            </button>

            <div className="flex items-center gap-1 bg-zinc-100 rounded-xl px-2.5 py-1.5 text-xs font-bold text-zinc-800">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-transparent text-xs font-bold text-zinc-800 focus:outline-none cursor-pointer"
              >
                <option value="newest">Sort: Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          <span className="text-[11px] font-semibold text-zinc-500 shrink-0">
            {filteredProducts.length} devices
          </span>
        </div>

        {/* Horizontal Model Family Filter Chips (Screen 2 in Mockup) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {families.map((fam) => {
            const isSelected = (fam === 'All' && !filters.family) || filters.family === fam;
            return (
              <button
                key={fam}
                onClick={() => handleFilterChange('family', fam === 'All' ? '' : fam)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-zinc-950 text-white shadow-xs'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                }`}
              >
                {fam}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="lg:hidden col-span-1 mb-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-sm text-zinc-900">Refine Filters</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-xs font-bold text-brand-emerald"
              >
                Done
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        )}

        {/* Products Grid (2-Column Mobile Grid Matching Screen 2 Mockup!) */}
        <div className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-zinc-50 rounded-3xl border border-zinc-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-zinc-200 text-zinc-500 flex items-center justify-center mx-auto">
                <Smartphone className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">No iPhones match your filters</h3>
              <p className="text-sm text-zinc-500 max-w-sm mx-auto">
                Try clearing some filters or searching for another model generation.
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-brand-black text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-zinc-400">Loading catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
