import { NextRequest, NextResponse } from 'next/server';
import { getRazorpayClient } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'INR', receipt } = await request.json();

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ success: false, error: 'Valid payment amount is required' }, { status: 400 });
    }

    const key_id = (
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      process.env.RAZORPAY_KEY_ID ||
      process.env.RAZORPAY_KEY ||
      ''
    ).trim();

    const razorpay = getRazorpayClient();

    if (razorpay) {
      // Amount in paise (1 INR = 100 paise)
      const options = {
        amount: Math.round(Number(amount) * 100),
        currency: (currency || 'INR').toUpperCase(),
        receipt: (receipt || `rcpt_${Date.now()}`).slice(0, 40), // Razorpay receipt max 40 chars
      };

      console.log(`💳 [RAZORPAY ORDER] Creating order for ${options.amount} paise (${options.currency}) with key ${key_id.slice(0, 8)}...`);
      const order = await razorpay.orders.create(options);
      console.log(`✅ [RAZORPAY ORDER] Successfully created order ID: ${order.id}`);

      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: key_id,
        isMock: false,
      });
    }

    console.warn('⚠️ [RAZORPAY WARNING] Live Razorpay credentials not configured or set to mock in environment.');
    // Mock order for seamless local testing without live Razorpay credentials
    const mockOrderId = `order_mock_${Date.now()}`;
    return NextResponse.json({
      success: true,
      orderId: mockOrderId,
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      key: key_id || 'rzp_test_mockkey',
      isMock: true,
    });
  } catch (error: unknown) {
    console.error('❌ [RAZORPAY ERROR] Failed to create order:', error);
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
