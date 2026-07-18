import axios from "axios";

/**
 * Extrai uma mensagem de erro legível de uma falha de chamada à API.
 * Suporta tanto as respostas de erro customizadas do backend ({ message })
 * como as respostas automáticas de validação do ASP.NET Core ({ errors: { Campo: [...] } }).
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: Record<string, string[]> }
      | undefined;

    if (data?.message) return data.message;

    if (data?.errors) {
      const messages = Object.values(data.errors).flat();
      if (messages.length > 0) return messages.join(" ");
    }
  }

  return fallback;
}
