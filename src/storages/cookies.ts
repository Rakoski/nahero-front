import { parse } from "cookie";

export function setCookie(name: string, value: string, days: number) {
  if (typeof window === "undefined") return false;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires.toUTCString()}; path=/`;
}

export function removeCookie(name: string) {
  if (typeof window === "undefined") return false;

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export function existCookie(name: string) {
  if (typeof window === "undefined") return false;
  return !!getCookie(name);
}

export function getCookie(name: string) {
  if (typeof window === "undefined") return false;

  const cookies = window.document.cookie;
  const parsedCookies = cookies ? parse(cookies) : {};
  const token = parsedCookies[name];

  if (!token) return undefined;

  return token;
}
