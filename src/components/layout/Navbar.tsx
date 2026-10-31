'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Package,
  RotateCcw,
  LogOut,
  ShieldCheck,
  Headphones,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isAdmin = (session?.user as unknown as { role?: string })?.role === 'admin';

  const navLinks = [
    { label: 'Buy iPhones', href: '/products' },
    { label: 'Sell / Trade-in', href: '/sell', badge: 'Best Value' },
    { label: 'Why Us', href: '/#why-us' },
    { label: 'Support', href: '/#support' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
      setSearchModalOpen(false);
    }
  };

  const isHomePage = pathname === '/';

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ${
          isHomePage
            ? 'bg-[#0B0B0C] border-b border-zinc-900/80 text-white md:bg-white/95 md:border-b md:border-zinc-200/80 md:text-brand-black md:backdrop-blur-md'
            : 'bg-white/95 backdrop-blur-md border-b border-zinc-200/80 text-brand-black'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${
                isHomePage
                  ? 'bg-zinc-900 border border-zinc-800 text-white md:bg-brand-black md:border-transparent'
                  : 'bg-brand-black text-white'
              }`}
            >
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-brand-emerald" />
            </div>
            <div className="flex flex-col">
              <span
                className={`font-extrabold text-xl tracking-tight flex items-center ${
                  isHomePage ? 'text-white md:text-brand-black' : 'text-brand-black'
                }`}
              >
                iPhone<span className={isHomePage ? 'text-white md:text-brand-emerald' : 'text-brand-emerald'}>Hub</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-semibold -mt-1 hidden sm:block">
                Premium Resale
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && Boolean(pathname?.startsWith(link.href)));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${
                    isActive ? 'text-brand-black font-semibold' : 'text-zinc-600 hover:text-brand-black'
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="bg-emerald-50 text-brand-emeraldDark border border-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute -bottom-6 left-0 right-0 h-0.5 bg-brand-black rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Search Trigger */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className={`p-2 sm:px-3 sm:py-2 rounded-full sm:rounded-xl text-sm font-normal flex items-center gap-2 transition-colors border border-transparent ${
                isHomePage
                  ? 'text-zinc-200 hover:text-white hover:bg-zinc-800/80 md:text-zinc-700 md:hover:text-brand-black md:hover:bg-zinc-100 md:border-zinc-200'
                  : 'text-zinc-700 hover:text-brand-black hover:bg-zinc-100 sm:border-zinc-200'
              }`}
              title="Search iPhones"
            >
              <Search className={`w-5 h-5 sm:w-4 sm:h-4 ${isHomePage ? 'text-zinc-200 md:text-zinc-500' : 'text-zinc-500'}`} />
              <span className="hidden lg:inline text-xs text-zinc-400">Search model...</span>
            </button>

            {/* Wishlist Icon (Desktop only, mobile has bottom bar) */}
            <Link
              href="/account?tab=wishlist"
              className="hidden md:flex relative p-2 text-zinc-700 hover:text-brand-black hover:bg-zinc-100 rounded-full transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className={`relative p-2 rounded-full transition-colors ${
                isHomePage
                  ? 'text-zinc-200 hover:text-white hover:bg-zinc-800/80 md:text-zinc-700 md:hover:text-brand-black md:hover:bg-zinc-100'
                  : 'text-zinc-700 hover:text-brand-black hover:bg-zinc-100'
              }`}
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 ? (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              ) : (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </Link>

            {/* Account Dropdown (Desktop) */}
            <div className="relative hidden md:block">
              {session ? (
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2 sm:pr-3 rounded-full hover:bg-zinc-100 border border-zinc-200 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-emerald text-white text-xs font-bold flex items-center justify-center overflow-hidden">
                    {session.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline text-xs font-medium text-zinc-800 max-w-[100px] truncate">
                    {session.user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>
              ) : (
                <Link
                  href="/auth/signin"
                  className="hidden sm:flex items-center gap-1.5 text-xs font-medium bg-brand-black text-white px-3.5 py-2 rounded-xl hover:bg-zinc-800 transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  Sign In
                </Link>
              )}

              {/* Dropdown Menu */}
              <AnimatePresence>
                {accountDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-premium border border-zinc-200 py-2 z-50 text-sm"
                    onMouseLeave={() => setAccountDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-zinc-100">
                      <p className="font-semibold text-zinc-900 truncate">{session?.user?.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{session?.user?.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                          Admin Access
                        </span>
                      )}
                    </div>

                    <Link
                      href="/account"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-brand-black transition-colors"
                    >
                      <Package className="w-4 h-4 text-zinc-400" />
                      My Orders & Track
                    </Link>

                    <Link
                      href="/account?tab=tradeins"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-brand-black transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 text-zinc-400" />
                      Trade-in Requests
                    </Link>

                    <Link
                      href="/account?tab=profile"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-brand-black transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-zinc-400" />
                      My Profile
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-purple-700 bg-purple-50/60 hover:bg-purple-100 transition-colors font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4 text-purple-600" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-zinc-100 my-1"></div>

                    <button
                      onClick={() => {
                        setAccountDropdownOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Hamburger Button (Hidden on Home screen matching native mockup) */}
            {!isHomePage && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-b border-zinc-200 px-6 py-4 space-y-4 shadow-xl z-30"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-base font-medium text-zinc-800 hover:text-brand-emerald flex items-center justify-between border-b border-zinc-100"
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="bg-emerald-100 text-brand-emeraldDark text-xs px-2 py-0.5 rounded-full font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}

              {session ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-base font-medium text-zinc-800 flex items-center gap-2 border-b border-zinc-100"
                  >
                    <Package className="w-5 h-5 text-zinc-400" />
                    My Orders
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2.5 text-base font-semibold text-purple-700 flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-5 h-5 text-purple-600" />
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="w-full text-left py-2.5 text-base font-medium text-rose-600 flex items-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-3 w-full py-3 bg-brand-black text-white text-center rounded-xl font-medium block"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Search Modal */}
      <AnimatePresence>
        {searchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-zinc-200"
            >
              <form onSubmit={handleSearchSubmit} className="p-4 border-b border-zinc-200 flex items-center gap-3">
                <Search className="w-6 h-6 text-zinc-400 ml-2" />
                <input
                  type="text"
                  placeholder="Search by model, e.g. iPhone 15, Pro Max, 256GB..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full py-2 text-lg text-zinc-900 placeholder-zinc-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchModalOpen(false)}
                  className="p-2 text-zinc-400 hover:text-zinc-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>

              <div className="p-6 bg-zinc-50">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {['iPhone 16 Pro', 'iPhone 15', 'iPhone 15 Pro Max', 'iPhone 14', 'iPhone 13 128GB', 'Condition: Flawless'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        window.location.href = `/products?search=${encodeURIComponent(term)}`;
                      }}
                      className="px-3 py-1.5 bg-white border border-zinc-200 rounded-full text-xs font-medium text-zinc-700 hover:border-brand-emerald hover:text-brand-emerald transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

