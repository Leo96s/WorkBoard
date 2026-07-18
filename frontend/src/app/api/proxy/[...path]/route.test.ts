import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET, PATCH, PUT, DELETE } from "./route";

function makeRequest(method: string, path: string[], body?: unknown) {
  const req = new NextRequest(`http://localhost:3000/api/proxy/${path.join("/")}`, {
    method,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return { req, params: Promise.resolve({ path }) };
}

describe("proxy route handler", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("devolve 204 sem corpo quando o backend responde 204 (regressão: Response não pode ter corpo com status 204)", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 204 })));

    const { req, params } = makeRequest("PATCH", ["Tasks", "1", "move"], { newColumnId: "2" });
    const res = await PATCH(req, { params });

    expect(res.status).toBe(204);
  });

  it("devolve 204 sem corpo para PUT (update) quando o backend responde 204", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 204 })));

    const { req, params } = makeRequest("PUT", ["Tasks", "1"], { title: "x" });
    const res = await PUT(req, { params });

    expect(res.status).toBe(204);
  });

  it("devolve 204 sem corpo para DELETE quando o backend responde 204", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 204 })));

    const { req, params } = makeRequest("DELETE", ["Tasks", "1"]);
    const res = await DELETE(req, { params });

    expect(res.status).toBe(204);
  });

  it("repassa o corpo e status quando o backend responde com sucesso e corpo JSON", async () => {
    const payload = { id: "1", title: "Tarefa" };
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify(payload), { status: 200, headers: { "Content-Type": "application/json" } }))
    );

    const { req, params } = makeRequest("GET", ["Tasks", "1"]);
    const res = await GET(req, { params });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual(payload);
  });

  it("repassa erros do backend (ex: 400) sem cair no catch de 502", async () => {
    const payload = { message: "Board não encontrado." };
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify(payload), { status: 400, headers: { "Content-Type": "application/json" } }))
    );

    const { req, params } = makeRequest("PUT", ["Tasks", "1"], { title: "x" });
    const res = await PUT(req, { params });
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data).toEqual(payload);
  });

  it("devolve 502 com mensagem quando o backend está inacessível", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("connection refused");
      })
    );

    const { req, params } = makeRequest("GET", ["boards"]);
    const res = await GET(req, { params });
    const data = await res.json();

    expect(res.status).toBe(502);
    expect(data.message).toBeTruthy();
  });
});
