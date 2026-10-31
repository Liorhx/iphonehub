'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Package,
  Heart,
  MapPin,
  MessageSquare,
  Settings,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  ArrowLeft,
  Trash2,
  ExternalLink,
  Phone,
  Mail,
  Check,
  Plus,
  ShoppingBag,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function AccountPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Active modal/panel view: null (main menu) | 'wishlist' | 'addresses' | 'support' | 'settings'
  const [activeModal, setActiveModal] = useState<'wishlist' | 'addresses' | 'support' | 'settings' | null>(null);

  // Saved Addresses State
  const [addresses, setAddresses] = useState([
    {
      id: 'addr_1',
      title: 'Home Address',
      street: 'House 42, Gomti Nagar, Near Riverside Mall',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      pinCode: '226010',
      isDefault: true,
    },
  ]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPinCode, setNewPinCode] = useState('');

  const isAdmin = (session?.user as unknown as { role?: string })?.role === 'admin';

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newPinCode) return;
    setAddresses([
      ...addresses,
      {
        id: `addr_${Date.now()}`,
        title: 'New Address',
        street: newStreet,
        city: newCity,
        state: 'Uttar Pradesh',
        pinCode: newPinCode,
        isDefault: false,
      },
    ]);
    setNewStreet('');
    setNewCity('');
    setNewPinCode('');
    setShowAddAddress(false);
  };

  const userName = session?.user?.name || 'Rahul Yadav';
  const userEmail = session?.user?.email || 'rahul@gmail.com';
  const userImage = session?.user?.image;

  return (
    <div className="max-w-xl mx-auto px-4 py-6 sm:py-10 space-y-5 pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
          My Account
        </h1>
        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-bold hover:bg-purple-100 transition"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Admin
          </Link>
        )}
      </div>

      {/* User Profile Card (Matching User Mockup) */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full bg-[#8EA1B4] flex items-center justify-center shrink-0 overflow-hidden shadow-xs border border-zinc-100">
          {userImage ? (
            <Image src={userImage} alt={userName} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-xl font-black">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base sm:text-lg font-extrabold text-zinc-950 truncate tracking-tight">
            {userName}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 font-medium truncate mt-0.5">
            {userEmail}
          </p>
        </div>
      </div>

      {/* Menu Action Cards Stack (Matching User Mockup Pixel-by-Pixel) */}
      <div className="space-y-2.5">
        
        {/* 1. My Orders */}
        <Link
          href="/orders"
          className="bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/80 p-4 sm:p-5 flex items-center justify-between shadow-xs hover:border-zinc-300 hover:shadow-subtle transition-all active:scale-[0.99] group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-6 h-6 flex items-center justify-center text-zinc-900">
              <Package className="w-5 h-5 stroke-[1.9]" />
            </div>
            <span className="font-bold text-sm sm:text-base text-zinc-950">
              My Orders
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 group-hover:translate-x-0.5 transition-all" />
        </Link>

        {/* 2. Wishlist */}
        <button
          type="button"
          onClick={() => setActiveModal('wishlist')}
          className="w-full bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/80 p-4 sm:p-5 flex items-center justify-between shadow-xs hover:border-zinc-300 hover:shadow-subtle transition-all active:scale-[0.99] group text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-6 h-6 flex items-center justify-center text-zinc-900">
              <Heart className="w-5 h-5 stroke-[1.9]" />
            </div>
            <span className="font-bold text-sm sm:text-base text-zinc-950">
              Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* 3. Saved Addresses */}
        <button
          type="button"
          onClick={() => setActiveModal('addresses')}
          className="w-full bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/80 p-4 sm:p-5 flex items-center justify-between shadow-xs hover:border-zinc-300 hover:shadow-subtle transition-all active:scale-[0.99] group text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-6 h-6 flex items-center justify-center text-zinc-900">
              <MapPin className="w-5 h-5 stroke-[1.9]" />
            </div>
            <span className="font-bold text-sm sm:text-base text-zinc-950">
              Saved Addresses
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* 4. Support Tickets */}
        <button
          type="button"
          onClick={() => setActiveModal('support')}
          className="w-full bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/80 p-4 sm:p-5 flex items-center justify-between shadow-xs hover:border-zinc-300 hover:shadow-subtle transition-all active:scale-[0.99] group text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-6 h-6 flex items-center justify-center text-zinc-900">
              <MessageSquare className="w-5 h-5 stroke-[1.9]" />
            </div>
            <span className="font-bold text-sm sm:text-base text-zinc-950">
              Support Tickets
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* 5. Settings */}
        <button
          type="button"
          onClick={() => setActiveModal('settings')}
          className="w-full bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/80 p-4 sm:p-5 flex items-center justify-between shadow-xs hover:border-zinc-300 hover:shadow-subtle transition-all active:scale-[0.99] group text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-6 h-6 flex items-center justify-center text-zinc-900">
              <Settings className="w-5 h-5 stroke-[1.9]" />
            </div>
            <span className="font-bold text-sm sm:text-base text-zinc-950">
              Settings
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 group-hover:translate-x-0.5 transition-all" />
        </button>

      </div>

      {/* Log Out CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors active:scale-95"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>

      {/* =========================================================================
          MODAL 1: WISHLIST DRAWER
          ========================================================================= */}
      {activeModal === 'wishlist' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h3 className="font-extrabold text-lg text-zinc-950">Saved Wishlist</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {wishlist.length > 0 ? (
              <div className="space-y-3">
                {wishlist.map((item) => (
                  <div
                    key={item._id}
                    className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center gap-3"
                  >
                    <div className="relative w-14 h-18 bg-white rounded-xl p-1 shrink-0 border border-zinc-100">
                      <Image
                        src={item.thumbnail || item.images[0]}
                        alt={item.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-zinc-900 truncate">{item.title}</h4>
                      <p className="text-xs text-zinc-500">{item.storage} • {item.condition}</p>
                      <p className="font-extrabold text-sm text-zinc-950 pt-0.5">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => {
                          addToCart(item);
                          toggleWishlist(item);
                        }}
                        className="p-2 bg-brand-emerald text-white rounded-xl hover:bg-emerald-600 transition"
                        title="Move to Cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleWishlist(item)}
                        className="p-2 bg-zinc-100 text-zinc-400 hover:text-rose-500 rounded-xl transition"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-zinc-400 space-y-2">
                <Heart className="w-10 h-10 mx-auto text-zinc-300 stroke-[1.5]" />
                <p className="text-xs font-semibold">Your wishlist is empty</p>
                <Link
                  href="/products"
                  onClick={() => setActiveModal(null)}
                  className="inline-block mt-2 text-xs font-bold text-brand-emerald hover:underline"
                >
                  Explore iPhones →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: SAVED ADDRESSES
          ========================================================================= */}
      {activeModal === 'addresses' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-emerald" />
                <h3 className="font-extrabold text-lg text-zinc-950">Saved Delivery Addresses</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-zinc-900">{addr.title}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-600">{addr.street}</p>
                  <p className="text-xs text-zinc-500">{addr.city}, {addr.state} - {addr.pinCode}</p>
                </div>
              ))}
            </div>

            {showAddAddress ? (
              <form onSubmit={handleAddAddress} className="space-y-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-600">Add New Address</h4>
                <input
                  type="text"
                  required
                  placeholder="Street / Flat / Colony address"
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-xl focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-xl focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="PIN Code"
                    value={newPinCode}
                    onChange={(e) => setNewPinCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(false)}
                    className="flex-1 py-2 text-xs font-bold border border-zinc-200 rounded-xl text-zinc-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-bold bg-brand-emerald text-white rounded-xl"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddAddress(true)}
                className="w-full py-3 border-2 border-dashed border-zinc-300 hover:border-zinc-400 rounded-2xl text-xs font-bold text-zinc-600 flex items-center justify-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" /> Add Delivery Address
              </button>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: SUPPORT TICKETS & 24/7 HELPDESK
          ========================================================================= */}
      {activeModal === 'support' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-3xl p-6 space-y-5 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-emerald" />
                <h3 className="font-extrabold text-lg text-zinc-950">Customer Support</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <a
                href="https://wa.me/919044914653?text=Hi%20iPhoneHub,%20I%20need%20assistance%20with%20my%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between hover:bg-emerald-100/70 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900">Instant WhatsApp Support</h4>
                    <p className="text-xs text-zinc-500">Live chat with certified Apple specialist</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-700" />
              </a>

              <a
                href="tel:+919044914653"
                className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between hover:bg-zinc-100 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900">Call Priority Care</h4>
                    <p className="text-xs text-zinc-500">+91 90449 14653 (10 AM - 8 PM)</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </a>

              <a
                href="mailto:support@iphonehub.in"
                className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between hover:bg-zinc-100 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900">Email Support</h4>
                    <p className="text-xs text-zinc-500">support@iphonehub.in</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: SETTINGS & PREFERENCES
          ========================================================================= */}
      {activeModal === 'settings' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-3xl p-6 space-y-5 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-zinc-900" />
                <h3 className="font-extrabold text-lg text-zinc-950">Account Settings</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Logged-in Profile</span>
                <p className="font-bold text-sm text-zinc-900">{userName}</p>
                <p className="text-xs text-zinc-500">{userEmail}</p>
              </div>

              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-zinc-900">Authentication</h4>
                  <p className="text-[11px] text-zinc-500">Google Single Sign-On Verified</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of iPhoneHub</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
