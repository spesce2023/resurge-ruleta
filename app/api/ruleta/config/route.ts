import { NextResponse } from "next/server";
import { readState, writeState } from "@/lib/ruleta/server-store";
import { actualizarConfig } from "@/lib/ruleta/engine";
import type { Config } from "@/lib/ruleta/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<Config> | null;
  if (!body) {
    return NextResponse.json({ error: "body inválido" }, { status: 400 });
  }

  const state = await readState();
  const next = actualizarConfig(state, body);
  await writeState(next);
  return NextResponse.json(next);
}
