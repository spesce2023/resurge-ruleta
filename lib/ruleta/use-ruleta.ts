"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Config, PremioMayorId, ResultadoGiro, RuletaState } from "./types";

// El estado vive en el servidor (Vercel KV) para que la tablet y otros
// dispositivos (ej. el celular del dueño) vean los mismos datos. Este poll
// es lo que le da a un segundo dispositivo una vista "casi en vivo" de lo
// que pasa en la tablet, sin necesidad de websockets.
const POLL_MS = 4000;

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Error de red (${res.status})`);
  return res.json() as Promise<T>;
}

export function useRuleta() {
  const [state, setState] = useState<RuletaState | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval>>();

  const refrescar = useCallback(async () => {
    try {
      const s = await api<RuletaState>("/api/ruleta/state");
      setState(s);
    } catch {
      // red intermitente: se reintenta solo en el próximo poll
    }
  }, []);

  useEffect(() => {
    refrescar();
    pollRef.current = setInterval(refrescar, POLL_MS);
    return () => clearInterval(pollRef.current);
  }, [refrescar]);

  // El servidor determina y persiste el resultado antes de responder (caso
  // borde 7.4): si la tablet se queda sin conexión a mitad de la animación,
  // el giro ya quedó registrado y no se pierde ni se puede repetir.
  const girar = useCallback(async (): Promise<ResultadoGiro | null> => {
    try {
      const { resultado, state: next } = await api<{ resultado: ResultadoGiro; state: RuletaState }>(
        "/api/ruleta/girar",
        { method: "POST" }
      );
      setState(next);
      return resultado;
    } catch {
      return null;
    }
  }, []);

  const forzar = useCallback(async (premioId: PremioMayorId) => {
    const next = await api<RuletaState>("/api/ruleta/forzar", {
      method: "POST",
      body: JSON.stringify({ premioId }),
    });
    setState(next);
  }, []);

  const cancelarForzado = useCallback(async () => {
    const next = await api<RuletaState>("/api/ruleta/cancelar-forzado", { method: "POST" });
    setState(next);
  }, []);

  const confirmar = useCallback(async (premioId: PremioMayorId) => {
    const next = await api<RuletaState>("/api/ruleta/confirmar", {
      method: "POST",
      body: JSON.stringify({ premioId }),
    });
    setState(next);
  }, []);

  const revertir = useCallback(async (premioId: PremioMayorId) => {
    const next = await api<RuletaState>("/api/ruleta/revertir", {
      method: "POST",
      body: JSON.stringify({ premioId }),
    });
    setState(next);
  }, []);

  const cambiarConfig = useCallback(async (config: Partial<Config>) => {
    const next = await api<RuletaState>("/api/ruleta/config", {
      method: "POST",
      body: JSON.stringify(config),
    });
    setState(next);
  }, []);

  const resetear = useCallback(async () => {
    const next = await api<RuletaState>("/api/ruleta/reset", { method: "POST" });
    setState(next);
  }, []);

  return {
    state,
    listo: state !== null,
    girar,
    forzar,
    cancelarForzado,
    confirmar,
    revertir,
    cambiarConfig,
    resetear,
  };
}
