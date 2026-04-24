import NextAuth, { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin',
      credentials: {
        username: { label: 'Utilisateur', type: 'text' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        const ADMIN_USER = process.env.ADMIN_USERNAME ?? 'admin';
        const ADMIN_PASS = process.env.ADMIN_PASSWORD ?? 'admin1234';

        if (
          credentials?.username === ADMIN_USER &&
          credentials?.password === ADMIN_PASS
        ) {
          return { id: '1', name: 'Administrateur', role: 'admin' } as User & { role: string };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as User & { role: string }).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as typeof session.user & { role: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET ?? 'mon-secret-dev-change-moi',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };