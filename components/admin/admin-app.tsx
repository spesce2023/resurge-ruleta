"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/brand";
import { useRuleta } from "@/lib/ruleta/use-ruleta";
import { cerrarSesion, sesionActiva } from "@/lib/ruleta/admin-auth";
import { LoginForm } from "./login-form";
import { PremiosMayoresCard } from "./premios-mayores-card";
import { ContadoresCard } from "./contadores-card";
import { ProbabilidadesCard } from "./probabilidades-card";
import { ResetCard } from "./reset-card";

export function AdminApp() {
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const { state, listo, forzar, cancelarForzado, confirmar, revertir, cambiarConfig, resetear } =
    useRuleta();

  useEffect(() => {
    setAutenticado(sesionActiva());
  }, []);

  if (autenticado === null) return null;

  if (!autenticado) {
    return <LoginForm onSuccess={() => setAutenticado(true)} />;
  }

  return (
    <div className="min-h-screen bg-cream pb-16">
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3.5 md:px-6">
        <div className="flex items-center gap-2">
          <BrandMark size={18} wordmarkSize="text-sm" />
          <span className="text-sm text-secondary">· admin</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            prefetch={false}
            className="rounded-lg border border-border px-3 py-1.5 text-[12.5px] font-semibold text-olive"
          >
            Volver a la ruleta
          </Link>
          <button
            type="button"
            onClick={() => {
              cerrarSesion();
              setAutenticado(false);
            }}
            className="rounded-lg px-3 py-1.5 text-[12.5px] text-secondary"
          >
            Salir
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1100px] space-y-6 px-4 py-5 md:px-6 md:py-6">
        {!listo || !state ? (
          <p className="text-sm text-secondary">Cargando…</p>
        ) : (
          <>
            <PremiosMayoresCard
              premiosMayores={state.premiosMayores}
              forzado={state.forzado}
              onForzar={forzar}
              onCancelarForzado={cancelarForzado}
              onConfirmar={confirmar}
              onRevertir={revertir}
            />

            <ContadoresCard contadores={state.contadores} premiosMayores={state.premiosMayores} />

            <section>
              <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-secondary">
                Configuración
              </h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <ProbabilidadesCard config={state.config} onChange={cambiarConfig} />
                <ResetCard premiosMayores={state.premiosMayores} onReset={resetear} />
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
