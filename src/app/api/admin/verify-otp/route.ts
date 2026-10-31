import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/otp';
import connectToDatabase from '@/lib/mongodb';
import UserModel from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP are both required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const isValid = verifyOtp(normalizedEmail, otp);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired 6-digit OTP. Please check your inbox and try again.' },
        { status: 400 }
      );
    }

    // Update user role in MongoDB if connected
    try {
      const conn = await connectToDatabase();
      if (conn) {
        let user = await UserModel.findOne({ email: normalizedEmail });
        if (user) {
          user.role = 'admin';
          await user.save();
        } else {
          await UserModel.create({
            name: normalizedEmail.split('@')[0] || 'Administrator',
            email: normalizedEmail,
            role: 'admin',
            profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          });
        }
      }
    } catch (dbErr) {
      console.warn('DB update for admin role bypassed:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Admin authorization granted successfully.',
      user: {
        email: normalizedEmail,
        role: 'admin',
      },
    });
  } catch (error: unknown) {
    console.error('Verify admin OTP error:', error);
    const msg = error instanceof Error ? error.message : 'Verification failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

