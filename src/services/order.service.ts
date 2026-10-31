import connectToDatabase from '@/lib/mongodb';
import OrderModel from '@/models/Order';
import { Order, OrderStatus } from '@/types';
import { generateId } from '@/lib/utils';

// Runtime in-memory orders fallback if database connection is disrupted
let memoryOrders: Order[] = [];

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
      return (dbOrders || []).map((o) => ({
        ...o,
        _id: o._id.toString(),
      })) as unknown as Order[];
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
      return null;
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
      return null;
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
