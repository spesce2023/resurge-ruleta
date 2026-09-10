"use client";

import { useState } from "react";
import { intentarLogin } from "@/lib/ruleta/admin-auth";

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (intentarLogin(usuario, password)) {
      setError(null);
      onSuccess();
    } else {
      setError("Usuario o contraseña incorrectos.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[340px] rounded-[14px] border border-border bg-card p-6 shadow-sm"
      >
        <h1 className="font-serif text-xl font-semibold text-olive">Panel Re·Surge</h1>
        <p className="mt-1 text-[12.5px] text-secondary">Acceso solo para el staff.</p>

        <label className="mt-5 block text-[12px] font-semibold text-olive">Usuario</label>
        <input
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          autoComplete="username"
          className="mt-1 w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm text-olive outline-none focus:border-sage"
        />

        <label className="mt-3 block text-[12px] font-semibold text-olive">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm text-olive outline-none focus:border-sage"
        />

        {error && <p className="mt-3 text-[12.5px] font-semibold text-danger">{error}</p>}

        <button
          type="submit"
          className="mt-5 w-full rounded-lg bg-sage-dark py-2.5 text-sm font-semibold text-cream"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
