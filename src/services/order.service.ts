import connectToDatabase from '@/lib/mongodb';
import OrderModel from '@/models/Order';
import { Order, OrderStatus } from '@/types';
import { generateId } from '@/lib/utils';

const INITIAL_ORDERS: Order[] = [
  {
    _id: 'ord_123455',
    orderNumber: 'IH-123455',
    userId: 'user_demo_1',
    customerName: 'Rahul Yadav',
    customerEmail: 'rahul.demo@iphonehub.in',
    customerPhone: '+91 98765 43210',
    items: [
      {
        productId: 'prod_iph15_128_good_blue',
        title: 'iPhone 15',
        model: 'iPhone 15',
        storage: '128GB',
        condition: 'Good',
        color: 'Blue',
        price: 49999,
        quantity: 1,
        image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-blue-select-202309?wid=940&hei=1112&fmt=png-alpha',
        warranty: '6 Months iPhoneHub Warranty',
      },
      {
        productId: 'prod_iph13pro_256_sierrablue_exc',
        title: 'iPhone 13 Pro',
        model: 'iPhone 13 Pro',
        storage: '256GB',
        condition: 'Excellent',
        color: 'Sierra Blue',
        price: 59999,
        quantity: 1,
        image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-pro-blue-select?wid=940&hei=1112&fmt=png-alpha',
        warranty: '6 Months iPhoneHub Warranty',
      },
    ],
    shippingAddress: {
      fullName: 'Rahul Yadav',
      phone: '+91 98765 43210',
      street: '402, Apex Signature Heights, Outer Ring Road',
      apartment: 'Tower B, Flat 402',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560103',
      isDefault: true,
    },
    paymentMethod: 'UPI',
    paymentStatus: 'completed',
    orderStatus: 'Shipped',
    subtotal: 109998,
    discount: 1000,
    couponCode: 'IPHONE1000',
    shipping: 0,
    total: 108998,
    trackingNumber: 'BD-882910471IN',
    carrier: 'BlueDart Express Air',
    estimatedDelivery: 'Tomorrow by 2:00 PM',
    statusHistory: [
      { status: 'Order Placed', timestamp: '2026-10-28T10:14:00Z', description: 'Order successfully placed on iPhoneHub' },
      { status: 'Payment Confirmed', timestamp: '2026-10-28T10:15:30Z', description: 'UPI payment verified via Razorpay' },
      { status: 'Processing', timestamp: '2026-10-29T09:00:00Z', description: 'Device passed 48-point certified technician check' },
      { status: 'Shipped', timestamp: '2026-10-30T11:30:00Z', description: 'Handed over to BlueDart courier hub' },
    ],
    createdAt: '2026-10-28T10:14:00Z',
  },
  {
    _id: 'ord_123456',
    orderNumber: 'IH-123456',
    userId: 'user_demo_1',
    customerName: 'Rahul Yadav',
    customerEmail: 'rahul.demo@iphonehub.in',
    customerPhone: '+91 98765 43210',
    items: [
      {
        productId: 'prod_iph14_128_good_midnight',
        title: 'iPhone 14',
        model: 'iPhone 14',
        storage: '128GB',
        condition: 'Good',
        color: 'Midnight',
        price: 42999,
        quantity: 1,
        image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-midnight-select-202209?wid=940&hei=1112&fmt=png-alpha',
      },
    ],
    shippingAddress: {
      fullName: 'Rahul Yadav',
      phone: '+91 98765 43210',
      street: '402, Apex Signature Heights',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560103',
    },
    paymentMethod: 'Card',
    paymentStatus: 'completed',
    orderStatus: 'Delivered',
    subtotal: 42999,
    discount: 0,
    shipping: 0,
    total: 42999,
    trackingNumber: 'BD-771239820IN',
    carrier: 'BlueDart Express',
    estimatedDelivery: 'Delivered on Oct 25',
    statusHistory: [
      { status: 'Order Placed', timestamp: '2026-10-22T14:20:00Z', description: 'Order placed' },
      { status: 'Payment Confirmed', timestamp: '2026-10-22T14:21:00Z', description: 'Card payment confirmed' },
      { status: 'Processing', timestamp: '2026-10-23T11:00:00Z', description: 'Device packaged with secure tamper seal' },
      { status: 'Shipped', timestamp: '2026-10-24T08:00:00Z', description: 'Dispatched from Bangalore fulfillment center' },
      { status: 'Out for Delivery', timestamp: '2026-10-25T09:15:00Z', description: 'Out for delivery with delivery executive' },
      { status: 'Delivered', timestamp: '2026-10-25T14:30:00Z', description: 'Delivered and OTP verified' },
    ],
    createdAt: '2026-10-22T14:20:00Z',
  },
  {
    _id: 'ord_123454',
    orderNumber: 'IH-123454',
    userId: 'user_cust_2',
    customerName: 'Priya Singh',
    customerEmail: 'priya.singh@example.com',
    customerPhone: '+91 91234 56789',
    items: [
      {
        productId: 'prod_iph15promax_256_blue_exc',
        title: 'iPhone 15 Pro Max',
        model: 'iPhone 15 Pro Max',
        storage: '256GB',
        condition: 'Excellent',
        color: 'Blue Titanium',
        price: 98999,
        quantity: 1,
        image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-max-bluetitanium-select?wid=940&hei=1112&fmt=png-alpha',
      },
    ],
    shippingAddress: {
      fullName: 'Priya Singh',
      phone: '+91 91234 56789',
      street: 'Flat 12B, Skydeck Towers, Worli',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400018',
    },
    paymentMethod: 'UPI',
    paymentStatus: 'completed',
    orderStatus: 'Processing',
    subtotal: 98999,
    discount: 0,
    shipping: 0,
    total: 98999,
    statusHistory: [
      { status: 'Order Placed', timestamp: '2026-10-30T14:00:00Z', description: 'Order placed' },
      { status: 'Payment Confirmed', timestamp: '2026-10-30T14:01:00Z', description: 'Payment confirmed' },
      { status: 'Processing', timestamp: '2026-10-30T15:00:00Z', description: 'Quality inspection in progress' },
    ],
    createdAt: '2026-10-30T14:00:00Z',
  },
];

