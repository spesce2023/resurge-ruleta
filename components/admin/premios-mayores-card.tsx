"use client";

import { useState } from "react";
import { PREMIOS_MAYORES } from "@/lib/ruleta/constants";
import type { EstadoPremioMayor, PremioMayorId } from "@/lib/ruleta/types";
import { ConfirmModal } from "./confirm-modal";

const BADGE_ESTILOS: Record<EstadoPremioMayor, string> = {
  disponible: "bg-sage-bg text-sage-dark",
  pendiente: "bg-terracotta-bg text-terracotta",
  entregado: "bg-border text-secondary",
};

const BADGE_LABELS: Record<EstadoPremioMayor, string> = {
  disponible: "Disponible",
  pendiente: "Pendiente entrega",
  entregado: "Entregado",
};

export function PremiosMayoresCard({
  premiosMayores,
  forzado,
  onForzar,
  onCancelarForzado,
  onConfirmar,
  onRevertir,
}: {
  premiosMayores: Record<PremioMayorId, EstadoPremioMayor>;
  forzado: PremioMayorId | null;
  onForzar: (id: PremioMayorId) => void;
  onCancelarForzado: () => void;
  onConfirmar: (id: PremioMayorId) => void;
  onRevertir: (id: PremioMayorId) => void;
}) {
  const [confirmando, setConfirmando] = useState<PremioMayorId | null>(null);

  return (
    <section>
      <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-secondary">
        Premios mayores
      </h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {PREMIOS_MAYORES.map((premio) => {
          const estado = premiosMayores[premio.id];
          const esForzado = forzado === premio.id;

          return (
            <div key={premio.id} className="flex flex-col rounded-[10px] border border-border bg-card p-4">
              <h3 className="font-serif text-base font-semibold text-olive">{premio.nombre}</h3>
              <span
                className={`mt-2 inline-block w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${BADGE_ESTILOS[estado]}`}
              >
                {BADGE_LABELS[estado]}
              </span>

              {esForzado && (
                <p className="mt-2 text-[11.5px] font-semibold text-terracotta">
                  Forzado para el próximo giro
                </p>
              )}

              <div className="mt-4 flex flex-1 items-end gap-2">
                {estado === "disponible" && !esForzado && (
                  <button
                    type="button"
                    onClick={() => onForzar(premio.id)}
                    className="w-full rounded-lg bg-sage-dark py-2 text-[12.5px] font-semibold text-cream"
                  >
                    Forzar
                  </button>
                )}
                {estado === "disponible" && esForzado && (
                  <button
                    type="button"
                    onClick={onCancelarForzado}
                    className="w-full rounded-lg border border-border py-2 text-[12.5px] font-semibold text-olive"
                  >
                    Cancelar forzado
                  </button>
                )}
                {estado === "pendiente" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setConfirmando(premio.id)}
                      className="w-full rounded-lg bg-terracotta py-2 text-[12.5px] font-semibold text-white"
                    >
                      Confirmar
                    </button>
                    <button
                      type="button"
                      onClick={() => onRevertir(premio.id)}
                      className="w-full rounded-lg border border-border py-2 text-[12.5px] font-semibold text-olive"
                    >
                      Revertir
                    </button>
                  </>
                )}
                {estado === "entregado" && (
                  <button
                    type="button"
                    disabled
                    className="w-full rounded-lg bg-border py-2 text-[12.5px] font-semibold text-secondary"
                  >
                    Bloqueado
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {confirmando && (
        <ConfirmModal
          title="Confirmar entrega"
          description={`¿Confirmás que ya se entregó "${PREMIOS_MAYORES.find((p) => p.id === confirmando)?.nombre}"? Esta acción no se puede deshacer.`}
          confirmLabel="Confirmar entrega"
          onConfirm={() => {
            onConfirmar(confirmando);
            setConfirmando(null);
          }}
          onCancel={() => setConfirmando(null)}
        />
      )}
    </section>
  );
}
