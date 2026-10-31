import type { Metadata } from 'next';
import Script from 'next/script';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../components/providers/AuthProvider';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import AnnouncementBar from '../components/layout/AnnouncementBar';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import BottomNav from '../components/layout/BottomNav';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'iPhoneHub | Premium Certified iPhones & Instant Resale Marketplace',
  description:
    'Buy certified pre-owned iPhones, sell old iPhones for instant cash, and exchange devices with best trade-in bonus. Pan-India free delivery and 6 months warranty.',
  keywords: [
    'buy used iphone',
    'sell iphone online',
    'refurbished iphone india',
    'cashify alternative iphone',
    'iphone 15 price',
    'iphone 16 pro resale',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${montserrat.className} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${montserrat.className} min-h-screen flex flex-col bg-white text-brand-black antialiased`}>
        {/* Official Razorpay Checkout Script */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <AnnouncementBar />
              <Navbar />
              <main className="flex-grow pb-16 md:pb-0">{children}</main>
              <Footer />
              <BottomNav />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
