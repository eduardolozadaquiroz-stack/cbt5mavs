import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";

export async function GET() {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("carreras")
    .select("id, nombre, clave")
    .order("nombre");

  if (error) return NextResponse.json({ error: "Error al obtener carreras" }, { status: 500 });
  return NextResponse.json({ carreras: data ?? [] });
}
