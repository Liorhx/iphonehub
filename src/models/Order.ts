import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: {
    productId: string;
    title: string;
    model: string;
    storage: string;
    condition: string;
    color: string;
    price: number;
    quantity: number;
    image: string;
    warranty?: string;
  }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    apartment?: string;
    city: string;
    state: string;
    pinCode: string;
  };
  paymentMethod: 'UPI' | 'Card' | 'EMI' | 'COD';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  orderStatus:
    | 'Order Placed'
    | 'Payment Confirmed'
    | 'Processing'
    | 'Shipped'
    | 'Out for Delivery'
    | 'Delivered'
    | 'Cancelled';
  subtotal: number;
  discount: number;
  couponCode?: string;
  shipping: number;
  total: number;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  statusHistory: {
    status: string;
    timestamp: Date;
    description: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema(
  {
    _id: { type: String },
    orderNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    items: [
      {
        productId: { type: String, required: true },
        title: { type: String, required: true },
        model: { type: String, required: true },
        storage: { type: String, required: true },
        condition: { type: String, required: true },
        color: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
        image: { type: String, required: true },
        warranty: { type: String },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      apartment: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pinCode: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Card', 'EMI', 'COD'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: [
        'Order Placed',
        'Payment Confirmed',
        'Processing',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
      ],
      default: 'Order Placed',
    },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponCode: { type: String },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    trackingNumber: { type: String },
    carrier: { type: String, default: 'BlueDart Express' },
    estimatedDelivery: { type: String },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        description: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const OrderModel: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default OrderModel;

