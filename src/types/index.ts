export type DeviceCondition = 'Flawless' | 'Excellent' | 'Good' | 'Fair';

export interface ProductSpecification {
  display: string;
  processor: string;
  camera: string;
  battery: string;
  os: string;
  sim: string;
  biometrics: string;
}

export interface VerificationCheck {
  title: string;
  passed: boolean;
  description: string;
}

export interface Product {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  brand: 'Apple';
  model: string; // e.g. "iPhone 15 Pro Max"
  modelFamily: 'iPhone 16' | 'iPhone 15' | 'iPhone 14' | 'iPhone 13' | 'iPhone 12' | 'iPhone 11' | 'iPhone SE';
  storage: '64GB' | '128GB' | '256GB' | '512GB' | '1TB';
  color: string;
  colorHex: string;
  condition: DeviceCondition;
  batteryHealth: number; // e.g. 89
  price: number;
  originalPrice: number;
  images: string[];
  thumbnail: string;
  specifications: ProductSpecification;
  verificationChecks?: VerificationCheck[];
  warranty: string; // e.g. "6 Months iPhoneHub Warranty"
  stock: number;
  status: 'available' | 'reserved' | 'sold';
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  isBestDeal?: boolean;
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedWarranty?: {
    type: string;
    price: number;
    months: number;
  };
}

export interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault?: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  createdAt: string;
}

export type OrderStatus = 
  | 'Order Placed'
  | 'Payment Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'UPI' | 'Card' | 'EMI' | 'COD';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface OrderItem {
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
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  subtotal: number;
  discount: number;
  couponCode?: string;
  shipping: number;
  total: number;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    description: string;
  }[];
  createdAt: string;
}

export type TradeInStatus = 
  | 'Quote Generated'
  | 'Pickup Scheduled'
  | 'Device Picked Up'
  | 'Inspection in Progress'
  | 'Price Approved'
  | 'Payment Transferred'
  | 'Cancelled';

export interface TradeInIssues {
  screenScratches: 'None' | 'Minor' | 'Cracked / Deep';
  bodyCondition: 'Flawless' | 'Minor Scratches' | 'Dents / Cracks';
  batteryHealth: 'Above 85%' | '80% - 85%' | 'Below 80%';
  cameraWorking: boolean;
  faceIdWorking: boolean;
  speakersAndMicWorking: boolean;
  boxAndAccessoriesPresent: boolean;
  validIndianBillPresent: boolean;
}

export interface TradeIn {
  _id: string;
  tradeInNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deviceModel: string;
  storage: string;
  condition: DeviceCondition;
  batteryHealthPercent?: number;
  issues: TradeInIssues;
  estimatedQuote: number;
  exchangeBonus: number;
  finalQuote?: number;
  pickupAddress: Address;
  pickupDate: string;
  pickupTimeSlot: string;
  payoutMethod: 'UPI' | 'Bank Transfer';
  payoutDetails: string; // UPI ID or Account Number
  status: TradeInStatus;
  inspectionNotes?: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  expiryDate: string;
  active: boolean;
}

