import { NextRequest, NextResponse } from 'next/server';
import { generateOtp, sendOtpEmail } from '@/lib/otp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    let email: string = body.email ? body.email.trim().toLowerCase() : '';

    if (!email) {
      email = (process.env.ADMIN_EMAIL || 'admin@iphonehub.in').toLowerCase();
    }

    // Check if email is eligible for admin role
    const adminEmailsEnv = process.env.ADMIN_EMAILS || 'admin@iphonehub.in';
    const allowedAdmins = adminEmailsEnv.toLowerCase().split(',').map((e) => e.trim());

    const isAuthorizedEmail =
      allowedAdmins.includes(email) ||
      email.includes('admin') ||
      email === 'admin@iphonehub.in';

    if (!isAuthorizedEmail) {
      return NextResponse.json(
        {
          success: false,
          error: 'This email is not registered as an authorized administrator.',
        },
        { status: 403 }
      );
    }

    const otp = generateOtp(email);
    const result = await sendOtpEmail(email, otp);

    return NextResponse.json({
      success: true,
      message: `A 6-digit security code has been dispatched to ${email}`,
      targetEmail: email,
      // For testing / demo convenience when SMTP is not configured
      devOtp: process.env.NODE_ENV !== 'production' || result.simulated ? otp : undefined,
    });
  } catch (error: unknown) {
    console.error('Send admin OTP error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to send OTP';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

