/**
 * GET /api/materias  — Lista materias (filtrable por carrera_id, semestre, activa)
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/auth";

function isUUID(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

export async function GET(request: NextRequest) {
  const [, err] = await requireAuth();
  if (err) return err;

  const { searchParams } = request.nextUrl;
  const carrera_id = searchParams.get("carrera_id") ?? "";
  const semestre   = searchParams.get("semestre") ?? "";

  const admin = createSupabaseAdminClient();

  let query = admin
    .from("materias")
    .select("id, nombre, clave, semestre, creditos, horas_semanales, tipo, carrera_id")
    .eq("activa", true)
    .order("semestre")
    .order("nombre");

  if (carrera_id && isUUID(carrera_id)) query = query.eq("carrera_id", carrera_id);
  if (semestre) {
    const s = parseInt(semestre, 10);
    if (!isNaN(s)) query = query.eq("semestre", s);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Error al obtener materias" }, { status: 500 });

  return NextResponse.json({ materias: data ?? [] });
}
