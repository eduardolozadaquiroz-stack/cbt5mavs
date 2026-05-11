/**
 * GET /api/admin/reinscripcion/solicitudes
 * Lista todas las solicitudes del ciclo activo con info del alumno.
 * Filtros: ?estado=enviada|aprobada|rechazada|borrador|en_revision
 *          ?search=nombre
 *          ?page=1&limit=20
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole } from "@/lib/auth";

export const runtime = 'edge';

const ESTADOS_VALIDOS = ["borrador","enviada","en_revision","aprobada","rechazada"];

export async function GET(request: NextRequest) {
  const [, err] = await requireRole("admin");
  if (err) return err;

  const { searchParams } = request.nextUrl;
  const estado  = searchParams.get("estado") ?? "";
  const search  = searchParams.get("search") ?? "";
  const page    = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit   = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));

  const admin = createSupabaseAdminClient();

  // Obtener ciclo activo — misma fuente que el alumno usa al crear solicitud
  const { data: cicloActivo } = await admin.from("ciclos_escolares").select("nombre").eq("activo", true).maybeSingle();
  const { data: cfg } = await admin.from("site_config").select("config").eq("id", 1).single();
  const reinCfg = (cfg?.config as Record<string, unknown>)?.reinscripcion as Record<string, unknown> | undefined;
  const cicloEscolar: string = cicloActivo?.nombre ?? (reinCfg?.cicloEscolar as string | undefined) ?? "";

  let query = admin
    .from("reinscripcion_solicitudes")
    .select(`
      id, estado, notas_admin, ciclo_escolar, created_at, updated_at,
      alumnos (
        matricula, semestre_actual,
        usuarios ( nombre, apellido_paterno, apellido_materno, email ),
        carreras ( nombre, clave )
      ),
      reinscripcion_documentos ( id, nombre, estado )
    `, { count: "exact" })
    .eq("ciclo_escolar", cicloEscolar)
    .order("updated_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (estado && ESTADOS_VALIDOS.includes(estado)) {
    query = query.eq("estado", estado);
  }

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: "Error al obtener solicitudes" }, { status: 500 });

  // Filtro por nombre (post-query si search)
  let solicitudes = data ?? [];
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    solicitudes = solicitudes.filter((s) => {
      const alumno = s.alumnos as unknown as Record<string, unknown> | null;
      const u = alumno?.usuarios as Record<string, unknown> | null;
      const fullName = [u?.apellido_paterno, u?.apellido_materno, u?.nombre].filter(Boolean).join(" ").toLowerCase();
      return fullName.includes(q);
    });
  }

  return NextResponse.json({
    solicitudes,
    total: count ?? 0,
    page,
    limit,
    cicloEscolar,
  });
}
