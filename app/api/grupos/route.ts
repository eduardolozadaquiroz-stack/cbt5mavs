/**
 * GET /api/grupos         — Lista grupos (filtrable por carrera, semestre, ciclo)
 * POST /api/grupos        — Crear grupo (admin)
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireAuth, requireRole } from "@/lib/auth";


function sanitize(v: unknown, maxLen = 100): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, maxLen).replace(/[\x00-\x1F\x7F]/g, "");
}
function isUUID(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

export async function GET(request: NextRequest) {
  const [, err] = await requireAuth();
  if (err) return err;

  const { searchParams } = request.nextUrl;
  const carrera_id = searchParams.get("carrera_id") ?? "";
  const ciclo_id   = searchParams.get("ciclo_id") ?? "";
  const semestre   = searchParams.get("semestre") ?? "";
  const id_param   = searchParams.get("id") ?? "";

  const admin = createSupabaseAdminClient();
  let query = admin
    .from("grupos")
    .select(`
      id, nombre, semestre, turno, activo,
      carrera:carreras(id, nombre, clave),
      ciclo:ciclos_escolares(id, nombre, activo),
      _count:alumno_grupo(count)
    `)
    .eq("activo", true)
    .order("semestre")
    .order("nombre");

  if (id_param     && isUUID(id_param))     query = query.eq("id", id_param);
  if (carrera_id   && isUUID(carrera_id))   query = query.eq("carrera_id", carrera_id);
  if (ciclo_id     && isUUID(ciclo_id))     query = query.eq("ciclo_id",   ciclo_id);
  if (semestre)     query = query.eq("semestre", parseInt(semestre, 10));

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Error al obtener grupos" }, { status: 500 });

  return NextResponse.json({ grupos: data ?? [] });
}

export async function POST(request: NextRequest) {
  const [, err] = await requireRole("admin");
  if (err) return err;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const nombre     = sanitize(body.nombre);
  const carrera_id = typeof body.carrera_id === "string" ? body.carrera_id.trim() : "";
  const ciclo_id   = typeof body.ciclo_id === "string" ? body.ciclo_id.trim() : "";
  const semestre   = typeof body.semestre === "number" ? body.semestre : parseInt(String(body.semestre), 10);
  const turno      = sanitize(body.turno ?? "matutino", 20);

  if (!nombre || !isUUID(carrera_id) || !isUUID(ciclo_id) || isNaN(semestre)) {
    return NextResponse.json({ error: "nombre, carrera_id, ciclo_id, semestre son requeridos" }, { status: 400 });
  }
  if (semestre < 1 || semestre > 6) {
    return NextResponse.json({ error: "semestre debe ser entre 1 y 6" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("grupos")
    .insert({ nombre, carrera_id, ciclo_id, semestre, turno })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: "Error al crear grupo" }, { status: 500 });

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
