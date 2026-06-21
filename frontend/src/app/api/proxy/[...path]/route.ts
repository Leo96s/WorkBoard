import { NextRequest } from "next/server";

const API_URL = process.env.API_URL; // sem NEXT_PUBLIC_
const AUTH_USER = process.env.AUTH_USER;
const AUTH_PASS = process.env.AUTH_PASS;

async function handler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const credentials = Buffer.from(`${AUTH_USER}:${AUTH_PASS}`).toString("base64");

  const {path: pathSegments} = await params;
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

  const res = await fetch(targetUrl, init);
  const data = await res.text();

  return new Response(data, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
  });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};