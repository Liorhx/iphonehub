import { NextRequest, NextResponse } from 'next/server';
import { updateTradeIn } from '@/services/trade-in.service';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = await updateTradeIn(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Trade-in request not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

