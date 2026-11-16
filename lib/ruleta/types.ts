export type PremioMayorId = "merienda" | "merienda-resurge" | "brunch";

export type EstadoPremioMayor = "disponible" | "pendiente" | "entregado";

export type PremioNormalId =
  | "lunch-navideno"
  | "capuchino-tostado"
  | "postre-individual"
  | "pan-dulce"
  | "scon";

export interface PremioMayorDef {
  id: PremioMayorId;
  nombre: string;
}

export interface PremioNormalDef {
  id: PremioNormalId;
  nombre: string;
  // Premio que se entrega como vale para usar cuando el cliente quiera: en la
  // pantalla de resultado NO se aclara "Para tu próxima visita".
  esVale?: boolean;
}

export type CasilleroCategoria =
  | { tipo: "mayor"; premioId: PremioMayorId }
  | { tipo: "normal"; premioId: PremioNormalId }
  | { tipo: "vacio" };

export interface Casillero {
  index: number;
  categoria: CasilleroCategoria;
}

export interface Config {
  probabilidadPremioMayor: number;
  probabilidadPremioNormal: number;
}

export interface Contadores {
  girosTotales: number;
  premiosNormales: Record<PremioNormalId, number>;
  vacios: number;
}

export interface RuletaState {
  version: number;
  premiosMayores: Record<PremioMayorId, EstadoPremioMayor>;
  forzado: PremioMayorId | null;
  config: Config;
  contadores: Contadores;
}

export type ResultadoGiro =
  | { tipo: "mayor"; premioId: PremioMayorId; casilleroIndex: number }
  | { tipo: "normal"; premioId: PremioNormalId; casilleroIndex: number }
  | { tipo: "vacio"; casilleroIndex: number };
