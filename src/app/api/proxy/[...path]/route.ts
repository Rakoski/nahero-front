import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NAHERO_API } from "@/constants/nahero-api";

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL_JAVA;

const TOKEN_SKEW_MS = 60_000;

const STRIPPED_REQUEST_HEADERS = new Set([
  "host",
  "connection",
  "cookie",
  "content-length",
  "transfer-encoding",
]);

async function resolveAccessToken(req: NextRequest): Promise<string | null> {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) return null;

  const accessToken = token.accessToken as string | undefined;
  const refreshToken = token.refreshToken as string | undefined;
  const expires = token.accessTokenExpires as number | undefined;

  const isFresh =
    !!accessToken &&
    typeof expires === "number" &&
    Date.now() < expires - TOKEN_SKEW_MS;

  if (isFresh) return accessToken;

  if (refreshToken && API_URL) {
    try {
      const res = await fetch(`${API_URL}${NAHERO_API.AUTH.REFRESH_TOKEN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.accessToken) return data.accessToken;
      }
    } catch {
      return accessToken ?? null;
    }
  }

  return accessToken ?? null;
}

async function handler(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  if (!API_URL) {
    return NextResponse.json(
      { message: "Backend API URL is not configured" },
      { status: 500 },
    );
  }

  const { path } = await context.params;
  const targetUrl = `${API_URL}/${path.join("/")}${req.nextUrl.search}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!STRIPPED_REQUEST_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  const accessToken = await resolveAccessToken(req);
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const body = hasBody ? await req.arrayBuffer() : undefined;

  const upstream = await fetch(targetUrl, {
    method: req.method,
    headers,
    body: body && body.byteLength > 0 ? body : undefined,
    redirect: "manual",
  });

  const responseHeaders = new Headers();
  const contentType = upstream.headers.get("content-type");
  if (contentType) responseHeaders.set("Content-Type", contentType);

  const isNullBodyStatus =
    upstream.status === 204 ||
    upstream.status === 205 ||
    upstream.status === 304;

  const responseBody = isNullBodyStatus ? null : await upstream.arrayBuffer();

  return new NextResponse(responseBody, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
