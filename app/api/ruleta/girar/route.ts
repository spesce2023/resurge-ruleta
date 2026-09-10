import { NextResponse } from "next/server";
import { readState, writeState } from "@/lib/ruleta/server-store";
import { aplicarResultado, determinarResultado } from "@/lib/ruleta/engine";

export const dynamic = "force-dynamic";

export async function POST() {
  const state = await readState();
  const resultado = determinarResultado(state);
  const next = aplicarResultado(state, resultado);
  await writeState(next);
  return NextResponse.json({ resultado, state: next });
}
