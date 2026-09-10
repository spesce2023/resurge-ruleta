import { describe, expect, it } from "vitest";
import {
  actualizarConfig,
  aplicarResultado,
  confirmarEntrega,
  determinarResultado,
  forzarPremio,
  premiosMayoresDisponibles,
  revertirADisponible,
} from "../engine";
import { estadoInicial } from "../storage";

function rngSecuencia(valores: number[]): () => number {
  let i = 0;
  return () => valores[Math.min(i++, valores.length - 1)];
}

describe("determinarResultado", () => {
  it("el forzado siempre gana, sin importar la probabilidad", () => {
    const state = forzarPremio(estadoInicial(), "brunch");
    // rng(0) haría ganar cualquier probabilidad orgánica si se evaluara
    const resultado = determinarResultado(state, rngSecuencia([0, 0, 0]));
    expect(resultado).toEqual({ tipo: "mayor", premioId: "brunch", casilleroIndex: 12 });
  });

  it("no evalúa premio mayor orgánico si no hay ninguno disponible", () => {
    let state = estadoInicial();
    state = confirmarEntrega(forzarYConfirmar(state, "merienda"), "merienda");
    state = confirmarEntrega(forzarYConfirmar(state, "merienda-resurge"), "merienda-resurge");
    state = confirmarEntrega(forzarYConfirmar(state, "brunch"), "brunch");
    expect(premiosMayoresDisponibles(state)).toEqual([]);

    // rng(0) ganaría el sorteo de premio mayor (5%) si se llegara a evaluar
    const resultado = determinarResultado(state, rngSecuencia([0, 0.9, 0]));
    expect(resultado.tipo).not.toBe("mayor");
  });

  it("sortea premio mayor orgánico solo cuando el roll cae bajo la probabilidad configurada", () => {
    const state = estadoInicial(); // probabilidadPremioMayor default 5%
    const gana = determinarResultado(state, rngSecuencia([0.04, 0]));
    expect(gana.tipo).toBe("mayor");

    const pierde = determinarResultado(state, rngSecuencia([0.06, 0.9]));
    expect(pierde.tipo).not.toBe("mayor");
  });

  it("selecciona premio normal ponderado por cantidad de casilleros", () => {
    const state = estadoInicial();
    // rng para el paso normal/vacío: bajo probabilidadPremioNormal (50%) -> normal
    // rng para elegir el casillero normal específico: índice 0 de los 9 normales
    const resultado = determinarResultado(state, rngSecuencia([0.9, 0.1, 0]));
    expect(resultado.tipo).toBe("normal");
  });

  it("resultado vacío cuando falla el sorteo de premio normal", () => {
    const state = estadoInicial();
    const resultado = determinarResultado(state, rngSecuencia([0.9, 0.9, 0]));
    expect(resultado.tipo).toBe("vacio");
  });
});

describe("aplicarResultado", () => {
  it("incrementa giros totales y el contador correspondiente", () => {
    const state = estadoInicial();
    const next = aplicarResultado(state, { tipo: "vacio", casilleroIndex: 2 });
    expect(next.contadores.girosTotales).toBe(1);
    expect(next.contadores.vacios).toBe(1);
    expect(state.contadores.girosTotales).toBe(0); // no muta el original
  });

  it("un premio mayor ganado queda pendiente de entrega, no disponible", () => {
    const state = estadoInicial();
    const next = aplicarResultado(state, { tipo: "mayor", premioId: "brunch", casilleroIndex: 12 });
    expect(next.premiosMayores.brunch).toBe("pendiente");
    expect(premiosMayoresDisponibles(next)).not.toContain("brunch");
  });

  it("consume el forzado tras aplicarse el resultado", () => {
    const forzado = forzarPremio(estadoInicial(), "merienda");
    const next = aplicarResultado(forzado, { tipo: "mayor", premioId: "merienda", casilleroIndex: 0 });
    expect(next.forzado).toBeNull();
  });
});

describe("ciclo de vida de un premio mayor", () => {
  it("disponible -> pendiente -> entregado, y no puede forzarse ni revertirse fuera de esos estados", () => {
    let state = estadoInicial();
    state = forzarPremio(state, "merienda");
    state = aplicarResultado(state, determinarResultado(state));
    expect(state.premiosMayores.merienda).toBe("pendiente");

    // no se puede forzar un premio que no está disponible
    const intentoForzar = forzarPremio(state, "merienda");
    expect(intentoForzar.forzado).toBeNull();

    state = confirmarEntrega(state, "merienda");
    expect(state.premiosMayores.merienda).toBe("entregado");

    // no se puede revertir un premio ya entregado
    const intentoRevertir = revertirADisponible(state, "merienda");
    expect(intentoRevertir.premiosMayores.merienda).toBe("entregado");
  });
});

describe("actualizarConfig", () => {
  it("clampea los valores entre 0 y 100", () => {
    const state = estadoInicial();
    const next = actualizarConfig(state, { probabilidadPremioMayor: 150, probabilidadPremioNormal: -10 });
    expect(next.config.probabilidadPremioMayor).toBe(100);
    expect(next.config.probabilidadPremioNormal).toBe(0);
  });
});

function forzarYConfirmar(state: ReturnType<typeof estadoInicial>, premioId: "merienda" | "merienda-resurge" | "brunch") {
  const forzado = forzarPremio(state, premioId);
  return aplicarResultado(forzado, { tipo: "mayor", premioId, casilleroIndex: 0 });
}
