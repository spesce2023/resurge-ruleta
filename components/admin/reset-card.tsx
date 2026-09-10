"use client";

import { useState } from "react";
import type { EstadoPremioMayor, PremioMayorId } from "@/lib/ruleta/types";
import { ConfirmModal } from "./confirm-modal";

export function ResetCard({
  premiosMayores,
  onReset,
}: {
  premiosMayores: Record<PremioMayorId, EstadoPremioMayor>;
  onReset: () => void;
}) {
  const [confirmando, setConfirmando] = useState(false);
  const hayPendientes = Object.values(premiosMayores).some((e) => e === "pendiente");

  return (
    <div className="flex flex-col items-center justify-center rounded-[10px] border border-border bg-card p-4 text-center">
      <p className="text-[13px] text-secondary">
        Reinicia contadores y libera
        <br />
        los premios mayores.
      </p>
      <button
        type="button"
        onClick={() => setConfirmando(true)}
        className="mt-3 rounded-lg border border-border px-4 py-2 text-[12.5px] font-semibold text-olive"
      >
        Reiniciar todo
      </button>

      {confirmando && (
        <ConfirmModal
          title="Reiniciar todo"
          description={
            hayPendientes
              ? "Hay premios mayores pendientes de entrega que se perderán del registro. ¿Confirmás el reset?"
              : "Se pondrán en cero todos los contadores y los 3 premios mayores volverán a estar disponibles. ¿Confirmás el reset?"
          }
          confirmLabel="Reiniciar todo"
          danger
          onConfirm={() => {
            onReset();
            setConfirmando(false);
          }}
          onCancel={() => setConfirmando(false)}
        />
      )}
    </div>
  );
}
