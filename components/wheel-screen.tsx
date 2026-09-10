"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/brand";
import { Wheel } from "./wheel";
import { useRuleta } from "@/lib/ruleta/use-ruleta";
import {
  PREMIOS_MAYORES,
  PREMIOS_NORMALES,
  RESULT_DISPLAY_MS,
  SLICE_ANGLE,
  SPIN_DURATION_MS,
  SPIN_EXTRA_TURNS,
} from "@/lib/ruleta/constants";
import type { ResultadoGiro } from "@/lib/ruleta/types";

function nombrePremio(resultado: ResultadoGiro): string {
  if (resultado.tipo === "mayor") {
    return PREMIOS_MAYORES.find((p) => p.id === resultado.premioId)?.nombre ?? "";
  }
  if (resultado.tipo === "normal") {
    return PREMIOS_NORMALES.find((p) => p.id === resultado.premioId)?.nombre ?? "";
  }
  return "";
}

function computeNextRotation(prevRotation: number, targetIndex: number) {
  const targetCenterAngle = targetIndex * SLICE_ANGLE + SLICE_ANGLE / 2;
  const currentMod = ((prevRotation % 360) + 360) % 360;
  const desiredMod = ((360 - targetCenterAngle) % 360 + 360) % 360;
  const delta = ((desiredMod - currentMod) % 360 + 360) % 360;
  return prevRotation + SPIN_EXTRA_TURNS * 360 + delta;
}

export function WheelScreen() {
  const { state, listo, girar } = useRuleta();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [resultado, setResultado] = useState<ResultadoGiro | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const limpiarTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const handleGirar = useCallback(() => {
    if (spinning || !listo) return;
    const result = girar();
    if (!result) return;

    limpiarTimeouts();
    setResultado(null);
    setSpinning(true);
    setRotation((prev) => computeNextRotation(prev, result.casilleroIndex));

    const t1 = setTimeout(() => {
      setResultado(result);
    }, SPIN_DURATION_MS);

    const t2 = setTimeout(() => {
      setResultado(null);
      setSpinning(false);
    }, SPIN_DURATION_MS + RESULT_DISPLAY_MS);

    timeoutsRef.current = [t1, t2];
  }, [spinning, listo, girar, limpiarTimeouts]);

  return (
    <div className="flex min-h-screen flex-col items-center bg-cream px-4 py-8">
      <header className="flex flex-col items-center gap-1 text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary">
          Cafetería
        </span>
        <BrandMark size={30} wordmarkSize="text-3xl" />
      </header>

      <div className="relative mt-8 flex flex-col items-center">
        <Wheel rotation={rotation} spinning={spinning} estadoPremiosMayores={state?.premiosMayores} size={440} />
        <div className="pointer-events-none absolute left-1/2 top-[-6px] -translate-x-1/2 border-x-[10px] border-t-[16px] border-x-transparent border-t-olive" />
        <button
          type="button"
          onClick={handleGirar}
          disabled={spinning || !listo}
          className="-mt-9 flex h-24 w-24 items-center justify-center rounded-full bg-sage-dark font-serif text-xl font-semibold text-cream shadow-lg transition-transform active:scale-95 disabled:opacity-60"
        >
          Girar
        </button>
      </div>

      <div className="mt-10 min-h-[100px] max-w-[420px] text-center">
        {resultado ? (
          resultado.tipo === "vacio" ? (
            <>
              <p className="font-serif text-2xl font-semibold text-olive">¡Seguí participando!</p>
              <p className="mt-1 text-sm text-secondary">La próxima puede ser la tuya.</p>
            </>
          ) : (
            <>
              <p className="text-sm font-bold uppercase tracking-wide text-terracotta">¡Ganaste!</p>
              <p className="mt-1 font-serif text-3xl font-semibold text-olive">{nombrePremio(resultado)}</p>
            </>
          )
        ) : (
          <>
            <p className="font-serif text-2xl font-semibold text-olive">Probá tu suerte</p>
            <p className="mt-1 text-sm text-secondary">Tocá el botón y descubrí tu premio</p>
          </>
        )}
      </div>

      <Link
        href="/admin"
        prefetch={false}
        className="fixed bottom-2 right-2 rounded-md px-2 py-1 text-[10px] text-secondary opacity-30 transition-opacity hover:opacity-100"
      >
        admin
      </Link>
    </div>
  );
}
