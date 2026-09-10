import type { Casillero, Config, PremioMayorDef, PremioNormalDef } from "./types";

export const PREMIOS_MAYORES: PremioMayorDef[] = [
  { id: "merienda", nombre: "Merienda para dos" },
  { id: "merienda-resurge", nombre: "Merienda ReSurge para dos" },
  { id: "brunch", nombre: "Brunch para dos" },
];

export const PREMIOS_NORMALES: PremioNormalDef[] = [
  { id: "americano-medialuna", nombre: "Americano y medialuna" },
  { id: "capuchino-tostado", nombre: "Capuchino y tostado" },
  { id: "postre-individual", nombre: "Postre individual a elección" },
  { id: "dos-bebidas-calientes", nombre: "2 bebidas calientes a elección" },
  { id: "bebida-eleccion", nombre: "Bebida a elección" },
  { id: "scon", nombre: "Scón" },
];

export const DEFAULT_CONFIG: Config = {
  probabilidadPremioMayor: 5,
  probabilidadPremioNormal: 50,
};

export const TOTAL_CASILLEROS = 18;
export const SLICE_ANGLE = 360 / TOTAL_CASILLEROS;

// Distribución fija de los 18 casilleros de la ruleta (3 mayores / 9 normales / 6 vacíos).
// Ajustable a futuro: es la propuesta 3/9/6 marcada como pendiente de confirmación en el
// documento de análisis (sección 1.3 / 10.1). Los 9 casilleros normales están repartidos de
// forma desigual entre los 6 tipos (2/2/2/1/1/1) a modo de ejemplo de ponderación (sección 7.9).
export const CASILLEROS: Casillero[] = [
  { index: 0, categoria: { tipo: "mayor", premioId: "merienda" } },
  { index: 1, categoria: { tipo: "normal", premioId: "americano-medialuna" } },
  { index: 2, categoria: { tipo: "vacio" } },
  { index: 3, categoria: { tipo: "normal", premioId: "americano-medialuna" } },
  { index: 4, categoria: { tipo: "normal", premioId: "capuchino-tostado" } },
  { index: 5, categoria: { tipo: "vacio" } },
  { index: 6, categoria: { tipo: "mayor", premioId: "merienda-resurge" } },
  { index: 7, categoria: { tipo: "normal", premioId: "capuchino-tostado" } },
  { index: 8, categoria: { tipo: "vacio" } },
  { index: 9, categoria: { tipo: "normal", premioId: "postre-individual" } },
  { index: 10, categoria: { tipo: "normal", premioId: "postre-individual" } },
  { index: 11, categoria: { tipo: "vacio" } },
  { index: 12, categoria: { tipo: "mayor", premioId: "brunch" } },
  { index: 13, categoria: { tipo: "normal", premioId: "dos-bebidas-calientes" } },
  { index: 14, categoria: { tipo: "vacio" } },
  { index: 15, categoria: { tipo: "normal", premioId: "bebida-eleccion" } },
  { index: 16, categoria: { tipo: "normal", premioId: "scon" } },
  { index: 17, categoria: { tipo: "vacio" } },
];

export const COLOR_MAYOR = "#B5652E";
export const COLOR_NORMAL = "#6E7F52";
export const COLOR_VACIO = "#E4D9C3";

// Credenciales del panel admin. Un solo usuario, sin roles (sección 5.1 del análisis).
// Cambiar antes de poner la tablet en producción.
export const ADMIN_CREDENCIALES = {
  usuario: "ruleta",
  password: "ruletaresurge",
};

export const SPIN_DURATION_MS = 4200;
export const RESULT_DISPLAY_MS = 6000;
export const SPIN_EXTRA_TURNS = 6;
