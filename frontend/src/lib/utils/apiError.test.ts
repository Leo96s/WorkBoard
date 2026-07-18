import { describe, expect, it } from "vitest";
import { getErrorMessage } from "./apiError";

function makeAxiosError(status: number, data: unknown) {
  return Object.assign(new Error("Request failed"), {
    isAxiosError: true,
    response: { status, data },
  });
}

describe("getErrorMessage", () => {
  it("usa a mensagem customizada do backend quando existe ({ message })", () => {
    const error = makeAxiosError(400, { message: "Board não encontrado." });
    expect(getErrorMessage(error, "fallback")).toBe("Board não encontrado.");
  });

  it("junta as mensagens de validação automática do ASP.NET Core ({ errors })", () => {
    const error = makeAxiosError(400, {
      errors: {
        Title: ["The Title field is required.", "Max length is 200."],
        AssignedTo: ["Max length is 100."],
      },
    });
    const message = getErrorMessage(error, "fallback");
    expect(message).toContain("The Title field is required.");
    expect(message).toContain("Max length is 200.");
    expect(message).toContain("Max length is 100.");
  });

  it("usa a mensagem de fallback quando o erro não é da API (ex: erro de rede)", () => {
    expect(getErrorMessage(new Error("Network Error"), "fallback")).toBe("fallback");
  });

  it("usa a mensagem de fallback quando a resposta não tem message nem errors", () => {
    const error = makeAxiosError(500, {});
    expect(getErrorMessage(error, "fallback")).toBe("fallback");
  });
});