let memoryOrders: Order[] = [...INITIAL_ORDERS];

export async function createOrder(data: {
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Order['items'];
  shippingAddress: Order['shippingAddress'];
  paymentMethod: Order['paymentMethod'];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shipping: number;
  total: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}): Promise<Order> {
  const orderNumber = generateId('IH');
  const now = new Date().toISOString();

  const newOrder: Order = {
    _id: `ord_${Date.now()}`,
    orderNumber,
    userId: data.userId,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone,
    items: data.items,
    shippingAddress: data.shippingAddress,
    paymentMethod: data.paymentMethod,
    paymentStatus: data.paymentMethod === 'COD' ? 'pending' : 'completed',
    orderStatus: 'Order Placed',
    subtotal: data.subtotal,
    discount: data.discount,
    couponCode: data.couponCode,
    shipping: data.shipping,
    total: data.total,
    trackingNumber: `BD-${Math.floor(100000000 + Math.random() * 900000000)}IN`,
    carrier: 'BlueDart Express',
    estimatedDelivery: 'In 2-3 business days',
    statusHistory: [
      {
        status: 'Order Placed',
        timestamp: now,
        description: 'Order successfully placed on iPhoneHub',
      },
    ],
    createdAt: now,
  };

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const created = await OrderModel.create(newOrder);
      memoryOrders.unshift(newOrder);
      return {
        ...created.toObject(),
        _id: created._id.toString(),
      } as unknown as Order;
    }
  } catch (err) {
    console.warn('Saving order to memory store:', err);
  }

  memoryOrders.unshift(newOrder);
  return newOrder;
}

export async function getOrders(userId?: string): Promise<Order[]> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const query = userId ? { userId } : {};
      const dbOrders = await OrderModel.find(query).sort({ createdAt: -1 }).lean();
      if (dbOrders && dbOrders.length > 0) {
        return dbOrders.map((o) => ({
          ...o,
          _id: o._id.toString(),
        })) as unknown as Order[];
      }
    }
  } catch (err) {
    console.warn('Memory fallback for orders:', err);
  }

  if (userId) {
    return memoryOrders.filter((o) => o.userId === userId);
  }
  return memoryOrders;
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const dbOrder = await OrderModel.findOne({
        $or: [{ _id: id }, { orderNumber: id }],
      }).lean();
      if (dbOrder) {
        return {
          ...dbOrder,
          _id: dbOrder._id.toString(),
        } as unknown as Order;
      }
    }
  } catch (err) {
    console.warn('Memory fallback for order by id:', err);
  }

  const found = memoryOrders.find(
    (o) => o._id === id || o.orderNumber === id || o.orderNumber.toLowerCase() === id.toLowerCase()
  );
  return found || null;
}

export async function updateOrderStatus(
  id: string,
  newStatus: OrderStatus,
  note?: string
): Promise<Order | null> {
  const timestamp = new Date().toISOString();
  const historyEntry = {
    status: newStatus,
    timestamp,
    description: note || `Status updated to ${newStatus}`,
  };

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const updated = await OrderModel.findOneAndUpdate(
        { $or: [{ _id: id }, { orderNumber: id }] },
        {
          $set: { orderStatus: newStatus },
          $push: { statusHistory: historyEntry },
        },
        { new: true }
      ).lean();
      if (updated) {
        return {
          ...updated,
          _id: updated._id.toString(),
        } as unknown as Order;
      }
    }
  } catch (err) {
    console.warn('Updating order in memory store:', err);
  }

  const idx = memoryOrders.findIndex((o) => o._id === id || o.orderNumber === id);
  if (idx !== -1) {
    memoryOrders[idx].orderStatus = newStatus;
    memoryOrders[idx].statusHistory.push(historyEntry);
    return memoryOrders[idx];
  }

  return null;
}

