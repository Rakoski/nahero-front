import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { BackendErrorResponse } from "@/types/api-error";

// Simple Dictionary for TITLES (Client-side only)
const ERROR_TITLES: Record<string, { en: string; pt: string }> = {
  VALIDATION: { en: "Validation Error", pt: "Erro de Validação" },
  AUTH: { en: "Authentication Failed", pt: "Falha na Autenticação" },
  DENIED: { en: "Access Denied", pt: "Acesso Negado" },
  NOT_FOUND: { en: "Not Found", pt: "Não Encontrado" },
  DUPLICATE: { en: "Duplicate Entry", pt: "Registro Duplicado" },
  SERVER: { en: "Server Error", pt: "Erro no Servidor" },
  NETWORK: { en: "Network Error", pt: "Erro de Conexão" },
  DEFAULT: { en: "Error", pt: "Erro" },
};

export function handleError(error: unknown) {
  const isPt =
    typeof window !== "undefined" ? navigator.language.startsWith("pt") : false;

  const lang = isPt ? "pt" : "en";

  let message = "";
  let title = ERROR_TITLES.DEFAULT[lang];

  if (error instanceof AxiosError && error.response) {
    const data = error.response.data as BackendErrorResponse;
    const status = error.response.status;

    if (data.error) message = data.error;

    switch (status) {
      case 400:
      case 412:
        title = ERROR_TITLES.VALIDATION[lang];
        break;
      case 401:
        title = ERROR_TITLES.AUTH[lang];
        if (!message)
          message = isPt
            ? "Sessão expirada. Faça login novamente."
            : "Session expired. Please login again.";
        break;
      case 403:
        title = ERROR_TITLES.DENIED[lang];
        if (!message)
          message = isPt ? "Sem permissão." : "You do not have permission.";
        break;
      case 404:
        title = ERROR_TITLES.NOT_FOUND[lang];
        break;
      case 409:
        title = ERROR_TITLES.DUPLICATE[lang];
        break;
      case 500:
        title = ERROR_TITLES.SERVER[lang];
        if (!message)
          message = isPt
            ? "Erro interno no servidor."
            : "Internal server error.";
        break;
    }
  } else if (error instanceof Error) {
    message = error.message;
  } else {
    message = isPt
      ? "Não foi possível conectar ao servidor."
      : "Unable to connect to the server.";
    title = ERROR_TITLES.NETWORK[lang];
  }

  showErrorToast(title, message);
}

function showErrorToast(title: string, message: string) {
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
      duration: 5000,
      position: "top-center",
    }
  );
}
