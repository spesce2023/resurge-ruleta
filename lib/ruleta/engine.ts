import { CASILLEROS, PREMIOS_MAYORES } from "./constants";
import type {
  CasilleroCategoria,
  Config,
  PremioMayorId,
  ResultadoGiro,
  RuletaState,
} from "./types";

function mismaCategoria(a: CasilleroCategoria, b: CasilleroCategoria): boolean {
  if (a.tipo !== b.tipo) return false;
  if (a.tipo === "mayor" && b.tipo === "mayor") return a.premioId === b.premioId;
  if (a.tipo === "normal" && b.tipo === "normal") return a.premioId === b.premioId;
  return true;
}

function elegirCasillero(categoria: CasilleroCategoria, rng: () => number): number {
  const candidatos = CASILLEROS.filter((c) => mismaCategoria(c.categoria, categoria));
  return candidatos[Math.floor(rng() * candidatos.length)].index;
}

export function premiosMayoresDisponibles(state: RuletaState): PremioMayorId[] {
  return PREMIOS_MAYORES.filter((p) => state.premiosMayores[p.id] === "disponible").map(
    (p) => p.id
  );
}

// Orden de evaluación por giro (sección 4.2 del análisis funcional):
// 1) forzado por admin, 2) premio mayor orgánico (solo si hay disponibles),
// 3) premio normal vs. vacío, 4) tipo de premio normal ponderado por casilleros.
export function determinarResultado(
  state: RuletaState,
  rng: () => number = Math.random
): ResultadoGiro {
  if (state.forzado) {
    const premioId = state.forzado;
    const casilleroIndex = elegirCasillero({ tipo: "mayor", premioId }, rng);
    return { tipo: "mayor", premioId, casilleroIndex };
  }

  const disponibles = premiosMayoresDisponibles(state);
  if (disponibles.length > 0 && rng() * 100 < state.config.probabilidadPremioMayor) {
    const premioId = disponibles[Math.floor(rng() * disponibles.length)];
    const casilleroIndex = elegirCasillero({ tipo: "mayor", premioId }, rng);
    return { tipo: "mayor", premioId, casilleroIndex };
  }

  if (rng() * 100 < state.config.probabilidadPremioNormal) {
    const casillerosNormales = CASILLEROS.filter((c) => c.categoria.tipo === "normal");
    const elegido = casillerosNormales[Math.floor(rng() * casillerosNormales.length)];
    const categoria = elegido.categoria as { tipo: "normal"; premioId: import("./types").PremioNormalId };
    return { tipo: "normal", premioId: categoria.premioId, casilleroIndex: elegido.index };
  }

  const casilleroIndex = elegirCasillero({ tipo: "vacio" }, rng);
  return { tipo: "vacio", casilleroIndex };
}

export function aplicarResultado(state: RuletaState, resultado: ResultadoGiro): RuletaState {
  const next: RuletaState = {
    ...state,
    forzado: null,
    premiosMayores: { ...state.premiosMayores },
    contadores: {
      ...state.contadores,
      premiosNormales: { ...state.contadores.premiosNormales },
      girosTotales: state.contadores.girosTotales + 1,
    },
  };

  if (resultado.tipo === "mayor") {
    next.premiosMayores[resultado.premioId] = "pendiente";
  } else if (resultado.tipo === "normal") {
    next.contadores.premiosNormales[resultado.premioId] += 1;
  } else {
    next.contadores.vacios += 1;
  }

  return next;
}

export function forzarPremio(state: RuletaState, premioId: PremioMayorId): RuletaState {
  if (state.premiosMayores[premioId] !== "disponible") return state;
  return { ...state, forzado: premioId };
}

export function cancelarForzado(state: RuletaState): RuletaState {
  return { ...state, forzado: null };
}

export function confirmarEntrega(state: RuletaState, premioId: PremioMayorId): RuletaState {
  if (state.premiosMayores[premioId] !== "pendiente") return state;
  return {
    ...state,
    premiosMayores: { ...state.premiosMayores, [premioId]: "entregado" },
  };
}

export function revertirADisponible(state: RuletaState, premioId: PremioMayorId): RuletaState {
  if (state.premiosMayores[premioId] !== "pendiente") return state;
  return {
    ...state,
    premiosMayores: { ...state.premiosMayores, [premioId]: "disponible" },
  };
}

export function actualizarConfig(state: RuletaState, config: Partial<Config>): RuletaState {
  const clamp = (n: number) => Math.min(100, Math.max(0, n));
  return {
    ...state,
    config: {
      probabilidadPremioMayor: clamp(config.probabilidadPremioMayor ?? state.config.probabilidadPremioMayor),
      probabilidadPremioNormal: clamp(config.probabilidadPremioNormal ?? state.config.probabilidadPremioNormal),
    },
  };
}
