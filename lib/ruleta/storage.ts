import { DEFAULT_CONFIG, PREMIOS_MAYORES, PREMIOS_NORMALES } from "./constants";
import type { RuletaState } from "./types";

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

// Reconcilia un estado ya guardado (en Redis) contra el catálogo de premios
// ACTUAL. Si se saca o cambia un premio del catálogo, los datos guardados
// de un premio que ya no existe se descartan en vez de quedar arrastrados
// para siempre como una clave "huérfana" que igual sumaría en los totales.
export function normalizarEstado(raw: Partial<RuletaState> | null | undefined): RuletaState {
  const base = estadoInicial();
  if (!raw) return base;

  const forzadoValido =
    typeof raw.forzado === "string" && raw.forzado in base.premiosMayores
      ? (raw.forzado as RuletaState["forzado"])
      : null;

  return {
    version: 1,
    premiosMayores: Object.fromEntries(
      PREMIOS_MAYORES.map((p) => [p.id, raw.premiosMayores?.[p.id] ?? "disponible"])
    ) as RuletaState["premiosMayores"],
    forzado: forzadoValido,
    config: { ...base.config, ...raw.config },
    contadores: {
      girosTotales: raw.contadores?.girosTotales ?? 0,
      premiosNormales: Object.fromEntries(
        PREMIOS_NORMALES.map((p) => [p.id, raw.contadores?.premiosNormales?.[p.id] ?? 0])
      ) as RuletaState["contadores"]["premiosNormales"],
      vacios: raw.contadores?.vacios ?? 0,
    },
  };
}
