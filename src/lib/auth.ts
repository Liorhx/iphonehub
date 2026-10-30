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
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          throw new Error('Please enter an email address');
        }

        const email = credentials.email.toLowerCase();
        const isAdmin =
          email.includes('admin') ||
          (process.env.ADMIN_EMAILS && process.env.ADMIN_EMAILS.toLowerCase().includes(email));

        const userObj = {
          id: email === 'admin@iphonehub.in' ? 'admin_root_1' : 'user_demo_1',
          name: credentials.name || (isAdmin ? 'Admin Rahul' : 'Rahul Yadav'),
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
            }
            return {
              id: dbUser._id.toString(),
              name: dbUser.name,
              email: dbUser.email,
              image: dbUser.profileImage || userObj.image,
              role: dbUser.role,
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as { role?: string }).role || 'customer';
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

