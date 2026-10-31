import { NextRequest, NextResponse } from 'next/server';
import { createTradeIn, getTradeIns } from '@/services/trade-in.service';
import { calculateTradeInQuote } from '@/lib/tradeInPricing';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || undefined;

    const tradeIns = await getTradeIns(userId);
    return NextResponse.json({ success: true, count: tradeIns.length, data: tradeIns });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Mode 1: Quick calculate instant quote
    if (body.action === 'calculate') {
      const { model, storage, condition, issues } = body;
      const quote = calculateTradeInQuote(model, storage, condition, issues || {});
      return NextResponse.json({ success: true, quote });
    }

    // Mode 2: Submit trade-in request
    const {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      deviceModel,
      storage,
      condition,
      issues,
      estimatedQuote,
      exchangeBonus,
      pickupAddress,
      pickupDate,
      pickupTimeSlot,
      payoutMethod,
      payoutDetails,
    } = body;

    if (!deviceModel || !pickupAddress || !payoutDetails) {
      return NextResponse.json(
        { success: false, error: 'Device details, pickup address, and payout details are required' },
        { status: 400 }
      );
    }

    const created = await createTradeIn({
      userId: userId || 'guest_seller',
      customerName: customerName || pickupAddress.fullName || 'Customer',
      customerEmail: customerEmail || '',
      customerPhone: customerPhone || pickupAddress.phone || '',
      deviceModel,
      storage: storage || '128 GB',
      condition: condition || 'Good',
      batteryHealthPercent: body.batteryHealthPercent || 85,
      issues: issues || {
        screenScratches: 'None',
        bodyCondition: 'Flawless',
        batteryHealth: 'Above 85%',
        cameraWorking: true,
        faceIdWorking: true,
        speakersAndMicWorking: true,
        boxAndAccessoriesPresent: false,
        validIndianBillPresent: false,
      },
      estimatedQuote: estimatedQuote || 25000,
      exchangeBonus: exchangeBonus || 2000,
      pickupAddress,
      pickupDate: pickupDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      pickupTimeSlot: pickupTimeSlot || '10:00 AM - 01:00 PM',
      payoutMethod: payoutMethod || 'UPI',
      payoutDetails,
      status: 'Pickup Scheduled',
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

