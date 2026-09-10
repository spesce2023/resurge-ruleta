import { Redis } from "@upstash/redis";
import { estadoInicial } from "./storage";
import type { RuletaState } from "./types";

const KEY = "resurge-ruleta-state-v1";

// Soporta tanto el nombrado clásico de Vercel KV como el nativo de Upstash,
// según cómo haya quedado conectada la integración de Redis en Vercel.
function crearCliente(): Redis | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const redis = crearCliente();

// Fallback en memoria para desarrollo local sin Redis configurado. En
// producción esto NO persiste entre invocaciones serverless: hace falta
// conectar una integración de Redis (Vercel Marketplace) al proyecto para
// que el estado se comparta de verdad entre la tablet y otros dispositivos.
let memoryState: RuletaState | null = null;

export async function readState(): Promise<RuletaState> {
  if (redis) {
    try {
      const state = await redis.get<RuletaState>(KEY);
      return state ?? estadoInicial();
    } catch {
      // conexión caída: se sigue al fallback en memoria de esta instancia
    }
  }
  if (!memoryState) memoryState = estadoInicial();
  return memoryState;
}

export async function writeState(state: RuletaState): Promise<void> {
  if (redis) {
    try {
      await redis.set(KEY, state);
      return;
    } catch {
      // conexión caída: se sigue al fallback en memoria de esta instancia
    }
  }
  memoryState = state;
}
