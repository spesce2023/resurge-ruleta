import { NextResponse } from "next/server";
import { readState, writeState } from "@/lib/ruleta/server-store";
import { cancelarForzado } from "@/lib/ruleta/engine";

export const dynamic = "force-dynamic";

export async function POST() {
  const state = await readState();
  const next = cancelarForzado(state);
  await writeState(next);
  return NextResponse.json(next);
}
