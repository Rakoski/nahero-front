import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { BackendErrorResponse } from "@/types/api-error";

const ERROR_TITLES: Record<string, { en: string; pt: string }> = {
  SERVER: { en: "Server Error", pt: "Erro no Servidor" },
  NETWORK: { en: "Network Error", pt: "Erro de Conexão" },
};

export function getLangFromPathname(): "pt" | "en" {
  if (typeof window === "undefined") return "en";
  const pathname = window.location.pathname;
  return pathname.startsWith("/pt") ? "pt" : "en";
}

const SERVER_ERROR_PATTERN = /status code 5\d\d|network error|fetch failed|econnrefused/i;

export function isServerError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    if (!error.response) return true;
    return error.response.status >= 500;
  }
  if (error instanceof Error) return SERVER_ERROR_PATTERN.test(error.message);
  return true;
}

export function getErrorMessage(error: unknown): string {
  const lang = getLangFromPathname();
  const isPt = lang === "pt";

  if (error instanceof AxiosError && error.response) {
    const data = error.response.data as BackendErrorResponse | undefined;
    if (data?.error) return data.error;

    switch (error.response.status) {
      case 401:
        return isPt
          ? "Sessão expirada. Faça login novamente."
          : "Session expired. Please login again.";
      case 403:
        return isPt ? "Sem permissão." : "You do not have permission.";
      case 429:
        return isPt
          ? "Aguarde alguns minutos e tente novamente."
          : "Please wait a few minutes and try again.";
      case 500:
        return isPt ? "Erro interno no servidor." : "Internal server error.";
    }
  }

  if (isServerError(error)) {
    return isPt
      ? "Não foi possível conectar ao servidor."
      : "Unable to connect to the server.";
  }

  if (error instanceof Error && error.message.includes("401")) {
    return isPt ? "Email ou senha incorretos." : "Invalid email or password.";
  }

  return isPt ? "Um erro inesperado ocorreu." : "Something unexpected happened.";
}

function getErrorTitle(error: unknown): string {
  const lang = getLangFromPathname();
  if (error instanceof AxiosError && error.response) {
    return ERROR_TITLES.SERVER[lang];
  }
  return ERROR_TITLES.NETWORK[lang];
}

export function handleError(error: unknown) {
  console.error("Handling error:", error);

  if (!isServerError(error)) return;

  showErrorToast(getErrorTitle(error), getErrorMessage(error));
}

function showErrorToast(title: string, message: string) {
  if (typeof window === "undefined") {
    console.error(`[error] ${title}: ${message}`);
    return;
  }
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="shrink-0 pt-0.5">
              <svg
                className="h-10 w-10 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">{title}</p>
              <p className="mt-1 text-sm text-gray-500">{message}</p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    ),
    {
      id: `${title}:${message}`,
      duration: 5000,
      position: "bottom-right",
    }
  );
}
