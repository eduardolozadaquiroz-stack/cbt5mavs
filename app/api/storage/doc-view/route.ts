/**
 * GET /api/storage/doc-view?url=<encoded_url>
 * Genera una signed URL temporal (1 hora) para documentos del bucket privado
 * y redirige al usuario. Requiere rol admin o alumno.
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole } from "@/lib/auth";


// Extrae el path dentro del bucket desde una URL de Supabase Storage
// Soporta formato público: .../object/public/<bucket>/<path>
// Soporta formato signed:  .../object/sign/<bucket>/<path>?token=...
function extractPath(url: string, bucket: string): string | null {
  const pattern = new RegExp(
    `/object/(?:public|sign)/${bucket}/([^?]+)`
  );
  const match = url.match(pattern);
  return match ? decodeURIComponent(match[1]) : null;
}

// A10 – SSRF / Open Redirect: solo permitir URLs del propio proyecto Supabase.
function isAllowedStorageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const supabaseHost = new URL(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://invalid.supabase.co"
    ).hostname;
    return (
      parsed.hostname === supabaseHost &&
      parsed.pathname.includes("/storage/v1/object/")
    );
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const [, err] = await requireRole("admin", "alumno");
  if (err) return err;

  const { searchParams } = new URL(req.url);
  const rawUrl = searchParams.get("url");
  if (!rawUrl) {
    return NextResponse.json({ error: "Parámetro 'url' requerido" }, { status: 400 });
  }

  // A10 – Open Redirect: rechazar URLs que no sean del storage de este proyecto
  if (!isAllowedStorageUrl(rawUrl)) {
    return NextResponse.json({ error: "URL no permitida" }, { status: 400 });
  }

  const bucket = "documentos";
  const path = extractPath(rawUrl, bucket);

  if (!path) {
    // URL válida de Supabase pero en bucket distinto — redirigir sin re-signing
    return NextResponse.redirect(rawUrl);
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.storage
    .from(bucket)
    .createSignedUrl(path, 3600); // 1 hora

  if (error || !data?.signedUrl) {
    return NextResponse.json(
      { error: "No se pudo generar URL firmada", detail: error?.message },
      { status: 500 }
    );
  }

  return NextResponse.redirect(data.signedUrl);
}
