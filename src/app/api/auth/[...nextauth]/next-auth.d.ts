import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id?: number;
    accessToken?: string;
    refreshToken?: string;
    image?: string;
    avatarUrl?: string;
    roles?: string[];
  }

  interface Session {
    user: User;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    roles?: string[];
    error?: string;
  }
}
