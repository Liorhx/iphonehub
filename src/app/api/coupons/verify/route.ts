import { NextRequest, NextResponse } from 'next/server';

const ACTIVE_COUPONS: Record<string, { discountType: 'fixed' | 'percentage'; value: number; minOrder: number; description: string }> = {
  WELCOME500: { discountType: 'fixed', value: 500, minOrder: 10000, description: '₹500 flat discount for new customers' },
  IPHONE1000: { discountType: 'fixed', value: 1000, minOrder: 30000, description: '₹1,000 off on orders above ₹30,000' },
  IPHONEHUB1000: { discountType: 'fixed', value: 1000, minOrder: 30000, description: '₹1,000 off on iPhoneHub certified devices' },
  UPGRADE2000: { discountType: 'fixed', value: 2000, minOrder: 50000, description: '₹2,000 instant discount on Pro models' },
  FESTIVE5: { discountType: 'percentage', value: 5, minOrder: 20000, description: '5% extra off (up to ₹2,500)' },
};

export async function POST(request: NextRequest) {
  try {
    const { code, cartTotal } = await request.json();
    if (!code) {
      return NextResponse.json({ success: false, error: 'Coupon code is required' }, { status: 400 });
    }

    const upper = code.trim().toUpperCase();
    const coupon = ACTIVE_COUPONS[upper];

    if (!coupon) {
      return NextResponse.json({ success: false, error: 'Invalid or expired coupon code' }, { status: 404 });
    }

    if (cartTotal && cartTotal < coupon.minOrder) {
      return NextResponse.json(
        {
          success: false,
          error: `This coupon requires a minimum cart value of ₹${coupon.minOrder.toLocaleString('en-IN')}`,
        },
        { status: 400 }
      );
    }

    let calculatedDiscount = coupon.value;
    if (coupon.discountType === 'percentage' && cartTotal) {
      calculatedDiscount = Math.min(2500, Math.round((cartTotal * coupon.value) / 100));
    }

    return NextResponse.json({
      success: true,
      data: {
        code: upper,
        discount: calculatedDiscount,
        description: coupon.description,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

