import { NextRequest } from "next/server";

const API_URL = process.env.API_URL;
const AUTH_USER = process.env.AUTH_USER;
const AUTH_PASS = process.env.AUTH_PASS;

async function handler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const credentials = Buffer.from(`${AUTH_USER}:${AUTH_PASS}`).toString("base64");

  const { path: pathSegments } = await params;
  const path = pathSegments.join("/");
  const targetUrl = `${API_URL}/${path}${req.nextUrl.search}`;

  const init: RequestInit = {
    method: req.method,
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
  };

  if (req.method !== "GET" && req.method !== "DELETE") {
    init.body = await req.text();
  }

  try {
    const res = await fetch(targetUrl, init);
    const data = await res.text();

    // Respostas com estes status não podem ter corpo (spec do Fetch) — passar "" faria
    // o construtor de Response rejeitar com "Invalid response status code".
    const isNullBodyStatus = res.status === 204 || res.status === 205 || res.status === 304;

    return new Response(isNullBodyStatus ? null : data, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
    });
  } catch {
    return Response.json(
      { message: "Não foi possível contactar o servidor. Tenta novamente mais tarde." },
      { status: 502 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;