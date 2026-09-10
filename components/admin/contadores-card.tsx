import { PREMIOS_NORMALES } from "@/lib/ruleta/constants";
import type { Contadores, EstadoPremioMayor, PremioMayorId } from "@/lib/ruleta/types";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[10px] border border-border bg-card p-3.5 text-center">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-secondary">{label}</div>
      <div className="mt-1 font-serif text-2xl font-semibold text-olive">{value}</div>
    </div>
  );
}

export function ContadoresCard({
  contadores,
  premiosMayores,
}: {
  contadores: Contadores;
  premiosMayores: Record<PremioMayorId, EstadoPremioMayor>;
}) {
  const totalNormales = Object.values(contadores.premiosNormales).reduce((a, b) => a + b, 0);
  const totalMayores = Object.values(premiosMayores).filter((e) => e === "entregado").length;

  return (
    <section>
      <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-secondary">
        Contadores
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Giros totales" value={contadores.girosTotales} />
        <StatCard label="Premios normales" value={totalNormales} />
        <StatCard label="Premios mayores" value={totalMayores} />
        <StatCard label="Vacíos" value={contadores.vacios} />
      </div>

      <div className="mt-3 rounded-[10px] border border-border bg-card p-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-secondary">
          Desglose de premios normales
        </h3>
        <ul className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
          {PREMIOS_NORMALES.map((premio) => (
            <li key={premio.id} className="flex items-center justify-between text-[13px] text-olive">
              <span>{premio.nombre}</span>
              <span className="font-semibold">{contadores.premiosNormales[premio.id]}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
