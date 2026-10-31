import React from 'react';
import Link from 'next/link';
import { Smartphone, Mail, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white border-t border-zinc-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-brand-emerald" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                iPhone<span className="text-brand-emerald">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              Better Prices. Better Devices. Always. India&apos;s most trusted destination to buy certified pre-owned iPhones and sell your used iPhone for instant cash.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-zinc-400">
              <span className="flex items-center gap-1 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
                <ShieldCheck className="w-4 h-4 text-brand-emerald" /> 48-Point Certified
              </span>
              <span className="bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
                6 Months Warranty
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Quick Links</h4>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li>
                <Link href="/products" className="hover:text-brand-emerald transition-colors">
                  Buy iPhones
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-brand-emerald transition-colors">
                  Sell / Trade-in
                </Link>
              </li>
              <li>
                <Link href="/products?condition=Flawless" className="hover:text-brand-emerald transition-colors">
                  Flawless Condition
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-brand-emerald transition-colors">
                  Order Tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Help & Support</h4>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li>
                <Link href="/#faq" className="hover:text-brand-emerald transition-colors">
                  FAQs & Guides
                </Link>
              </li>
              <li>
                <Link href="/#support" className="hover:text-brand-emerald transition-colors">
                  Warranty & Returns
                </Link>
              </li>
              <li>
                <Link href="/#support" className="hover:text-brand-emerald transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/#support" className="hover:text-brand-emerald transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Get In Touch */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Get In Touch</h4>
            <ul className="space-y-2.5 text-sm text-zinc-300">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-emerald shrink-0" />
                <a href="tel:+919044914653" className="hover:text-brand-emerald transition-colors">
                  +91 90449 14653
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-emerald shrink-0" />
                <a href="mailto:support@iphonehub.in" className="hover:text-brand-emerald transition-colors">
                  support@iphonehub.in
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-zinc-400">
                <MapPin className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                <span>Lucknow</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-4">
            <p>© {new Date().getFullYear()} iPhoneHub. All rights reserved.</p>
            <Link href="/admin/login" className="text-zinc-600 hover:text-zinc-400 transition-colors">
              Admin Portal
            </Link>
          </div>
          <div className="flex items-center gap-1 text-zinc-400">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for Apple enthusiasts in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

