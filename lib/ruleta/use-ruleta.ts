"use client";

import { useCallback, useEffect, useState } from "react";
import {
  actualizarConfig,
  aplicarResultado,
  cancelarForzado,
  confirmarEntrega,
  determinarResultado,
  forzarPremio,
  revertirADisponible,
} from "./engine";
import { cargarEstado, estadoInicial, guardarEstado } from "./storage";
import type { Config, PremioMayorId, ResultadoGiro, RuletaState } from "./types";

export function useRuleta() {
  const [state, setState] = useState<RuletaState | null>(null);

  useEffect(() => {
    setState(cargarEstado());
  }, []);

  useEffect(() => {
    if (state) guardarEstado(state);
  }, [state]);

  // Se determina y persiste el resultado en el mismo momento del giro, antes de que
  // termine la animación (caso borde 7.4): si la tablet se apaga a mitad de la
  // animación, el giro ya quedó registrado y no se pierde ni se puede repetir.
  const girar = useCallback((): ResultadoGiro | null => {
    if (!state) return null;
    const resultado = determinarResultado(state);
    setState(aplicarResultado(state, resultado));
    return resultado;
  }, [state]);

  const forzar = useCallback((premioId: PremioMayorId) => {
    setState((prev) => (prev ? forzarPremio(prev, premioId) : prev));
  }, []);

  const cancelarForzadoActivo = useCallback(() => {
    setState((prev) => (prev ? cancelarForzado(prev) : prev));
  }, []);

  const confirmar = useCallback((premioId: PremioMayorId) => {
    setState((prev) => (prev ? confirmarEntrega(prev, premioId) : prev));
  }, []);

  const revertir = useCallback((premioId: PremioMayorId) => {
    setState((prev) => (prev ? revertirADisponible(prev, premioId) : prev));
  }, []);

  const cambiarConfig = useCallback((config: Partial<Config>) => {
    setState((prev) => (prev ? actualizarConfig(prev, config) : prev));
  }, []);

  const resetear = useCallback(() => {
    setState(estadoInicial());
  }, []);

  return {
    state,
    listo: state !== null,
    girar,
    forzar,
    cancelarForzado: cancelarForzadoActivo,
    confirmar,
    revertir,
    cambiarConfig,
    resetear,
  };
}
