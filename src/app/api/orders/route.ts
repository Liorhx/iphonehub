import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrders } from '@/services/order.service';
import { getProductBySlug } from '@/services/product.service';
import { OrderItem } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || undefined;

    const orders = await getOrders(userId);
    return NextResponse.json({ success: true, count: orders.length, data: orders });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      items,
      shippingAddress,
      paymentMethod,
      couponCode,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.pinCode) {
      return NextResponse.json({ success: false, error: 'Complete shipping address is required' }, { status: 400 });
    }

    // Server-side inventory & price verification!
    let validatedSubtotal = 0;
    const validatedItems: OrderItem[] = [];

    for (const item of items) {
      const dbProduct = await getProductBySlug(item.productId);
      if (!dbProduct) {
        return NextResponse.json(
          { success: false, error: `Product ${item.title || item.productId} no longer exists` },
          { status: 400 }
        );
      }

      if (dbProduct.stock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${dbProduct.title}. Only ${dbProduct.stock} remaining.` },
          { status: 400 }
        );
      }

      // Add item price verified from catalog
      const itemPrice = dbProduct.price;
      validatedSubtotal += itemPrice * (item.quantity || 1);

      validatedItems.push({
        productId: dbProduct._id,
        title: dbProduct.title,
        model: dbProduct.model,
        storage: dbProduct.storage,
        condition: dbProduct.condition,
        color: dbProduct.color,
        price: itemPrice,
        quantity: item.quantity || 1,
        image: dbProduct.thumbnail || dbProduct.images[0],
        warranty: item.warranty || dbProduct.warranty,
      });
    }

    // Apply coupon discounts server-side
    let discount = 0;
    if (couponCode) {
      const code = couponCode.toUpperCase().trim();
      if (code === 'WELCOME500' && validatedSubtotal >= 10000) {
        discount = 500;
      } else if (code === 'IPHONE1000' && validatedSubtotal >= 30000) {
        discount = 1000;
      } else if (code === 'IPHONEHUB1000' && validatedSubtotal >= 30000) {
        discount = 1000;
      } else if (code === 'UPGRADE2000' && validatedSubtotal >= 50000) {
        discount = 2000;
      }
    }

    const shipping = 0; // Free pan-India express delivery
    const total = Math.max(0, validatedSubtotal - discount + shipping);

    const created = await createOrder({
      userId: userId || 'guest_user',
      customerName,
      customerEmail,
      customerPhone,
      items: validatedItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'UPI',
      subtotal: validatedSubtotal,
      discount,
      couponCode,
      shipping,
      total,
      razorpayOrderId: body.razorpayOrderId,
      razorpayPaymentId: body.razorpayPaymentId,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

