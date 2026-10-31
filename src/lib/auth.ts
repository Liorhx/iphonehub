import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectToDatabase from '@/lib/mongodb';
import UserModel from '@/models/User';

function getAdminEmails(): string[] {
  const envAdmins = (process.env.ADMIN_EMAILS || 'yadav962160@gmail.com,admin@iphonehub.in')
    .toLowerCase()
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);
  return envAdmins;
}

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
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          throw new Error('Please enter an email address');
        }

        const email = credentials.email.toLowerCase().trim();
        const allowedAdmins = getAdminEmails();
        const isAdmin = allowedAdmins.includes(email) || email === 'yadav962160@gmail.com';

        const userObj = {
          id: isAdmin ? 'admin_root_1' : 'user_' + Date.now(),
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
    async signIn({ user }) {
      if (user?.email) {
        const email = user.email.toLowerCase().trim();
        const allowedAdmins = getAdminEmails();
        const isAdmin = allowedAdmins.includes(email) || email === 'yadav962160@gmail.com';

        try {
          const conn = await connectToDatabase();
          if (conn) {
            let dbUser = await UserModel.findOne({ email });
            if (!dbUser) {
              await UserModel.create({
                name: user.name || 'User',
                email,
                role: isAdmin ? 'admin' : 'customer',
                profileImage: user.image || '',
              });
            } else if (isAdmin && dbUser.role !== 'admin') {
              dbUser.role = 'admin';
              await dbUser.save();
            }
          }
        } catch (dbErr) {
          console.warn('DB sync on signIn bypassed:', dbErr);
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
      }
      const userEmail = (token.email || user?.email || '').toLowerCase().trim();
      const allowedAdmins = getAdminEmails();
      const isAdmin = allowedAdmins.includes(userEmail) || userEmail === 'yadav962160@gmail.com';

      token.role = isAdmin ? 'admin' : 'customer';

      if (trigger === 'update' && session?.role) {
        token.role = session.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const userEmail = (session.user.email || token.email || '').toLowerCase().trim();
        const allowedAdmins = getAdminEmails();
        const isAdmin =
          allowedAdmins.includes(userEmail) ||
          userEmail === 'yadav962160@gmail.com' ||
          token.role === 'admin';

        (session.user as unknown as { id?: string; role?: string }).id = token.id as string;
        (session.user as unknown as { role?: string }).role = isAdmin ? 'admin' : 'customer';
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'iphonehub_super_secret_session_token_32_chars_2026',
};
