import { authorizeUser } from '@/services/auth/login'
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!(credentials?.email) || !credentials?.password)
          return null

        const user = await authorizeUser(
          credentials.email,
          credentials.password,
        )

        return user
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || null
        token.image = user.avatarUrl || null
        token.name = user.name || 'Name'
        token.email = user.email || 'guest@example.com'
        token.accessToken = user.accessToken || ''
        token.refreshToken = user.refreshToken || ''
        token.roles = (user as any).roles.map((r: any) => r.name);
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as number,
        image: token.image as string,
        name: token.name as string,
        email: token.email as string,
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string,
        roles: token.roles as string[],
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
