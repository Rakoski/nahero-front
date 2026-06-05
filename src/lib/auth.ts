import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { authorizeUser } from "@/services/auth/login";
import { refreshAccessToken } from "@/services/auth/refresh-token";

/**
 * Reads the `exp` claim (seconds) from a JWT and returns it as an epoch in ms.
 * Returns 0 when the token is missing or unparseable, which forces a refresh.
 */
function getAccessTokenExpiry(token?: string): number {
  if (!token) return 0;
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    return typeof payload.exp === "number" ? payload.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

/** Refresh this many ms before the access token actually expires. */
const REFRESH_SKEW_MS = 60_000;

/**
 * Exchanges the stored refresh token for a fresh access token and returns an
 * updated JWT. On failure the token is flagged with `error` so the client can
 * sign the user out.
 */
async function refreshToken(token: JWT): Promise<JWT> {
  try {
    const newAccessToken = await refreshAccessToken(
      token.refreshToken as string
    );
    if (!newAccessToken) throw new Error("Refresh endpoint returned no token");

    return {
      ...token,
      accessToken: newAccessToken,
      accessTokenExpires: getAccessTokenExpiry(newAccessToken),
      error: undefined,
    };
  } catch (error) {
    console.error("[auth] Failed to refresh access token", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        return await authorizeUser(credentials.email, credentials.password);
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/en/login" },
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in — seed the token from the authorized user.
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.roles = user.roles;
        token.accessTokenExpires = getAccessTokenExpiry(user.accessToken);
        token.error = undefined;
        return token;
      }

      // Access token still valid (with skew) — nothing to do.
      if (
        typeof token.accessTokenExpires === "number" &&
        Date.now() < token.accessTokenExpires - REFRESH_SKEW_MS
      ) {
        return token;
      }

      // Expired or about to expire — refresh proactively.
      return refreshToken(token);
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as number,
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string,
        roles: token.roles as string[],
      };
      session.error = token.error as string | undefined;
      return session;
    },
  },
};
