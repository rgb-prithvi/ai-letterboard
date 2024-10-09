import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { db } from '@/lib/db'; // You'll need to create this database connection

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

        const user = await db.query(
          'SELECT * FROM USER WHERE email = ?',
          [credentials.email]
        );

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