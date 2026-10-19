import { create } from "zustand";

type CaptchaState = {
  open: boolean;
  resolve: ((token: string) => void) | null;
  reject: ((reason: Error) => void) | null;
};

export const useCaptchaStore = create<CaptchaState>(() => ({
  open: false,
  resolve: null,
  reject: null,
}));

export function requestCaptchaToken(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    useCaptchaStore.setState({ open: true, resolve, reject });
  });
}

export function solveCaptcha(token: string) {
  const { resolve } = useCaptchaStore.getState();
  useCaptchaStore.setState({ open: false, resolve: null, reject: null });
  resolve?.(token);
}

export function dismissCaptcha() {
  const { reject } = useCaptchaStore.getState();
  useCaptchaStore.setState({ open: false, resolve: null, reject: null });
  reject?.(new Error("Captcha dismissed"));
}
