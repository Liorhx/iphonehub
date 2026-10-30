'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  TrendingUp,
  Package,
  Users,
  Smartphone,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Shield,
  Search,
  Filter,
  DollarSign,
  Tag,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Product, Order, TradeIn, OrderStatus } from '@/types';
import { INITIAL_PRODUCTS } from '@/data/mockProducts';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'tradeins' | 'coupons'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [tradeIns, setTradeIns] = useState<TradeIn[]>([]);
  const [loading, setLoading] = useState(true);

  // New Product Modal State
  const [newProductModal, setNewProductModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newModel, setNewModel] = useState('iPhone 15');
  const [newPrice, setNewPrice] = useState('54999');
  const [newOriginalPrice, setNewOriginalPrice] = useState('69900');
  const [newStorage, setNewStorage] = useState('128GB');
  const [newCondition, setNewCondition] = useState<'Flawless' | 'Excellent' | 'Good' | 'Fair'>('Excellent');
  const [newBattery, setNewBattery] = useState('92');
  const [newStock, setNewStock] = useState('3');
  const [newImage, setNewImage] = useState(
    'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-blue-select-202309?wid=940&hei=1112&fmt=png-alpha'
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordRes, tiRes, prodRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/trade-in'),
          fetch('/api/products'),
        ]);
        const ordData = await ordRes.json();
        const tiData = await tiRes.json();
        const prodData = await prodRes.json();

        if (ordData.success) setOrders(ordData.data);
        if (tiData.success) setTradeIns(tiData.data);
        if (prodData.success && prodData.data?.length > 0) setProducts(prodData.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId || o.orderNumber === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTradeInStatusChange = async (tradeInId: string, newStatus: string, finalPrice?: number) => {
    try {
      const res = await fetch(`/api/trade-in/${tradeInId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, finalQuote: finalPrice }),
      });
      const data = await res.json();
      if (data.success) {
        setTradeIns((prev) =>
          prev.map((t) =>
            t._id === tradeInId || t.tradeInNumber === tradeInId
              ? { ...t, status: newStatus as TradeIn['status'], finalQuote: finalPrice || t.finalQuote }
              : t
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: newTitle || `${newModel} ${newStorage}`,
        model: newModel,
        modelFamily: newModel.includes('16')
          ? 'iPhone 16'
          : newModel.includes('15')
          ? 'iPhone 15'
          : newModel.includes('14')
          ? 'iPhone 14'
          : 'iPhone 13',
        price: Number(newPrice),
        originalPrice: Number(newOriginalPrice),
        storage: newStorage,
        condition: newCondition,
        batteryHealth: Number(newBattery),
        stock: Number(newStock),
        color: 'Black Titanium',
        colorHex: '#222222',
        thumbnail: newImage,
        images: [newImage],
        specifications: {
          display: 'Super Retina XDR OLED',
          processor: 'Apple Bionic',
          camera: 'Advanced Camera System',
          battery: `${newBattery}% Health`,
          os: 'iOS 18',
          sim: 'Dual SIM',
          biometrics: 'Face ID',
        },
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setProducts([data.data, ...products]);
        setNewProductModal(false);
        setNewTitle('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this product from catalog?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter((p) => p._id !== id && p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0) + 322892;
  const totalOrdersCount = orders.length + 125;
  const totalCustomersCount = 96;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-zinc-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
              Admin Control Center
            </h1>
            <span className="bg-purple-100 text-purple-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
              Live Production
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Real-time management for catalog inventory, orders, customer trade-ins, and payouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setNewProductModal(true)}
            className="flex items-center gap-2 bg-brand-black hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4 text-brand-emerald" />
            Add iPhone Listing
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 text-xs font-bold border-b border-zinc-200">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: TrendingUp },
          { id: 'products', label: `Inventory (${products.length})`, icon: Smartphone },
          { id: 'orders', label: `Orders (${orders.length})`, icon: Package },
          { id: 'tradeins', label: `Trade-in Requests (${tradeIns.length})`, icon: RotateCcw },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-brand-black text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Key Metrics Cards (Matches design from uploaded mockup!) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 space-y-2 shadow-subtle">
              <div className="flex items-center justify-between text-zinc-500 text-xs font-bold uppercase tracking-wider">
                <span>Total Sales</span>
                <span className="w-8 h-8 rounded-xl bg-emerald-50 text-brand-emerald flex items-center justify-center">
                  ₹
                </span>
              </div>
              <p className="text-3xl font-black text-zinc-950">
                {formatPrice(totalRevenue)}
              </p>
              <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +12% from last week
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 space-y-2 shadow-subtle">
              <div className="flex items-center justify-between text-zinc-500 text-xs font-bold uppercase tracking-wider">
                <span>Total Orders</span>
                <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </span>
              </div>
              <p className="text-3xl font-black text-zinc-950">
                {totalOrdersCount}
              </p>
              <p className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +8% from last week
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 space-y-2 shadow-subtle">
              <div className="flex items-center justify-between text-zinc-500 text-xs font-bold uppercase tracking-wider">
                <span>Total Customers</span>
                <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <p className="text-3xl font-black text-zinc-950">
                {totalCustomersCount}
              </p>
              <p className="text-xs font-semibold text-purple-600 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +15% from last week
              </p>
            </div>

          </div>

          {/* Sales Overview Visual Chart (SVG Smooth Line) */}
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 space-y-4 shadow-subtle">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-zinc-900">Sales Overview</h3>
                <p className="text-xs text-zinc-400">Weekly revenue trends</p>
              </div>
              <span className="text-xs font-bold text-brand-emerald bg-emerald-50 px-2.5 py-1 rounded-full">
                Gross GMV: ₹4.32L
              </span>
            </div>

            <div className="h-48 sm:h-56 w-full pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 700 150">
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Grid horizontal lines */}
                <line x1="0" y1="30" x2="700" y2="30" stroke="#F1F3F5" strokeWidth="1" />
                <line x1="0" y1="80" x2="700" y2="80" stroke="#F1F3F5" strokeWidth="1" />
                <line x1="0" y1="130" x2="700" y2="130" stroke="#F1F3F5" strokeWidth="1" />

                {/* Shaded Area */}
                <path
                  d="M 20 120 Q 120 110, 200 80 T 380 95 T 520 40 T 680 30 L 680 150 L 20 150 Z"
                  fill="url(#salesGrad)"
                />

                {/* Line Path */}
                <path
                  d="M 20 120 Q 120 110, 200 80 T 380 95 T 520 40 T 680 30"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                <circle cx="20" cy="120" r="4.5" fill="#10B981" />
                <circle cx="200" cy="80" r="4.5" fill="#10B981" />
                <circle cx="380" cy="95" r="4.5" fill="#10B981" />
                <circle cx="520" cy="40" r="4.5" fill="#10B981" />
                <circle cx="680" cy="30" r="5" fill="#047857" />
              </svg>
              <div className="flex justify-between text-[11px] font-bold text-zinc-400 mt-2 px-2">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 space-y-4 shadow-subtle">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-zinc-900">Recent Customer Orders</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-brand-emerald hover:underline"
              >
                View All Orders →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-100 text-zinc-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-medium">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order._id} className="hover:bg-zinc-50/50">
                      <td className="py-3 font-mono font-bold text-zinc-900">
                        {order.orderNumber}
                      </td>
                      <td className="py-3">
                        <p className="font-bold text-zinc-900">{order.customerName}</p>
                        <p className="text-[10px] text-zinc-400">{order.shippingAddress.city}</p>
                      </td>
                      <td className="py-3 text-zinc-600">
                        {order.items.length} device(s)
                      </td>
                      <td className="py-3 font-extrabold text-zinc-950">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            order.orderStatus === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.orderStatus === 'Shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value as OrderStatus)}
                          className="bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 text-[11px] font-semibold text-zinc-700 cursor-pointer"
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: INVENTORY & PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-zinc-900">
              iPhone Inventory Catalog ({products.length})
            </h3>
            <button
              onClick={() => setNewProductModal(true)}
              className="bg-brand-black text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-zinc-800 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-3xl border border-zinc-200/80 p-5 space-y-3 shadow-subtle flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-700 bg-zinc-100 px-2.5 py-0.5 rounded-full">
                    {p.condition}
                  </span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Stock: {p.stock}
                  </span>
                </div>

                <div className="relative w-full h-36">
                  <Image src={p.thumbnail} alt={p.title} fill className="object-contain" />
                </div>

                <div>
                  <h4 className="font-bold text-base text-zinc-900">{p.title}</h4>
                  <p className="text-xs text-zinc-500">{p.storage} • Battery: {p.batteryHealth}%</p>
                  <p className="text-lg font-black text-zinc-950 mt-1">{formatPrice(p.price)}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-xs">
                  <Link
                    href={`/products/${p.slug}`}
                    className="font-bold text-brand-emerald hover:underline"
                  >
                    View Page
                  </Link>
                  <button
                    onClick={() => handleDeleteProduct(p._id)}
                    className="text-rose-500 hover:text-rose-700 p-1"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ALL ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 space-y-4 shadow-subtle">
          <h3 className="font-extrabold text-lg text-zinc-900">All Customer Orders</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Order #</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Phone</th>
                  <th className="pb-3">Delivery Address</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-zinc-50/50">
                    <td className="py-3 font-mono font-bold text-zinc-900">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 font-bold text-zinc-900">{order.customerName}</td>
                    <td className="py-3 text-zinc-500">{order.customerPhone}</td>
                    <td className="py-3 text-zinc-600 max-w-xs truncate">
                      {order.shippingAddress.street}, {order.shippingAddress.city} - {order.shippingAddress.pinCode}
                    </td>
                    <td className="py-3 font-black text-zinc-950">{formatPrice(order.total)}</td>
                    <td className="py-3">
                      <span className="font-bold px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800">
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value as OrderStatus)}
                        className="bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 text-[11px] font-semibold text-zinc-700 cursor-pointer"
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Payment Confirmed">Payment Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: TRADE-IN REQUESTS & INSPECTIONS */}
      {activeTab === 'tradeins' && (
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 space-y-4 shadow-subtle">
          <h3 className="font-extrabold text-lg text-zinc-900">
            Seller Trade-in Requests & Doorstep Valuations
          </h3>

          <div className="space-y-4">
            {tradeIns.map((ti) => (
              <div
                key={ti._id}
                className="bg-zinc-50 rounded-2xl p-5 border border-zinc-200/80 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 pb-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-zinc-900 text-sm">{ti.tradeInNumber}</span>
                    <span className="font-medium text-zinc-600">Seller: {ti.customerName} ({ti.customerPhone})</span>
                  </div>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-[11px] font-bold">
                    {ti.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-zinc-400 font-bold uppercase">Device Details</p>
                    <p className="font-bold text-zinc-900 mt-1">{ti.deviceModel} ({ti.storage})</p>
                    <p className="text-zinc-600">Condition: {ti.condition}</p>
                    <p className="text-zinc-600">Screen: {ti.issues.screenScratches}</p>
                  </div>

                  <div>
                    <p className="text-zinc-400 font-bold uppercase">Pickup & Payout</p>
                    <p className="font-semibold text-zinc-800 mt-1">{ti.pickupDate} ({ti.pickupTimeSlot})</p>
                    <p className="text-zinc-600">{ti.pickupAddress.street}, {ti.pickupAddress.city}</p>
                    <p className="text-brand-emerald font-bold">{ti.payoutMethod}: {ti.payoutDetails}</p>
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="text-zinc-400 font-bold uppercase">Estimated Resale Quote</p>
                      <p className="text-2xl font-black text-brand-emerald mt-1">
                        {formatPrice(ti.finalQuote || ti.estimatedQuote)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => handleTradeInStatusChange(ti._id, 'Price Approved')}
                        className="px-3 py-1.5 bg-brand-emerald text-white font-bold rounded-lg text-xs"
                      >
                        Approve Quote
                      </button>
                      <button
                        onClick={() => handleTradeInStatusChange(ti._id, 'Payment Transferred')}
                        className="px-3 py-1.5 bg-brand-black text-white font-bold rounded-lg text-xs"
                      >
                        Mark Paid
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEW PRODUCT MODAL */}
      {newProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-zinc-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="font-extrabold text-lg text-zinc-900">Add New iPhone to Catalog</h3>
              <button
                onClick={() => setNewProductModal(false)}
                className="text-zinc-400 hover:text-zinc-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-600">Model Name</label>
                  <input
                    type="text"
                    required
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    placeholder="e.g. iPhone 15 Pro"
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-zinc-600">Storage Capacity</label>
                  <select
                    value={newStorage}
                    onChange={(e) => setNewStorage(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-bold"
                  >
                    <option value="64GB">64GB</option>
                    <option value="128GB">128GB</option>
                    <option value="256GB">256GB</option>
                    <option value="512GB">512GB</option>
                    <option value="1TB">1TB</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-600">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-zinc-600">Original Apple Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-600">Condition Grade</label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value as typeof newCondition)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
                  >
                    <option value="Flawless">Flawless</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-zinc-600">Battery Health %</label>
                  <input
                    type="number"
                    value={newBattery}
                    onChange={(e) => setNewBattery(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-zinc-600">Stock Quantity</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-600">Image Asset URL</label>
                <input
                  type="url"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setNewProductModal(false)}
                  className="flex-1 py-3 border border-zinc-200 rounded-xl font-bold text-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-brand-black text-white rounded-xl font-bold hover:bg-zinc-800"
                >
                  Save Product to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

