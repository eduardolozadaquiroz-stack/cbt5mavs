/**
 * POST /api/storage/upload
 * Sube un archivo al bucket de Supabase Storage.
 * Retorna la URL pública del archivo subido.
 *
 * Buckets disponibles:
 *   - avatars        → fotos de perfil de usuarios
 *   - documentos     → documentos de admisión (PDFs, imágenes)
 *   - avisos         → imágenes adjuntas a avisos
 *   - site           → assets del sitio (logo, banners hero)
 *
 * Seguridad:
 * - Requiere autenticación (OWASP A01)
 * - Validación de tipo MIME y tamaño (OWASP A03)
 * - Sanitización del nombre de archivo
 * - No permite path traversal
 */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase-server";

// crypto.randomUUID() está disponible como global en Cloudflare Workers y Node.js 19+

// Configuración de buckets permitidos y sus restricciones
const BUCKET_CONFIG: Record<
  string,
  { maxBytes: number; allowedMimes: string[]; roles: string[] }
> = {
  avatars: {
    maxBytes: 2 * 1024 * 1024,
    allowedMimes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    roles: ["admin", "maestro", "alumno", "padres"],
  },
  documentos: {
    maxBytes: 10 * 1024 * 1024,
    allowedMimes: ["application/pdf", "image/jpeg", "image/jpg", "image/png"],
    roles: ["admin", "alumno", "maestro"], // todos pueden subir documentos
  },
  avisos: {
    maxBytes: 50 * 1024 * 1024,
    allowedMimes: [
      "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif",
      "video/mp4", "video/webm", "video/quicktime", "video/x-msvideo",
      "application/pdf",
    ],
    roles: ["admin", "maestro"],
  },
  site: {
    maxBytes: 5 * 1024 * 1024,
    allowedMimes: ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"],
    roles: ["admin"],
  },
};

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/\.{2,}/g, "_") // previene path traversal
    .slice(0, 120);
}

export async function POST(request: NextRequest) {
  const [user, err] = await requireAuth();
  if (err) return err;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "FormData inválido" }, { status: 400 });
  }

  const bucket = formData.get("bucket") as string | null;
  const file   = formData.get("file") as File | null;

  if (!bucket || !file) {
    return NextResponse.json({ error: "bucket y file son requeridos" }, { status: 400 });
  }

  const config = BUCKET_CONFIG[bucket];
  if (!config) {
    return NextResponse.json({ error: "Bucket no permitido" }, { status: 400 });
  }

  // Verificar que el rol tiene permiso para subir a este bucket
  if (!config.roles.includes(user.rol)) {
    return NextResponse.json(
      { error: "Sin permisos para este bucket", debug_rol: user.rol, debug_bucket: bucket },
      { status: 403 }
    );
  }

  // Validar tipo MIME
  if (!config.allowedMimes.includes(file.type)) {
    return NextResponse.json(
      { error: `Tipo de archivo no permitido. Permitidos: ${config.allowedMimes.join(", ")}` },
      { status: 400 }
    );
  }

  // Validar tamaño
  if (file.size > config.maxBytes) {
    return NextResponse.json(
      { error: `El archivo supera el tamaño máximo de ${config.maxBytes / 1024 / 1024} MB` },
      { status: 400 }
    );
  }

  // Sanitizar nombre y crear path único para evitar colisiones
  const ext = sanitizeFilename(file.name).split(".").pop() ?? "bin";
  const path = `${user.db_id}/${crypto.randomUUID()}.${ext}`;

  const bytes = await file.arrayBuffer();
  const admin = createSupabaseAdminClient();

  const { error: uploadError } = await admin.storage
    .from(bucket)
    .upload(path, bytes, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("[storage/upload] Supabase storage error:", uploadError.message, "status:", (uploadError as {statusCode?: number}).statusCode);
    return NextResponse.json(
      { error: uploadError.message ?? "Error al subir el archivo" },
      { status: 500 }
    );
  }

  // Para buckets privados (documentos) usar signed URL de larga duración.
  // Para buckets públicos (avatars, avisos, site) usar public URL.
  const PUBLIC_BUCKETS = ["avatars", "avisos", "site"];
  let fileUrl: string;
  if (PUBLIC_BUCKETS.includes(bucket)) {
    const { data: urlData } = admin.storage.from(bucket).getPublicUrl(path);
    fileUrl = urlData.publicUrl;
  } else {
    // Signed URL válida por 10 años (315360000 segundos)
    const { data: signed, error: signErr } = await admin.storage
      .from(bucket)
      .createSignedUrl(path, 315360000);
    if (signErr || !signed) {
      return NextResponse.json({ error: "Error al generar URL del archivo" }, { status: 500 });
    }
    fileUrl = signed.signedUrl;
  }

  return NextResponse.json({ ok: true, url: fileUrl, path });
}

/**
 * DELETE /api/storage/upload?path=xxx&bucket=xxx
 * Elimina un archivo del storage (solo admins o el propio dueño).
 */
export async function DELETE(request: NextRequest) {
  const [user, err] = await requireAuth();
  if (err) return err;

  const { searchParams } = request.nextUrl;
  const bucket = searchParams.get("bucket") ?? "";
  const path   = searchParams.get("path") ?? "";

  if (!bucket || !path) {
    return NextResponse.json({ error: "bucket y path requeridos" }, { status: 400 });
  }

  // Verificar que el path pertenece al usuario (o es admin)
  if (user.rol !== "admin" && !path.startsWith(user.db_id + "/")) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin.storage.from(bucket).remove([path]);

  if (error) {
    return NextResponse.json({ error: "Error al eliminar el archivo" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
