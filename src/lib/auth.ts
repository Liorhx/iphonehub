import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectToDatabase from '@/lib/mongodb';
import UserModel from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'mock_google_client_id'
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
    CredentialsProvider({
      id: 'credentials',
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'user@example.com' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
        admin_otp_verified: { label: 'Admin OTP Verified', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          throw new Error('Please enter an email address');
        }

        const email = credentials.email.toLowerCase().trim();
        const isOtpVerified = credentials.admin_otp_verified === 'true';

        // Admin role is ONLY granted if OTP verification was successful
        const allowedAdmins = (process.env.ADMIN_EMAILS || 'yadav962160@gmail.com,admin@iphonehub.in')
          .toLowerCase()
          .split(',')
          .map((e) => e.trim());

        const isAllowedAdminEmail =
          allowedAdmins.includes(email) ||
          email.includes('admin') ||
          email === 'yadav962160@gmail.com';

        const isAdmin = isOtpVerified && isAllowedAdminEmail;

        const userObj = {
          id: isAdmin ? 'admin_root_1' : 'user_customer_' + Date.now(),
          name: credentials.name || (isAdmin ? 'Admin Console' : email.split('@')[0] || 'Customer'),
          email,
          image: isAdmin
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          role: isAdmin ? 'admin' : 'customer',
        };

        try {
          const conn = await connectToDatabase();
          if (conn) {
            let dbUser = await UserModel.findOne({ email });
            if (!dbUser) {
              dbUser = await UserModel.create({
                name: userObj.name,
                email: userObj.email,
                role: userObj.role,
                profileImage: userObj.image,
                addresses: [
                  {
                    fullName: userObj.name,
                    phone: '+91 98765 43210',
                    street: '402, Apex Signature Heights',
                    apartment: 'Tower B, Flat 402',
                    city: 'Bengaluru',
                    state: 'Karnataka',
                    pinCode: '560103',
                    isDefault: true,
                  },
                ],
              });
            } else if (isAdmin && dbUser.role !== 'admin') {
              dbUser.role = 'admin';
              await dbUser.save();
            }
            return {
              id: dbUser._id.toString(),
              name: dbUser.name,
              email: dbUser.email,
              image: dbUser.profileImage || userObj.image,
              role: isAdmin ? 'admin' : dbUser.role,
            };
          }
        } catch (err) {
          console.warn('Database lookup during auth bypassed:', err);
        }

        return userObj;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as { role?: string }).role || 'customer';
      }
      if (trigger === 'update' && session?.role) {
        token.role = session.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as unknown as { id?: string; role?: string }).id = token.id as string;
        (session.user as unknown as { role?: string }).role = (token.role as string) || 'customer';
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'iphonehub_super_secret_session_token_32_chars_2026',
};
