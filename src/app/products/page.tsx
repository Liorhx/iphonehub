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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Title & Sort Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            {filters.family ? `${filters.family} Series` : 'Buy Certified iPhones'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Showing {filteredProducts.length} verified devices with warranty and free shipping
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-1.5 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-xl text-xs font-semibold text-zinc-800 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters {filters.family || filters.storage || filters.condition ? '(Active)' : ''}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-500 font-medium hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-transparent font-semibold text-zinc-900 focus:outline-none cursor-pointer"
            >
              <option value="newest">Featured & Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
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
          <div className="lg:hidden col-span-1 mb-6">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        )}

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
