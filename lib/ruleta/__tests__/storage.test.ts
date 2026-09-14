import { describe, expect, it } from "vitest";
import { estadoInicial, normalizarEstado } from "../storage";

describe("normalizarEstado", () => {
  it("descarta claves de premios normales que ya no existen en el catálogo", () => {
    const guardado = estadoInicial();
    // simula un estado viejo guardado en Redis con un premio ya eliminado
    (guardado.contadores.premiosNormales as Record<string, number>)["bebida-eleccion"] = 7;
    guardado.contadores.premiosNormales.scon = 2;

    const normalizado = normalizarEstado(guardado);

    expect(normalizado.contadores.premiosNormales).not.toHaveProperty("bebida-eleccion");
    expect(normalizado.contadores.premiosNormales.scon).toBe(2);
  });

  it("no se rompe si el estado guardado es null/undefined", () => {
    expect(normalizarEstado(null)).toEqual(estadoInicial());
    expect(normalizarEstado(undefined)).toEqual(estadoInicial());
  });

  it("descarta un forzado que apunte a un premio mayor inexistente", () => {
    const guardado = estadoInicial();
    // @ts-expect-error simula un id de premio mayor viejo/invalido
    guardado.forzado = "premio-que-ya-no-existe";

    const normalizado = normalizarEstado(guardado);
    expect(normalizado.forzado).toBeNull();
  });

  it("conserva un forzado válido", () => {
    const guardado = estadoInicial();
    guardado.forzado = "brunch";

    const normalizado = normalizarEstado(guardado);
    expect(normalizado.forzado).toBe("brunch");
  });
});
