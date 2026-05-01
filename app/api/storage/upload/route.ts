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
import { randomUUID } from "crypto";

// Configuración de buckets permitidos y sus restricciones
const BUCKET_CONFIG: Record<
  string,
  { maxBytes: number; allowedMimes: string[]; roles: string[] }
> = {
  avatars: {
    maxBytes: 2 * 1024 * 1024, // 2 MB
    allowedMimes: ["image/jpeg", "image/png", "image/webp"],
    roles: ["admin", "maestro", "alumno", "padres"],
  },
  documentos: {
    maxBytes: 10 * 1024 * 1024, // 10 MB
    allowedMimes: ["application/pdf", "image/jpeg", "image/png"],
    roles: ["admin"],
  },
  avisos: {
    maxBytes: 5 * 1024 * 1024, // 5 MB
    allowedMimes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    roles: ["admin", "maestro"],
  },
  site: {
    maxBytes: 5 * 1024 * 1024, // 5 MB
    allowedMimes: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
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
    return NextResponse.json({ error: "Sin permisos para este bucket" }, { status: 403 });
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
  const path = `${user.db_id}/${randomUUID()}.${ext}`;

  const bytes = await file.arrayBuffer();
  const admin = createSupabaseAdminClient();

  const { error: uploadError } = await admin.storage
    .from(bucket)
    .upload(path, bytes, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: "Error al subir el archivo" }, { status: 500 });
  }

  const { data: urlData } = admin.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({ ok: true, url: urlData.publicUrl, path });
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
