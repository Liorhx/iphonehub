import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/services/product.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const model = searchParams.get('model') || undefined;
    const family = searchParams.get('family') || undefined;
    const storage = searchParams.get('storage') || undefined;
    const condition = searchParams.get('condition') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const minBattery = searchParams.get('minBattery') ? Number(searchParams.get('minBattery')) : undefined;
    const search = searchParams.get('search') || undefined;
    const sortBy = (searchParams.get('sortBy') as 'price_asc' | 'price_desc' | 'newest' | 'rating') || undefined;

    const products = await getProducts({
      model,
      family,
      storage,
      condition,
      minPrice,
      maxPrice,
      minBattery,
      search,
      sortBy,
    });

    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title || !body.price || !body.model) {
      return NextResponse.json({ success: false, error: 'Missing required product fields' }, { status: 400 });
    }

    const created = await createProduct(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

