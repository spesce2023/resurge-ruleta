"use client";

import { useEffect, useState } from "react";
import type { Config } from "@/lib/ruleta/types";

function commitValue(raw: string): number {
  const n = raw === "" ? 0 : Number(raw);
  const safe = Number.isNaN(n) ? 0 : n;
  return Math.min(100, Math.max(0, safe));
}

export function ProbabilidadesCard({
  config,
  onChange,
}: {
  config: Config;
  onChange: (config: Partial<Config>) => void;
}) {
  // El valor mostrado se maneja como texto local mientras se edita, en vez
  // de reflejar directamente `config` (que ahora viene del servidor de
  // forma asíncrona): si cada tecla disparara una request, una respuesta
  // vieja podría llegar después de una más nueva y pisar lo que se acaba
  // de tipear (por eso costaba borrar el 0 inicial). Se sincroniza desde
  // el servidor solo cuando el campo no está siendo editado, y se guarda
  // al salir del campo.
  const [mayorText, setMayorText] = useState(String(config.probabilidadPremioMayor));
  const [normalText, setNormalText] = useState(String(config.probabilidadPremioNormal));
  const [editandoMayor, setEditandoMayor] = useState(false);
  const [editandoNormal, setEditandoNormal] = useState(false);

  useEffect(() => {
    if (!editandoMayor) setMayorText(String(config.probabilidadPremioMayor));
  }, [config.probabilidadPremioMayor, editandoMayor]);

  useEffect(() => {
    if (!editandoNormal) setNormalText(String(config.probabilidadPremioNormal));
  }, [config.probabilidadPremioNormal, editandoNormal]);

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") e.currentTarget.blur();
  }

  return (
    <div className="flex flex-col rounded-[10px] border border-border bg-card p-4">
      <h3 className="font-serif text-base font-semibold text-olive">Probabilidades</h3>

      <label className="mt-4 block text-[12px] font-semibold text-olive">Premio mayor (%)</label>
      <input
        type="number"
        min={0}
        max={100}
        value={mayorText}
        onFocus={() => setEditandoMayor(true)}
        onChange={(e) => setMayorText(e.target.value)}
        onKeyDown={handleEnter}
        onBlur={() => {
          setEditandoMayor(false);
          onChange({ probabilidadPremioMayor: commitValue(mayorText) });
        }}
        className="mt-1 w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm text-olive outline-none focus:border-sage"
      />

      <label className="mt-3 block text-[12px] font-semibold text-olive">Premio normal (%)</label>
      <input
        type="number"
        min={0}
        max={100}
        value={normalText}
        onFocus={() => setEditandoNormal(true)}
        onChange={(e) => setNormalText(e.target.value)}
        onKeyDown={handleEnter}
        onBlur={() => {
          setEditandoNormal(false);
          onChange({ probabilidadPremioNormal: commitValue(normalText) });
        }}
        className="mt-1 w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm text-olive outline-none focus:border-sage"
      />

      <p className="mt-3 text-[11.5px] text-secondary">
        Los cambios aplican solo a los próximos giros.
      </p>
    </div>
  );
}
