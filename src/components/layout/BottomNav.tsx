'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Home,
  ShoppingBag,
  Repeat,
  Package,
  User,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

function BottomNavContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams?.get('tab');
  const { totalItems } = useCart();

  // Don't show bottom nav inside admin dashboard or admin login
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const isHomeActive = pathname === '/';
  const isBuyActive = pathname?.startsWith('/products');
  const isSellActive = pathname?.startsWith('/sell');
  const isOrdersActive = pathname === '/account' && activeTabParam === 'orders';
  const isAccountActive = pathname === '/account' && activeTabParam !== 'orders';

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
      isActive: isHomeActive,
    },
    {
      label: 'Buy',
      href: '/products',
      icon: ShoppingBag,
      isActive: isBuyActive,
    },
    {
      label: 'Sell',
      href: '/sell',
      icon: Repeat,
      isActive: isSellActive,
    },
    {
      label: 'Orders',
      href: '/account?tab=orders',
      icon: Package,
      isActive: isOrdersActive,
    },
    {
      label: 'Account',
      href: '/account',
      icon: User,
      isActive: isAccountActive,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-zinc-200/90 shadow-[0_-6px_25px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 ${
                active ? 'text-brand-emerald scale-105' : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${active ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.label === 'Buy' && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-brand-emerald text-white text-[9px] font-extrabold flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-1 ${active ? 'font-black text-brand-emerald' : 'font-medium'}`}>
                {item.label}
              </span>
              {active && (
                <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-brand-emerald" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function BottomNav() {
  return (
    <Suspense fallback={null}>
      <BottomNavContent />
    </Suspense>
  );
}
