"use client";

import { ADMIN_CREDENCIALES } from "./constants";

const SESSION_KEY = "resurge-ruleta-admin-session";

export function intentarLogin(usuario: string, password: string): boolean {
  const ok = usuario === ADMIN_CREDENCIALES.usuario && password === ADMIN_CREDENCIALES.password;
  if (ok && typeof window !== "undefined") {
    window.sessionStorage.setItem(SESSION_KEY, "1");
  }
  return ok;
}

export function sesionActiva(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(SESSION_KEY) === "1";
}

export function cerrarSesion() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(SESSION_KEY);
}
