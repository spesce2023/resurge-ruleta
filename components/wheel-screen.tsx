"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/brand";
import { Wheel } from "./wheel";
import { useRuleta } from "@/lib/ruleta/use-ruleta";
import {
  ICON_CYCLE_MS,
  ICON_REVEAL_MS,
  ICONO_VACIO,
  ICONOS_PREMIOS_MAYORES,
  ICONOS_PREMIOS_NORMALES,
  PREMIOS_MAYORES,
  PREMIOS_NORMALES,
  RESULT_DISPLAY_MS,
  SLICE_ANGLE,
  SPIN_DURATION_MS,
  SPIN_EXTRA_TURNS,
  TODOS_LOS_ICONOS,
} from "@/lib/ruleta/constants";
import type { ResultadoGiro } from "@/lib/ruleta/types";

type Fase = "idle" | "girando" | "icono" | "texto";

function nombrePremio(resultado: ResultadoGiro): string {
  if (resultado.tipo === "mayor") {
    return PREMIOS_MAYORES.find((p) => p.id === resultado.premioId)?.nombre ?? "";
  }
  if (resultado.tipo === "normal") {
    return PREMIOS_NORMALES.find((p) => p.id === resultado.premioId)?.nombre ?? "";
  }
  return "";
}

function iconoResultado(resultado: ResultadoGiro): string {
  if (resultado.tipo === "mayor") return ICONOS_PREMIOS_MAYORES[resultado.premioId];
  if (resultado.tipo === "normal") return ICONOS_PREMIOS_NORMALES[resultado.premioId];
  return ICONO_VACIO;
}

function computeNextRotation(prevRotation: number, targetIndex: number) {
  const targetCenterAngle = targetIndex * SLICE_ANGLE + SLICE_ANGLE / 2;
  const currentMod = ((prevRotation % 360) + 360) % 360;
  const desiredMod = ((360 - targetCenterAngle) % 360 + 360) % 360;
  const delta = ((desiredMod - currentMod) % 360 + 360) % 360;
  return prevRotation + SPIN_EXTRA_TURNS * 360 + delta;
}

export function WheelScreen() {
  const { listo, girar } = useRuleta();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [fase, setFase] = useState<Fase>("idle");
  const [resultado, setResultado] = useState<ResultadoGiro | null>(null);
  const [error, setError] = useState(false);
  const [cycleIcon, setCycleIcon] = useState(TODOS_LOS_ICONOS[0]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const limpiarTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  // Mientras gira, la zona de resultado hace un efecto tipo "tragamonedas":
  // los íconos van cambiando rápido hasta que la rueda se detiene.
  useEffect(() => {
    if (fase !== "girando") return;
    const id = setInterval(() => {
      setCycleIcon(TODOS_LOS_ICONOS[Math.floor(Math.random() * TODOS_LOS_ICONOS.length)]);
    }, ICON_CYCLE_MS);
    return () => clearInterval(id);
  }, [fase]);

  const handleGirar = useCallback(async () => {
    if (spinning || !listo) return;

    limpiarTimeouts();
    setResultado(null);
    setError(false);
    // Se bloquea el botón ANTES de esperar la respuesta del servidor, no
    // después, para evitar doble giro si alguien toca de nuevo mientras
    // se resuelve la conexión (caso borde 7.5).
    setSpinning(true);
    setFase("girando");

    const result = await girar();
    if (!result) {
      setSpinning(false);
      setFase("idle");
      setError(true);
      return;
    }

    setRotation((prev) => computeNextRotation(prev, result.casilleroIndex));

    // Secuencia al detenerse: 1) se revela el ícono del premio ganador solo,
    // 2) recién después aparece la frase "¡Ganaste! ..." / "¡Seguí participando!".
    const t1 = setTimeout(() => {
      setResultado(result);
      setFase("icono");
    }, SPIN_DURATION_MS);

    const t2 = setTimeout(() => {
      setFase("texto");
    }, SPIN_DURATION_MS + ICON_REVEAL_MS);

    const t3 = setTimeout(() => {
      setResultado(null);
      setFase("idle");
      setSpinning(false);
    }, SPIN_DURATION_MS + ICON_REVEAL_MS + RESULT_DISPLAY_MS);

    timeoutsRef.current = [t1, t2, t3];
  }, [spinning, listo, girar, limpiarTimeouts]);

  return (
    <div className="flex min-h-screen flex-col items-center bg-cream px-4 py-6 landscape:py-4">
      <header className="flex flex-col items-center gap-1 text-center landscape:flex-row landscape:gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary">
          Cafetería
        </span>
        <BrandMark size={32} wordmarkSize="text-4xl" />
      </header>

      <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 landscape:mx-auto landscape:max-w-6xl landscape:flex-row landscape:justify-around landscape:gap-6">
        <div className="relative flex flex-col items-center">
          <div className="relative aspect-square w-[clamp(300px,85vw,640px)] landscape:w-[clamp(280px,42vw,560px)]">
            <Wheel rotation={rotation} spinning={spinning} />
            <div className="pointer-events-none absolute left-1/2 top-[-6px] -translate-x-1/2 border-x-[10px] border-t-[16px] border-x-transparent border-t-olive" />
          </div>
          <button
            type="button"
            onClick={handleGirar}
            disabled={spinning || !listo}
            className="-mt-10 flex h-28 w-28 items-center justify-center rounded-full bg-sage-dark font-serif text-2xl font-semibold text-cream shadow-lg transition-transform active:scale-95 disabled:opacity-60"
          >
            Girar
          </button>
        </div>

        <div className="flex min-h-[160px] max-w-[480px] flex-1 flex-col items-center justify-center text-center">
          {error ? (
            <>
              <p className="font-serif text-4xl font-semibold text-olive">Uy, algo falló</p>
              <p className="mt-2 text-lg text-secondary">Probá girar de nuevo en un momento.</p>
            </>
          ) : fase === "girando" ? (
            <span className="text-[7rem] leading-none" aria-hidden="true">
              {cycleIcon}
            </span>
          ) : fase === "icono" && resultado ? (
            <span className="text-[7rem] leading-none" aria-hidden="true">
              {iconoResultado(resultado)}
            </span>
          ) : fase === "texto" && resultado ? (
            resultado.tipo === "vacio" ? (
              <>
                <p className="font-serif text-4xl font-semibold text-olive">¡Seguí participando!</p>
                <p className="mt-2 text-lg text-secondary">La próxima puede ser la tuya.</p>
              </>
            ) : (
              <>
                <p className="text-lg font-bold uppercase tracking-wide text-terracotta">¡Ganaste!</p>
                <p className="mt-2 font-serif text-5xl font-semibold text-olive">{nombrePremio(resultado)}</p>
              </>
            )
          ) : (
            <>
              <p className="font-serif text-4xl font-semibold text-olive">Probá tu suerte</p>
              <p className="mt-2 text-lg text-secondary">Tocá el botón y descubrí tu premio</p>
            </>
          )}
        </div>
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
