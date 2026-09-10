import { NextResponse } from "next/server";
import { writeState } from "@/lib/ruleta/server-store";
import { estadoInicial } from "@/lib/ruleta/storage";

export const dynamic = "force-dynamic";

export async function POST() {
  const next = estadoInicial();
  await writeState(next);
  return NextResponse.json(next);
}
