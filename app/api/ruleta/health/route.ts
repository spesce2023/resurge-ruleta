import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic";

// Diagnóstico: dice si Redis está configurado y si responde, sin exponer
// credenciales. Sin reintentos para ver el error real y rápido.
export async function GET() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return NextResponse.json({ configurado: false });

  const redis = new Redis({ url, token, retry: false });
  const t0 = Date.now();
  try {
    const respuesta = await redis.ping();
    return NextResponse.json({ configurado: true, ok: true, respuesta, ms: Date.now() - t0 });
  } catch (e) {
    const err = e as Error & { cause?: { code?: string } };
    return NextResponse.json({
      configurado: true,
      ok: false,
      ms: Date.now() - t0,
      error: `${err.name}: ${err.message}`,
      codigoRed: err.cause?.code ?? null,
    });
  }
}
