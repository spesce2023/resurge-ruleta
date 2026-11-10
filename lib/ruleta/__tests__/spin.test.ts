import { describe, expect, it } from "vitest";
import { GIRO_LIBRE_GRADOS_POR_SEG, GIRO_MIN_FRENADO_GRADOS, SLICE_ANGLE, TOTAL_CASILLEROS } from "../constants";
import { calcularFrenado, calcularFrenadoSuave } from "../spin";

function mod360(n: number) {
  return ((n % 360) + 360) % 360;
}

describe("calcularFrenado", () => {
  it("deja el centro del gajo elegido justo bajo el puntero, desde cualquier ángulo", () => {
    for (const anguloActual of [0, 13.7, 359.9, 1234.5, 98765.4321]) {
      for (let casillero = 0; casillero < TOTAL_CASILLEROS; casillero++) {
        const { delta } = calcularFrenado(anguloActual, casillero);
        const centro = casillero * SLICE_ANGLE + SLICE_ANGLE / 2;
        const posicionFinal = mod360(centro + anguloActual + delta);
        const distanciaAlPuntero = Math.min(posicionFinal, 360 - posicionFinal);
        expect(distanciaAlPuntero).toBeLessThan(1e-6);
      }
    }
  });

  it("siempre recorre al menos el mínimo de frenado y menos de una vuelta de más", () => {
    for (const anguloActual of [0, 90, 200.3, 719.99]) {
      for (let casillero = 0; casillero < TOTAL_CASILLEROS; casillero++) {
        const { delta } = calcularFrenado(anguloActual, casillero);
        expect(delta).toBeGreaterThanOrEqual(GIRO_MIN_FRENADO_GRADOS);
        expect(delta).toBeLessThan(GIRO_MIN_FRENADO_GRADOS + 360);
      }
    }
  });

  it("la velocidad inicial del frenado coincide con la del giro libre", () => {
    const { delta, durMs } = calcularFrenado(42, 5);
    const velocidadInicialGradosPorSeg = ((3 * delta) / durMs) * 1000;
    expect(velocidadInicialGradosPorSeg).toBeCloseTo(GIRO_LIBRE_GRADOS_POR_SEG, 6);
  });
});

describe("calcularFrenadoSuave", () => {
  it("también arranca a la velocidad del giro libre", () => {
    const { delta, durMs } = calcularFrenadoSuave();
    expect(((3 * delta) / durMs) * 1000).toBeCloseTo(GIRO_LIBRE_GRADOS_POR_SEG, 6);
  });
});
