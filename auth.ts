import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { userService } from '@/services/user.service';

const nextAuth = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios');
        }

        const email = String(credentials.email);
        const password = String(credentials.password);
        const isValid = await userService.verifyUserPassword(email, password);

        if (!isValid) {
          throw new Error('Email ou senha incorretos');
        }

        const user = await userService.getUserByEmail(email);
        if (!user) {
          throw new Error('Usuário não encontrado');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export const handlers = nextAuth.handlers;
export const signIn = nextAuth.signIn;
export const signOut = nextAuth.signOut;
export const auth = nextAuth.auth;
