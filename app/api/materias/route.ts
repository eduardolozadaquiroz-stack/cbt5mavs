/**
 * /api/materias  — CRUD de materias
 * GET    — Lista materias (filtrable por carrera_id, semestre, incluir_inactivas)
 * POST   — Crea materia (admin)
 * PATCH  — Actualiza materia (admin)
 * DELETE — Desactiva materia ?id=UUID (admin)
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireAuth, requireRole } from "@/lib/auth";
import { isUUID } from "@/lib/validate";


export async function GET(request: NextRequest) {
  const [, err] = await requireAuth();
  if (err) return err;

  const { searchParams } = request.nextUrl;
  const carrera_id        = searchParams.get("carrera_id") ?? "";
  const semestre          = searchParams.get("semestre") ?? "";
  const incluir_inactivas = searchParams.get("incluir_inactivas") === "true";

  const admin = createSupabaseAdminClient();

  let query = admin
    .from("materias")
    .select("id, nombre, clave, semestre, creditos, horas_semanales, tipo, carrera_id, descripcion, activa")
    .order("semestre")
    .order("nombre");

  if (!incluir_inactivas) query = query.eq("activa", true);
  if (carrera_id && isUUID(carrera_id)) query = query.eq("carrera_id", carrera_id);
  if (semestre) {
    const s = parseInt(semestre, 10);
    if (!isNaN(s)) query = query.eq("semestre", s);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Error al obtener materias" }, { status: 500 });

  return NextResponse.json({ materias: data ?? [] });
}

export async function POST(request: NextRequest) {
  const [, err] = await requireRole("admin");
  if (err) return err;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }

  const { nombre, clave, semestre, creditos, horas_semanales, tipo, carrera_id, descripcion } = body as Record<string, unknown>;

  if (!nombre || typeof nombre !== "string" || !nombre.trim()) {
    return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
  }
  if (!clave || typeof clave !== "string" || !clave.trim()) {
    return NextResponse.json({ error: "La clave es obligatoria" }, { status: 400 });
  }
  const semestreNum = parseInt(String(semestre ?? ""), 10);
  if (!semestre || isNaN(semestreNum) || semestreNum < 1 || semestreNum > 6) {
    return NextResponse.json({ error: "Semestre debe ser entre 1 y 6" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("materias")
    .insert({
      nombre:          nombre.trim(),
      clave:           (clave as string).trim().toUpperCase(),
      semestre:        semestreNum,
      creditos:        creditos ? parseInt(String(creditos), 10) : 5,
      horas_semanales: horas_semanales ? parseInt(String(horas_semanales), 10) : 4,
      tipo:            tipo ?? "tronco_comun",
      carrera_id:      carrera_id && isUUID(String(carrera_id)) ? carrera_id : null,
      descripcion:     descripcion ? String(descripcion).trim() : null,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "Ya existe una materia con esa clave" }, { status: 409 });
    return NextResponse.json({ error: "Error al crear materia" }, { status: 500 });
  }

  return NextResponse.json({ materia: data }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const [, err] = await requireRole("admin");
  if (err) return err;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }

  const { id, ...fields } = body;
  if (!id || !isUUID(String(id))) return NextResponse.json({ error: "id inválido" }, { status: 400 });

  const ALLOWED = ["nombre", "clave", "semestre", "creditos", "horas_semanales", "tipo", "carrera_id", "descripcion", "activa"];
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of ALLOWED) {
    if (fields[key] !== undefined) update[key] = fields[key];
  }
  if (update["clave"] && typeof update["clave"] === "string") {
    update["clave"] = (update["clave"] as string).trim().toUpperCase();
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("materias")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "Ya existe una materia con esa clave" }, { status: 409 });
    return NextResponse.json({ error: "Error al actualizar materia" }, { status: 500 });
  }

  return NextResponse.json({ materia: data });
}

export async function DELETE(request: NextRequest) {
  const [, err] = await requireRole("admin");
  if (err) return err;

  const id = request.nextUrl.searchParams.get("id") ?? "";
  if (!isUUID(id)) return NextResponse.json({ error: "id inválido" }, { status: 400 });

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("materias")
    .update({ activa: false, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: "Error al desactivar materia" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
