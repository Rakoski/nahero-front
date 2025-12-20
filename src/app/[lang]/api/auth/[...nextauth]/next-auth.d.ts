import { DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface User extends DefaultUser {
    id?: number
    accessToken?: string
    refreshToken?: string
    image?: string
    avatarUrl?: string
    permissions?: []
    role?: []
  }

  interface Session {
    user: User
  }
}
