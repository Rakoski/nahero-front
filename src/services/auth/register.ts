import { api } from "@/lib/api-manager";
import { NAHERO_API } from "@/constants/nahero-api";

const UTM_COOKIE = "nh_utm";

export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface Utm {
  source: string;
  medium: string | null;
  campaign: string | null;
}

/**
 * The tag is written by the middleware on the first visit, which can be several
 * pages before the user decides to sign up.
 */
export function readUtmCookie(): Utm | null {
  if (typeof document === "undefined") return null;

  const raw = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${UTM_COOKIE}=`))
    ?.slice(UTM_COOKIE.length + 1);

  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(raw));

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof (parsed as Utm).source !== "string"
    ) {
      return null;
    }

    return parsed as Utm;
  } catch {
    return null;
  }
}

export async function registerUser(data: RegisterUserRequest) {
  const utm = readUtmCookie();

  const payload = {
    name: data.name,
    email: data.email,
    password: data.password,
    ...(utm && { utm }),
  };

  const response = await api.post(NAHERO_API.USERS.REGISTER, payload);

  if (response.status === 201 || response.status === 200) return response.data;

  return null;
}
