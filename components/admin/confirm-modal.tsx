"use client";

export function ConfirmModal({
  title,
  description,
  confirmLabel = "Confirmar",
  danger = false,
  onConfirm,
  onCancel,
}: {
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[380px] rounded-[14px] border border-border bg-card p-5 shadow-xl">
        <h2 className="font-serif text-lg font-semibold text-olive">{title}</h2>
        <p className="mt-2 text-[13px] text-secondary">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border px-3.5 py-2 text-[13px] font-semibold text-olive"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-lg px-3.5 py-2 text-[13px] font-semibold text-white ${
              danger ? "bg-terracotta" : "bg-sage-dark"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
