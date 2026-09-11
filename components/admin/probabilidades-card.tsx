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
  onChange: (config: Partial<Config>) => void | Promise<void>;
}) {
  // El valor se maneja como texto local y NO se manda al servidor en cada
  // tecla: se guarda recién al tocar "Guardar cambios". Esto permite usar
  // el panel desde otro dispositivo (ej. el celular) mientras se juega en
  // la tablet, sin depender de un blur/click fuera del campo para que el
  // cambio se aplique.
  const [mayorText, setMayorText] = useState(String(config.probabilidadPremioMayor));
  const [normalText, setNormalText] = useState(String(config.probabilidadPremioNormal));
  const [hayCambios, setHayCambios] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  // Se sincroniza desde el servidor (ej. otro dispositivo cambió la config,
  // o se hizo un reset) solo si no hay cambios sin guardar en este campo.
  useEffect(() => {
    if (hayCambios) return;
    setMayorText(String(config.probabilidadPremioMayor));
    setNormalText(String(config.probabilidadPremioNormal));
  }, [config.probabilidadPremioMayor, config.probabilidadPremioNormal, hayCambios]);

  async function handleGuardar() {
    setGuardando(true);
    setGuardado(false);
    await onChange({
      probabilidadPremioMayor: commitValue(mayorText),
      probabilidadPremioNormal: commitValue(normalText),
    });
    setHayCambios(false);
    setGuardando(false);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
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
        onChange={(e) => {
          setMayorText(e.target.value);
          setHayCambios(true);
        }}
        className="mt-1 w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm text-olive outline-none focus:border-sage"
      />

      <label className="mt-3 block text-[12px] font-semibold text-olive">Premio normal (%)</label>
      <input
        type="number"
        min={0}
        max={100}
        value={normalText}
        onChange={(e) => {
          setNormalText(e.target.value);
          setHayCambios(true);
        }}
        className="mt-1 w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm text-olive outline-none focus:border-sage"
      />

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handleGuardar}
          disabled={!hayCambios || guardando}
          className="rounded-lg bg-sage-dark px-4 py-2 text-[12.5px] font-semibold text-cream disabled:opacity-50"
        >
          {guardando ? "Guardando…" : "Guardar cambios"}
        </button>
        {guardado && <span className="text-[12px] font-semibold text-sage-dark">Guardado ✓</span>}
      </div>

      <p className="mt-3 text-[11.5px] text-secondary">
        Los cambios aplican solo a los próximos giros.
      </p>
    </div>
  );
}
