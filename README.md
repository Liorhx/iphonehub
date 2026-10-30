# iPhoneHub — Premium Certified iPhones & Resale Marketplace

iPhoneHub is a production-oriented, modern iPhone e-commerce and resale marketplace inspired by Cashify, designed with a sleek Apple-inspired aesthetic, fluid animations, and high conversion UX.

---

## 🌟 Key Features

### 🛍️ Customer Experience
- **Buy Certified Pre-Owned iPhones**:
  - Browse iPhone 16, 15, 14, 13, and 12 generations.
  - Multi-attribute filters: Model series, Storage (64GB to 1TB), Condition (Flawless, Excellent, Good, Fair), Price range, and Battery health.
  - Sort by price, newest, and customer ratings.
  - Interactive product detail page with high-res galleries, 48-point diagnostic reports, warranty selector, and PIN code delivery estimator.
- **Cashify-Style Sell & Trade-in Flow**:
  - 4-step progressive valuation wizard.
  - Real-time instant quote pricing engine evaluating screen condition, frame scratches, battery health percentage, Face ID, camera, box & valid bill.
  - Doorstep free pickup scheduling with date and time slots.
  - Instant UPI / Bank account payout options.
- **Cart & High-Conversion Checkout**:
  - Real-time stock reservation and server-side price validation.
  - Promo code discounts (`WELCOME500`, `IPHONE1000`, `UPGRADE2000`).
  - Razorpay payment gateway integration (UPI, Credit/Debit cards, No-Cost EMI, Cash on Delivery).
  - Confetti celebration upon confirmed purchase.
- **Customer Account & Real-time Tracking**:
  - Live 6-step order tracker: `Order Placed` ➔ `Payment Confirmed` ➔ `Processing` ➔ `Shipped` ➔ `Out for Delivery` ➔ `Delivered`.
  - Trade-in tracking dashboard.
  - Saved wishlist and address management.

### 🛡️ Admin Dashboard (`/admin`)
- Real-time GMV and revenue metrics (Total Sales, Total Orders, Total Customers).
- Interactive SVG sales trend chart.
- Product Catalog Manager: Add new iPhones, edit pricing, toggle condition, update battery health, upload images, and control stock.
- Order Manager: Instant status transitions (Processing, Shipped, Delivered, Cancelled) and payment audit.
- Trade-in Inspection Manager: Approve seller quotes, adjust door-step inspection valuations, and mark payouts transferred.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Apple-inspired Design System (`#0B0B0C`, `#10B981`, `#047857`, `#F5F6F7`)
- **Animations**: Framer Motion (Natural spring transitions, hover zooms, mobile slide drawer)
- **Icons**: Lucide React
- **Database & ODM**: MongoDB Atlas + Mongoose (with in-memory fallback store for instant local exploration)
- **Authentication**: Auth.js / NextAuth.js (Google OAuth + Credentials with 1-click Demo Customer & Admin logins)
- **Payments**: Razorpay SDK (UPI, Cards, EMI, COD) + server-side signature verification

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
cd iphonehub
npm install
```

### 2. Configure Environment Variables
Copy the example file:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/iphonehub?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3005
NEXTAUTH_SECRET=your_32_character_secret_key_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YourKeyId
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3005](http://localhost:3005) in your browser.

---

## 🔐 Credentials & Demo Logins

- **Demo Customer Login**:
  - Email: `rahul.demo@iphonehub.in`
  - Or click **👤 Demo Customer** on `/auth/signin`
- **Admin Control Panel Login**:
  - Email: `admin@iphonehub.in`
  - Or click **⚡ Admin Panel** on `/auth/signin`
  - Direct URL: `/admin`

---

## 📂 Project Architecture

```
iphonehub/
├── src/
│   ├── app/
│   │   ├── page.tsx               # Homepage matching mockup
│   │   ├── products/              # Buy iPhones listing & filters
│   │   │   └── [slug]/            # iPhone details & gallery
│   │   ├── sell/                  # 4-step device trade-in & quote engine
│   │   ├── cart/                  # Cart with coupon engine
│   │   ├── checkout/              # Shipping & Razorpay checkout
│   │   ├── account/               # Customer orders & trade-in tracking
│   │   ├── orders/[id]/           # Real-time order step tracker
│   │   ├── admin/                 # Admin metrics, orders & inventory
│   │   ├── auth/signin/           # Google & email sign-in
│   │   └── api/                   # REST endpoints & NextAuth
│   ├── components/
│   │   ├── layout/                # Navbar, Footer, AnnouncementBar
│   │   ├── products/              # ProductCard, FilterSidebar
│   │   └── providers/             # AuthProvider
│   ├── context/                   # CartContext, WishlistContext
│   ├── data/                      # Initial verified iPhone catalog
│   ├── lib/                       # MongoDB, Auth, Razorpay, Pricing engine
│   ├── models/                    # Mongoose schemas (User, Product, Order, TradeIn)
│   ├── services/                  # Business logic services
│   └── types/                     # Shared TypeScript interfaces
├── .env.example
├── tailwind.config.js
└── package.json
```

