/**
 * POST /api/auth/logout
 * Cierra la sesión invalidando el JWT en Supabase y eliminando la cookie de sesión.
 */
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = 'edge';

export async function POST() {
  const supabase = await createSupabaseServerClient();

  // Invalida la sesión en Supabase (revoca el refresh token)
  await supabase.auth.signOut();

  return NextResponse.json({ ok: true });
}
