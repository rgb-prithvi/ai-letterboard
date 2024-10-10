import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare, hash } from 'bcrypt';
import { supabase } from '@/lib/supabase';

// Define salt rounds
const SALT_ROUNDS = 12;

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Use the shared supabase client
        const { data: user, error } = await supabase
          .from('AUTH_USER')
          .select('*')
          .eq('email', credentials.email)
          .single();

        if (!user || !user[0]) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user[0].password_hash);

        if (!isPasswordValid) {
          return null;
        }

        return { 
          id: user[0].auth_user_id.toString(),
          email: user[0].email,
          name: user[0].name
        };
      }
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.uid;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
};