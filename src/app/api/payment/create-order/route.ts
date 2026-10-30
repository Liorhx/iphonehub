import { NextRequest, NextResponse } from 'next/server';
import { getRazorpayClient } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'INR', receipt } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Valid amount is required' }, { status: 400 });
    }

    const razorpay = getRazorpayClient();

    if (razorpay) {
      // Amount in paise (1 INR = 100 paise)
      const options = {
        amount: Math.round(amount * 100),
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      });
    }

    // Mock order for seamless local testing without live Razorpay credentials
    const mockOrderId = `order_mock_${Date.now()}`;
    return NextResponse.json({
      success: true,
      orderId: mockOrderId,
      amount: Math.round(amount * 100),
      currency: 'INR',
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mockkey',
      isMock: true,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

