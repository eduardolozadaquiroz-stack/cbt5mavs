/**
 * GET /api/admin/reportes   — Genera reportes institucionales (admin)
 * Tipos: calificaciones | asistencias | riesgo | admision | metricas
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole } from "@/lib/auth";

export const runtime = 'edge';

function isUUID(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

const TIPOS_VALIDOS = ["calificaciones", "asistencias", "riesgo", "admision", "metricas"];

export async function GET(request: NextRequest) {
  const [, err] = await requireRole("admin");
  if (err) return err;

  const { searchParams } = request.nextUrl;
  const tipo     = searchParams.get("tipo") ?? "";
  const ciclo_id = searchParams.get("ciclo_id") ?? "";
  const grupo_id = searchParams.get("grupo_id") ?? "";

  if (!TIPOS_VALIDOS.includes(tipo)) {
    return NextResponse.json(
      { error: `tipo debe ser uno de: ${TIPOS_VALIDOS.join(", ")}` },
      { status: 400 }
    );
  }

  const admin = createSupabaseAdminClient();

  switch (tipo) {
    case "metricas": {
      const { data, error } = await admin.from("v_metricas_institucionales").select("*").single();
      if (error) return NextResponse.json({ error: "Error al obtener métricas" }, { status: 500 });
      return NextResponse.json({ tipo, data });
    }

    case "calificaciones": {
      let query = admin
        .from("v_boleta_alumno")
        .select("*")
        .order("alumno_nombre");
      if (ciclo_id && isUUID(ciclo_id)) query = query.eq("ciclo_id", ciclo_id);
      if (grupo_id && isUUID(grupo_id)) query = query.eq("grupo_id", grupo_id);
      const { data, error } = await query;
      if (error) return NextResponse.json({ error: "Error al obtener calificaciones" }, { status: 500 });
      return NextResponse.json({ tipo, data: data ?? [] });
    }

    case "asistencias": {
      let query = admin
        .from("v_asistencias_resumen")
        .select("*")
        .order("alumno_nombre");
      if (ciclo_id && isUUID(ciclo_id)) query = query.eq("ciclo_id", ciclo_id);
      if (grupo_id && isUUID(grupo_id)) query = query.eq("grupo_id", grupo_id);
      const { data, error } = await query;
      if (error) return NextResponse.json({ error: "Error al obtener asistencias" }, { status: 500 });
      return NextResponse.json({ tipo, data: data ?? [] });
    }

    case "riesgo": {
      const { data, error } = await admin.rpc("alumnos_en_riesgo_asistencia", {
        p_grupo_id: grupo_id && isUUID(grupo_id) ? grupo_id : null,
      });
      if (error) return NextResponse.json({ error: "Error al obtener alumnos en riesgo" }, { status: 500 });
      return NextResponse.json({ tipo, data: data ?? [] });
    }

    case "admision": {
      const { data, error } = await admin
        .from("admision_solicitudes")
        .select("id, folio, nombre_aspirante, carrera_solicitada, estatus, created_at")
        .order("created_at", { ascending: false });
      if (error) return NextResponse.json({ error: "Error al obtener solicitudes" }, { status: 500 });
      return NextResponse.json({ tipo, data: data ?? [] });
    }

    default:
      return NextResponse.json({ error: "Tipo no implementado" }, { status: 400 });
  }
}
