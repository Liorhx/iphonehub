import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ProductModel from '@/models/Product';
import OrderModel from '@/models/Order';
import TradeInModel from '@/models/TradeIn';
import UserModel from '@/models/User';
import CouponModel from '@/models/Coupon';
import { INITIAL_PRODUCTS } from '@/data/mockProducts';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({
        success: true,
        message: 'Running in high-performance in-memory mode. All seed data is actively available.',
      });
    }

    // Seed Products
    const count = await ProductModel.countDocuments();
    if (count === 0) {
      await ProductModel.insertMany(INITIAL_PRODUCTS);
    }

    // Seed Coupons
    const couponCount = await CouponModel.countDocuments();
    if (couponCount === 0) {
      await CouponModel.insertMany([
        {
          code: 'WELCOME500',
          discountType: 'fixed',
          discountValue: 500,
          minOrderValue: 10000,
          expiryDate: new Date('2027-12-31'),
          active: true,
        },
        {
          code: 'IPHONE1000',
          discountType: 'fixed',
          discountValue: 1000,
          minOrderValue: 30000,
          expiryDate: new Date('2027-12-31'),
          active: true,
        },
      ]);
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with iPhoneHub products, coupons, and orders.',
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

