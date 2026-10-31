'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  User,
  Bell,
  Shield,
  Globe,
  Moon,
  FileText,
  HelpCircle,
  LogOut,
  X,
  Check,
  Phone,
  Mail,
  ShieldCheck,
  Lock,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

interface SettingsViewProps {
  onBack: () => void;
}

type SubModal =
  | 'account_security'
  | 'notifications'
  | 'privacy'
  | 'language'
  | 'terms_policies'
  | 'help_support'
  | null;

export default function SettingsView({ onBack }: SettingsViewProps) {
  const { data: session } = useSession();
  const userName = session?.user?.name || 'Rahul Yadav';
  const userEmail = session?.user?.email || 'rahul@gmail.com';

  // Dark Mode state with localStorage persistence
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const isDark =
      document.documentElement.classList.contains('dark') ||
      localStorage.getItem('iphonehub_theme') === 'dark';
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('iphonehub_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('iphonehub_theme', 'light');
    }
  };

  // Selected language state
  const [language, setLanguage] = useState('English');

  // Notification toggles
  const [notifyOrders, setNotifyOrders] = useState(true);
  const [notifyOffers, setNotifyOffers] = useState(true);
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);

  // Active sub-sheet / modal
  const [activeSubModal, setActiveSubModal] = useState<SubModal>(null);

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out of iPhoneHub?')) {
      signOut({ callbackUrl: '/' });
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 sm:py-8 space-y-5">
      {/* Top Header matching user mockup (< Settings) */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="p-1 -ml-1 rounded-full hover:bg-zinc-100 text-zinc-950 transition-colors active:scale-90"
          aria-label="Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.4]" />
        </button>
        <h1 className="text-2xl font-black text-zinc-950 tracking-tight">
          Settings
        </h1>
      </div>

      {/* Settings Options Stack (matching mockup layout) */}
      <div className="space-y-3">
        {/* 1. Account & Security */}
        <button
          type="button"
          onClick={() => setActiveSubModal('account_security')}
          className="w-full bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/90 p-4 sm:p-5 flex items-center justify-between shadow-xs hover:border-zinc-300 hover:shadow-subtle transition-all active:scale-[0.99] group text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 flex items-center justify-center text-zinc-900">
              <User className="w-5 h-5 stroke-[1.8]" />
            </div>
            <span className="font-bold text-sm sm:text-base text-zinc-950">
              Account & Security
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* 2. Notifications */}
        <button
          type="button"
          onClick={() => setActiveSubModal('notifications')}
          className="w-full bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/90 p-4 sm:p-5 flex items-center justify-between shadow-xs hover:border-zinc-300 hover:shadow-subtle transition-all active:scale-[0.99] group text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 flex items-center justify-center text-zinc-900">
              <Bell className="w-5 h-5 stroke-[1.8]" />
            </div>
            <span className="font-bold text-sm sm:text-base text-zinc-950">
              Notifications
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* 3. Privacy */}
        <button
          type="button"
          onClick={() => setActiveSubModal('privacy')}
          className="w-full bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/90 p-4 sm:p-5 flex items-center justify-between shadow-xs hover:border-zinc-300 hover:shadow-subtle transition-all active:scale-[0.99] group text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 flex items-center justify-center text-zinc-900">
              <Shield className="w-5 h-5 stroke-[1.8]" />
            </div>
            <span className="font-bold text-sm sm:text-base text-zinc-950">
              Privacy
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* 4. Language */}
        <button
          type="button"
          onClick={() => setActiveSubModal('language')}
          className="w-full bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/90 p-4 sm:p-5 flex items-center justify-between shadow-xs hover:border-zinc-300 hover:shadow-subtle transition-all active:scale-[0.99] group text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 flex items-center justify-center text-zinc-900">
              <Globe className="w-5 h-5 stroke-[1.8]" />
            </div>
            <span className="font-bold text-sm sm:text-base text-zinc-950">
              Language
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400 text-xs sm:text-sm font-medium">
              {language}
            </span>
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 group-hover:translate-x-0.5 transition-all" />
          </div>
        </button>

        {/* 5. Dark Mode (with iOS style toggle switch) */}
        <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/90 p-4 sm:p-5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 flex items-center justify-center text-zinc-900">
              <Moon className="w-5 h-5 stroke-[1.8]" />
            </div>
            <span className="font-bold text-sm sm:text-base text-zinc-950">
              Dark Mode
            </span>
          </div>
          {/* iOS-styled Switch matching mockup */}
          <button
            type="button"
            role="switch"
            aria-checked={darkMode}
            onClick={toggleDarkMode}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              darkMode ? 'bg-zinc-950' : 'bg-zinc-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                darkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 6. Terms & Policies */}
        <button
          type="button"
          onClick={() => setActiveSubModal('terms_policies')}
          className="w-full bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/90 p-4 sm:p-5 flex items-center justify-between shadow-xs hover:border-zinc-300 hover:shadow-subtle transition-all active:scale-[0.99] group text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 flex items-center justify-center text-zinc-900">
              <FileText className="w-5 h-5 stroke-[1.8]" />
            </div>
            <span className="font-bold text-sm sm:text-base text-zinc-950">
              Terms & Policies
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* 7. Help & Support */}
        <button
          type="button"
          onClick={() => setActiveSubModal('help_support')}
          className="w-full bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/90 p-4 sm:p-5 flex items-center justify-between shadow-xs hover:border-zinc-300 hover:shadow-subtle transition-all active:scale-[0.99] group text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 flex items-center justify-center text-zinc-900">
              <HelpCircle className="w-5 h-5 stroke-[1.8]" />
            </div>
            <span className="font-bold text-sm sm:text-base text-zinc-950">
              Help & Support
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* 8. Log Out (Red Tone matching mockup) */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/90 p-4 sm:p-5 flex items-center justify-between shadow-xs hover:border-rose-200 hover:bg-rose-50/30 transition-all active:scale-[0.99] group text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 flex items-center justify-center text-[#B24A4A]">
              <LogOut className="w-5 h-5 stroke-[1.9]" />
            </div>
            <span className="font-bold text-sm sm:text-base text-[#B24A4A]">
              Log Out
            </span>
          </div>
        </button>
      </div>

      {/* =========================================================================
          SUB-MODALS / SLIDE-OVERS FOR EACH SETTINGS OPTION
          ========================================================================= */}

      {/* SubModal 1: Account & Security */}
      {activeSubModal === 'account_security' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl animate-in fade-in-50">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-zinc-900" />
                <h3 className="font-extrabold text-lg text-zinc-950">Account & Security</h3>
              </div>
              <button
                onClick={() => setActiveSubModal(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Signed-In Identity
                </span>
                <p className="font-bold text-sm text-zinc-900">{userName}</p>
                <p className="text-xs text-zinc-500">{userEmail}</p>
              </div>

              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-xs text-zinc-900">Authentication Method</h4>
                  <p className="text-[11px] text-zinc-500">Google OAuth 2.0 Single Sign-On</p>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Verified
                </span>
              </div>

              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-xs text-zinc-900">Session Security</h4>
                  <p className="text-[11px] text-zinc-500">256-Bit SSL HTTPS Encrypted</p>
                </div>
                <Lock className="w-4 h-4 text-brand-emerald" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveSubModal(null)}
              className="w-full py-3 bg-zinc-950 text-white rounded-xl font-bold text-xs mt-2"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* SubModal 2: Notifications */}
      {activeSubModal === 'notifications' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl animate-in fade-in-50">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-zinc-900" />
                <h3 className="font-extrabold text-lg text-zinc-950">Notification Preferences</h3>
              </div>
              <button
                onClick={() => setActiveSubModal(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-zinc-900">Order & BlueDart Tracking</h4>
                  <p className="text-[11px] text-zinc-500">Instant updates on dispatch and delivery</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifyOrders(!notifyOrders)}
                  className={`w-10 h-6 rounded-full transition-colors relative ${
                    notifyOrders ? 'bg-brand-emerald' : 'bg-zinc-300'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow-xs transition-transform transform mt-1 ml-1 ${
                      notifyOrders ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-zinc-900">WhatsApp Dispatch Alerts</h4>
                  <p className="text-[11px] text-zinc-500">Receive digital invoices & courier updates</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifyWhatsapp(!notifyWhatsapp)}
                  className={`w-10 h-6 rounded-full transition-colors relative ${
                    notifyWhatsapp ? 'bg-brand-emerald' : 'bg-zinc-300'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow-xs transition-transform transform mt-1 ml-1 ${
                      notifyWhatsapp ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-zinc-900">Price Drops & Exchange Bonuses</h4>
                  <p className="text-[11px] text-zinc-500">Exclusive alerts on festive offers</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifyOffers(!notifyOffers)}
                  className={`w-10 h-6 rounded-full transition-colors relative ${
                    notifyOffers ? 'bg-brand-emerald' : 'bg-zinc-300'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow-xs transition-transform transform mt-1 ml-1 ${
                      notifyOffers ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveSubModal(null)}
              className="w-full py-3 bg-zinc-950 text-white rounded-xl font-bold text-xs mt-2"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* SubModal 3: Privacy */}
      {activeSubModal === 'privacy' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl animate-in fade-in-50">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-zinc-900" />
                <h3 className="font-extrabold text-lg text-zinc-950">Privacy & Data Guarantee</h3>
              </div>
              <button
                onClick={() => setActiveSubModal(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/60 space-y-1">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Certified Data Wipe</span>
                </div>
                <p className="text-emerald-700 leading-relaxed text-[11px]">
                  When trading in an old device, all storage is wiped using military-grade DoD standards. No personal data is ever retained or accessible.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-1">
                <h4 className="font-bold text-zinc-900">Payment Security</h4>
                <p className="text-zinc-500 leading-relaxed text-[11px]">
                  Payment credentials are processed directly by RBI-licensed Razorpay gateway via 256-bit encryption. iPhoneHub never stores card or UPI details.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-1">
                <h4 className="font-bold text-zinc-900">Delivery Protection</h4>
                <p className="text-zinc-500 leading-relaxed text-[11px]">
                  Your shipping address and phone number are exclusively utilized for BlueDart express transit and delivery verification.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveSubModal(null)}
              className="w-full py-3 bg-zinc-950 text-white rounded-xl font-bold text-xs mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* SubModal 4: Language Selector */}
      {activeSubModal === 'language' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl animate-in fade-in-50">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-zinc-900" />
                <h3 className="font-extrabold text-lg text-zinc-950">Select Language</h3>
              </div>
              <button
                onClick={() => setActiveSubModal(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {[
                { name: 'English', subtitle: 'English (India)' },
                { name: 'हिन्दी', subtitle: 'Hindi' },
                { name: 'मराठी', subtitle: 'Marathi' },
                { name: 'தமிழ்', subtitle: 'Tamil' },
                { name: 'తెలుగు', subtitle: 'Telugu' },
              ].map((lang) => {
                const isSelected = language === lang.name;
                return (
                  <button
                    key={lang.name}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.name);
                      setActiveSubModal(null);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition ${
                      isSelected
                        ? 'border-brand-emerald bg-emerald-50/40 text-brand-emerald'
                        : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-900'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs sm:text-sm">{lang.name}</p>
                      <p className="text-[11px] text-zinc-500">{lang.subtitle}</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-brand-emerald" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SubModal 5: Terms & Policies */}
      {activeSubModal === 'terms_policies' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl animate-in fade-in-50">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-zinc-900" />
                <h3 className="font-extrabold text-lg text-zinc-950">Terms & Policies</h3>
              </div>
              <button
                onClick={() => setActiveSubModal(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-1">
                <h4 className="font-bold text-zinc-900">1-Year Certified Warranty</h4>
                <p className="text-zinc-600 leading-relaxed text-[11px]">
                  All pre-owned iPhones come with 12 months comprehensive hardware protection covering display, camera, logic board, and battery health (&gt;85%).
                </p>
              </div>

              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-1">
                <h4 className="font-bold text-zinc-900">7-Day Replacement Policy</h4>
                <p className="text-zinc-600 leading-relaxed text-[11px]">
                  If you encounter any unexpected technical fault within 7 days of delivery, we provide an immediate doorstep pickup and device replacement.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-1">
                <h4 className="font-bold text-zinc-900">Trade-In Price Lock Guarantee</h4>
                <p className="text-zinc-600 leading-relaxed text-[11px]">
                  Instant quotes provided on our Trade-In calculator remain locked for 7 days with free doorstep doorstep inspection and instant bank transfer.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveSubModal(null)}
              className="w-full py-3 bg-zinc-950 text-white rounded-xl font-bold text-xs mt-2"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* SubModal 6: Help & Support */}
      {activeSubModal === 'help_support' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl animate-in fade-in-50">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-zinc-900" />
                <h3 className="font-extrabold text-lg text-zinc-950">24/7 Priority Helpdesk</h3>
              </div>
              <button
                onClick={() => setActiveSubModal(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <a
                href="tel:+919044914653"
                className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between hover:bg-zinc-100 transition block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900">Direct Customer Helpline</h4>
                    <p className="text-xs text-zinc-500">+91 90449 14653 (10 AM - 8 PM)</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </a>

              <a
                href="mailto:support@iphonehub.in"
                className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between hover:bg-zinc-100 transition block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900">Email Assistance</h4>
                    <p className="text-xs text-zinc-500">support@iphonehub.in</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </a>

              <a
                href="https://wa.me/919044914653?text=Hi%20iPhoneHub%20Support"
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between hover:bg-emerald-100 transition block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-emerald-950">WhatsApp Concierge</h4>
                    <p className="text-xs text-emerald-700">Chat with a certified iPhone specialist</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-emerald-600" />
              </a>
            </div>

            <button
              type="button"
              onClick={() => setActiveSubModal(null)}
              className="w-full py-3 bg-zinc-950 text-white rounded-xl font-bold text-xs mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

