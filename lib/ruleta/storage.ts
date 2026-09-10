import { DEFAULT_CONFIG, PREMIOS_MAYORES, PREMIOS_NORMALES } from "./constants";
import type { RuletaState } from "./types";

const STORAGE_KEY = "resurge-ruleta-state-v1";

export function estadoInicial(): RuletaState {
  return {
    version: 1,
    premiosMayores: Object.fromEntries(
      PREMIOS_MAYORES.map((p) => [p.id, "disponible"])
    ) as RuletaState["premiosMayores"],
    forzado: null,
    config: { ...DEFAULT_CONFIG },
    contadores: {
      girosTotales: 0,
      premiosNormales: Object.fromEntries(PREMIOS_NORMALES.map((p) => [p.id, 0])) as RuletaState["contadores"]["premiosNormales"],
      vacios: 0,
    },
  };
}

export function cargarEstado(): RuletaState {
  if (typeof window === "undefined") return estadoInicial();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return estadoInicial();
    const parsed = JSON.parse(raw) as Partial<RuletaState>;
    const base = estadoInicial();
    return {
      version: 1,
      premiosMayores: { ...base.premiosMayores, ...parsed.premiosMayores },
      forzado: parsed.forzado ?? null,
      config: { ...base.config, ...parsed.config },
      contadores: {
        girosTotales: parsed.contadores?.girosTotales ?? 0,
        premiosNormales: { ...base.contadores.premiosNormales, ...parsed.contadores?.premiosNormales },
        vacios: parsed.contadores?.vacios ?? 0,
      },
    };
  } catch {
    return estadoInicial();
  }
}

export function guardarEstado(state: RuletaState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
