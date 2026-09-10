"use client";

import type { Config } from "@/lib/ruleta/types";

export function ProbabilidadesCard({
  config,
  onChange,
}: {
  config: Config;
  onChange: (config: Partial<Config>) => void;
}) {
  function handleNumberChange(field: keyof Config, raw: string) {
    if (raw === "") {
      onChange({ [field]: 0 } as Partial<Config>);
      return;
    }
    const n = Number(raw);
    if (Number.isNaN(n)) return;
    onChange({ [field]: n } as Partial<Config>);
  }

  return (
    <div className="flex flex-col rounded-[10px] border border-border bg-card p-4">
      <h3 className="font-serif text-base font-semibold text-olive">Probabilidades</h3>

      <label className="mt-4 block text-[12px] font-semibold text-olive">Premio mayor (%)</label>
      <input
        type="number"
        min={0}
        max={100}
        value={config.probabilidadPremioMayor}
        onChange={(e) => handleNumberChange("probabilidadPremioMayor", e.target.value)}
        className="mt-1 w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm text-olive outline-none focus:border-sage"
      />

      <label className="mt-3 block text-[12px] font-semibold text-olive">Premio normal (%)</label>
      <input
        type="number"
        min={0}
        max={100}
        value={config.probabilidadPremioNormal}
        onChange={(e) => handleNumberChange("probabilidadPremioNormal", e.target.value)}
        className="mt-1 w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm text-olive outline-none focus:border-sage"
      />

      <p className="mt-3 text-[11.5px] text-secondary">
        Los cambios aplican solo a los próximos giros.
      </p>
    </div>
  );
}
