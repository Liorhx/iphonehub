# 🚀 iPhoneHub Deployment Guide: Vercel (Frontend) + Render (Backend)

This guide walks you step-by-step through deploying **iPhoneHub** with:
- **Frontend on Vercel** (Global Edge CDN, instant previews, fast page loads)
- **Backend on Render** (Dedicated Node.js web service for APIs, MongoDB operations, and background jobs)
- **Database on MongoDB Atlas**

---

## 📋 Quick Environment Variable Cheat Sheet

| Variable Name | Upload to Vercel? | Upload to Render? | Description |
|---|:---:|:---:|---|
| `RENDER_BACKEND_URL` | **YES** | NO | Your Render backend URL (e.g. `https://iphonehub-backend.onrender.com`) |
| `NEXTAUTH_URL` | **YES** | **YES** | Your Vercel frontend URL (e.g. `https://your-iphonehub.vercel.app`) |
| `NEXTAUTH_SECRET` | **YES** | **YES** | 32-character random string (must match on both) |
| `MONGODB_URI` | Optional* | **YES** | MongoDB Atlas connection string |
| `GOOGLE_CLIENT_ID` | **YES** | **YES** | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | NO | **YES** | Google OAuth Client Secret (Never expose to frontend!) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | **YES** | **YES** | Razorpay Public Key ID |
| `RAZORPAY_KEY_SECRET` | NO | **YES** | Razorpay Secret Key (For HMAC verification) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`| **YES** | **YES** | Cloudinary Cloud Name |
| `CLOUDINARY_API_KEY` | NO | **YES** | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | NO | **YES** | Cloudinary API Secret |
| `ADMIN_EMAILS` | NO | **YES** | Admin emails: `admin@iphonehub.in,...` |

*\*If you want Vercel serverless functions to also have direct database access, you can add MONGODB_URI to Vercel as well.*

---

## Step 1: Set Up MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free M0 cluster.
2. In **Database Access**, create a database user (e.g., `iphonehub_admin`) with a secure password.
3. In **Network Access**, click **Add IP Address** and choose **Allow Access From Anywhere (`0.0.0.0/0`)** — this allows both Render and Vercel servers to connect.
4. Click **Connect** > **Drivers** > **Node.js** and copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/iphonehub?retryWrites=true&w=majority
   ```

---

## Step 2: Deploy Backend on Render

1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository containing the `iphonehub` folder (or push this directory to a repo).
4. Configure the service settings:
   - **Name**: `iphonehub-backend`
   - **Language / Environment**: `Node`
   - **Region**: Oregon (or Singapore / Frankfurt closest to your users)
   - **Branch**: `main`
   - **Root Directory**: `.` (or `iphonehub` if inside a subfolder)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
5. Scroll down to **Environment Variables** and add the following:
   ```env
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/iphonehub?retryWrites=true&w=majority
   NEXTAUTH_URL=https://your-iphonehub.vercel.app
   NEXTAUTH_SECRET=YOUR_32_CHAR_SECRET_KEY
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_or_test_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ADMIN_EMAILS=admin@iphonehub.in
   ```
6. Click **Create Web Service**.
7. Once deployed, Render will provide your public backend URL, for example:
   👉 `https://iphonehub-backend.onrender.com`

---

## Step 3: Deploy Frontend on Vercel

1. Log in to [Vercel](https://vercel.com/) and click **Add New...** > **Project**.
2. Select your repository and specify the root directory (e.g. `iphonehub` if in a subfolder).
3. In the **Environment Variables** section, add the frontend variables:
   ```env
   # Connects Vercel to your Render backend:
   RENDER_BACKEND_URL=https://iphonehub-backend.onrender.com

   # Production frontend URL:
   NEXTAUTH_URL=https://your-iphonehub.vercel.app
   NEXT_PUBLIC_APP_URL=https://your-iphonehub.vercel.app

   # Must match Render:
   NEXTAUTH_SECRET=YOUR_32_CHAR_SECRET_KEY

   # Public Keys:
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_or_test_key
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   ```
4. Click **Deploy**.

---

## ⚡ How the Vercel-to-Render Architecture Works

1. **Automatic API Proxying**:
   In `next.config.mjs`, when `RENDER_BACKEND_URL` is set, Vercel automatically proxies all `/api/*` calls to Render:
   ```
   Browser ➔ Vercel (/api/orders) ➔ Render Backend (/api/orders) ➔ MongoDB Atlas
   ```
   **Zero CORS issues**: Because the browser only talks to your Vercel domain, there are no cross-origin blocks or cookie dropped sessions!

2. **Render Dynamic Port Handling**:
   In `package.json`, `"start": "next start"` automatically reads Render's injected `$PORT` (e.g. `10000`) without hardcoded port conflicts.

3. **Database Fallback Safety**:
   If MongoDB Atlas ever experiences a temporary connection timeout, iPhoneHub's in-memory store keeps product catalog and mock testing functioning without crashing the server.

---

## 💡 Alternative: 100% Free Single-Service Deployment on Vercel
Because Next.js has built-in Route Handlers, you can also deploy the entire application (both frontend and backend APIs) directly onto Vercel in one single step without Render:
- Upload all `.env.render.example` and `.env.vercel.example` variables directly into Vercel.
- Omit `RENDER_BACKEND_URL`.
- Vercel will host both the frontend and serverless API endpoints together under one free domain!

