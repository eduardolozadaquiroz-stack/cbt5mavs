/**
 * GET /api/admin/audit-log   — Log de auditoría (admin)
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const [, err] = await requireRole("admin");
  if (err) return err;

  const { searchParams } = request.nextUrl;
  const page  = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "25", 10));
  const tabla = searchParams.get("tabla") ?? "";
  const from  = (page - 1) * limit;
  const to    = from + limit - 1;

  const admin = createSupabaseAdminClient();
  let query = admin
    .from("audit_log")
    .select(`
      id, accion, tabla, registro_id, datos_anteriores, datos_nuevos, created_at,
      usuario:usuarios(nombre, correo:email, rol)
    `, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (tabla) query = query.eq("tabla", tabla);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: "Error al obtener audit log" }, { status: 500 });

  return NextResponse.json({ logs: data ?? [], total: count ?? 0, page, limit });
}
