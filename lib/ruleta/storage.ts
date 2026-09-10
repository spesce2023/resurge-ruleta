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
