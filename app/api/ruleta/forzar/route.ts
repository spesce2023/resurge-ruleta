import { NextResponse } from "next/server";
import { readState, writeState } from "@/lib/ruleta/server-store";
import { forzarPremio } from "@/lib/ruleta/engine";
import { PREMIOS_MAYORES } from "@/lib/ruleta/constants";
import type { PremioMayorId } from "@/lib/ruleta/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { premioId?: string } | null;
  const premioId = body?.premioId as PremioMayorId | undefined;

  if (!premioId || !PREMIOS_MAYORES.some((p) => p.id === premioId)) {
    return NextResponse.json({ error: "premioId inválido" }, { status: 400 });
  }

  const state = await readState();
  const next = forzarPremio(state, premioId);
  await writeState(next);
  return NextResponse.json(next);
}
