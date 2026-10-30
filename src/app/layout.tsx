import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../components/providers/AuthProvider';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import AnnouncementBar from '../components/layout/AnnouncementBar';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

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
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* Razorpay checkout script */}
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-brand-black antialiased">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <AnnouncementBar />
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

