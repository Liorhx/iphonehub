import { NextRequest, NextResponse } from 'next/server';
import { generateOtp, sendOtpEmail } from '@/lib/otp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    // Resolve configured admin email from ADMIN_EMAILS environment variable
    const adminEmailsEnv = (
      process.env.ADMIN_EMAILS ||
      process.env.ADMIN_EMAIL ||
      'yadav962160@gmail.com'
    ).trim();

    const allowedAdmins = adminEmailsEnv
      .toLowerCase()
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean);

    // Default target is the primary administrator from ADMIN_EMAILS
    const primaryAdmin = allowedAdmins[0] || 'yadav962160@gmail.com';

    let targetEmail = primaryAdmin;
    if (body.email && typeof body.email === 'string' && body.email.trim()) {
      const inputEmail = body.email.trim().toLowerCase();
      if (allowedAdmins.includes(inputEmail) || inputEmail.includes('admin') || inputEmail === primaryAdmin) {
        targetEmail = inputEmail;
      }
    }

    const otp = generateOtp(targetEmail);
    const result = await sendOtpEmail(targetEmail, otp);

    // Mask email for display in UI (e.g. ya****@gmail.com)
    const [namePart, domainPart] = targetEmail.split('@');
    const maskedEmail = namePart && domainPart
      ? `${namePart.slice(0, 3)}****@${domainPart}`
      : targetEmail;

    console.log(`🔐 [ADMIN 2FA DISPATCH] Dispatched OTP code to admin address: ${targetEmail}`);

    return NextResponse.json({
      success: true,
      message: `A 6-digit security code has been dispatched to ${targetEmail}`,
      targetEmail,
      maskedEmail,
      // For instant debugging / demo display when SMTP is not configured
      devOtp: process.env.NODE_ENV !== 'production' || result.simulated ? otp : undefined,
    });
  } catch (error: unknown) {
    console.error('Send admin OTP error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to send OTP';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
