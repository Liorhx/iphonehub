import mongoose, { Schema, Model } from 'mongoose';

export interface IProduct {
  title: string;
  slug: string;
  brand: string;
  model: string;
  modelFamily: string;
  storage: string;
  color: string;
  colorHex: string;
  condition: 'Flawless' | 'Excellent' | 'Good' | 'Fair';
  batteryHealth: number;
  price: number;
  originalPrice: number;
  images: string[];
  thumbnail: string;
  videoUrl?: string;
  specifications: {
    display: string;
    processor: string;
    camera: string;
    battery: string;
    os: string;
    sim: string;
    biometrics: string;
  };
  warranty: string;
  stock: number;
  status: 'available' | 'reserved' | 'sold';
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  isBestDeal: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new Schema(
  {
    _id: { type: String },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    brand: { type: String, default: 'Apple' },
    model: { type: String, required: true },
    modelFamily: { type: String, required: true },
    storage: { type: String, required: true },
    color: { type: String, required: true },
    colorHex: { type: String, required: true },
    condition: {
      type: String,
      enum: ['Flawless', 'Excellent', 'Good', 'Fair'],
      required: true,
    },
    batteryHealth: { type: Number, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    images: [{ type: String }],
    thumbnail: { type: String, required: true },
    videoUrl: { type: String, default: '' },
    specifications: {
      display: { type: String, default: 'Super Retina XDR OLED' },
      processor: { type: String, default: 'Apple Bionic' },
      camera: { type: String, default: 'Advanced camera system' },
      battery: { type: String, default: 'All-day battery life' },
      os: { type: String, default: 'iOS' },
      sim: { type: String, default: 'Dual SIM (nano-SIM and eSIM)' },
      biometrics: { type: String, default: 'Face ID' },
    },
    warranty: { type: String, default: '6 Months iPhoneHub Warranty' },
    stock: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ['available', 'reserved', 'sold'],
      default: 'available',
    },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 42 },
    isFeatured: { type: Boolean, default: false },
    isBestDeal: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ProductModel: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default ProductModel;
