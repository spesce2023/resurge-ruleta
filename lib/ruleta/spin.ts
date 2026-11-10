import {
  FRENADO_ERROR_MS,
  GIRO_LIBRE_GRADOS_POR_SEG,
  GIRO_MIN_FRENADO_GRADOS,
  SLICE_ANGLE,
} from "./constants";

const GRADOS_POR_MS = GIRO_LIBRE_GRADOS_POR_SEG / 1000;

function mod360(n: number): number {
  return ((n % 360) + 360) % 360;
}

// El frenado usa ease-out cúbico: p(t) = delta · (1 − (1 − t)³). Su velocidad
// inicial es 3·delta / durMs, así que con durMs = 3·delta / velocidadLibre la
// rueda frena sin ningún salto respecto del giro libre previo.
export function calcularFrenado(anguloActual: number, casilleroIndex: number) {
  const centroDelGajo = casilleroIndex * SLICE_ANGLE + SLICE_ANGLE / 2;
  const hastaAlinear = mod360(mod360(360 - centroDelGajo) - mod360(anguloActual));
  const vueltasExtra = Math.max(0, Math.ceil((GIRO_MIN_FRENADO_GRADOS - hastaAlinear) / 360));
  const delta = hastaAlinear + vueltasExtra * 360;
  return { delta, durMs: (3 * delta) / GRADOS_POR_MS };
}

// Frenado corto y sin destino, para cuando falla la conexión con el servidor.
export function calcularFrenadoSuave() {
  const durMs = FRENADO_ERROR_MS;
  return { delta: (GRADOS_POR_MS * durMs) / 3, durMs };
}
