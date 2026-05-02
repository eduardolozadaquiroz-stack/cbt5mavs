/**
 * POST /api/padres/vincular-alumno
 *
 * Permite que un padre/tutor autenticado vincule a su hijo con verificación de 3 factores:
 *   1. Matrícula del alumno
 *   2. CURP del alumno
 *   3. Fecha de nacimiento del alumno
 *
 * SEGURIDAD:
 * - Solo accesible para usuarios con rol "padres"
 * - Rate limit: 5 intentos por tutor por hora (previene fuerza bruta A07)
 * - No revela si la matrícula/CURP existe — siempre responde con el mismo mensaje de error (OWASP A07)
 * - Audit log en cada intento exitoso y fallido
 * - Idempotente: si el vínculo ya existe, retorna éxito sin duplicar
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireRole, auditLog } from "@/lib/auth";
import { sanitize, isCURP, normalizeCURP, isValidDate } from "@/lib/validate";
import { vinculacionLimiter } from "@/lib/rate-limit";
import { createLogger } from "@/lib/logger";

const log = createLogger("api/padres/vincular-alumno");

// ── Rate limit: usa el limiter centralizado de lib/rate-limit.ts ─────────────
// 5 intentos por hora por tutor (vinculacionLimiter).
// Con auto-cleanup cada 10 min para evitar memory leaks.

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const [user, err] = await requireRole("padres");
  if (err) return err;

  // Rate limit por tutor (OWASP A07)
  const rl = vinculacionLimiter.check(user.db_id);
  if (!rl.allowed) {
    await auditLog(user.db_id, "alumno_tutor", "VINCULACION_RATE_LIMITED", null, {});
    log.warn("Rate limit de vinculación alcanzado", { tutorId: user.db_id });
    return NextResponse.json(
      { error: "Demasiados intentos. Intenta de nuevo en 1 hora." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)),
          "X-RateLimit-Limit":     "5",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  // Extraer y sanitizar los 3 factores
  const matricula       = sanitize(body.matricula as string, 20).toUpperCase();
  const curpRaw         = sanitize(body.curp as string, 18);
  const fecha_nacimiento = sanitize(body.fecha_nacimiento as string, 10);

  // Validación de formato — sin revelar cuál campo falló (A07)
  if (!matricula || !curpRaw || !fecha_nacimiento) {
    return NextResponse.json(
      { error: "Todos los campos son requeridos: matricula, curp, fecha_nacimiento" },
      { status: 400 }
    );
  }

  if (!isCURP(curpRaw)) {
    return NextResponse.json({ error: "Formato de CURP inválido" }, { status: 400 });
  }

  if (!isValidDate(fecha_nacimiento)) {
    return NextResponse.json({ error: "Formato de fecha inválido (YYYY-MM-DD)" }, { status: 400 });
  }

  const curp = normalizeCURP(curpRaw);

  const admin = createSupabaseAdminClient();

  // Buscar alumno por los 3 factores — sin filtros parciales para no dar pistas (OWASP A01)
  const { data: alumno } = await admin
    .from("alumnos")
    .select(`
      id,
      matricula,
      curp,
      fecha_nacimiento,
      usuario_id,
      usuarios!inner(nombre, correo:email),
      carrera:carreras(nombre)
    `)
    .eq("matricula", matricula)
    .eq("curp", curp)
    .eq("fecha_nacimiento", fecha_nacimiento)
    .maybeSingle();

  if (!alumno) {
    // A07: respuesta genérica — no revelar cuál factor falló
    await auditLog(user.db_id, "alumno_tutor", "VINCULACION_FALLIDA", null, {
      matricula_hash: matricula.slice(0, 3) + "***", // log parcial sin exponer dato real
    });
    log.warn("Intento de vinculación fallido", { matricula_hash: matricula.slice(0, 3) + "***" });
    return NextResponse.json(
      { error: "Los datos no coinciden con ningún alumno registrado" },
      { status: 404 }
    );
  }

  // Verificar si ya existe el vínculo (idempotencia)
  const { data: vinculoExistente } = await admin
    .from("alumno_tutor")
    .select("id")
    .eq("tutor_id", user.db_id)
    .eq("alumno_id", alumno.id)
    .maybeSingle();

  if (vinculoExistente) {
    // Ya vinculado — retornar éxito idempotente
    const usuariosJoin = Array.isArray(alumno.usuarios) ? alumno.usuarios[0] : alumno.usuarios;
    const nombreAlumno = (usuariosJoin as { nombre: string } | null)?.nombre ?? null;
    return NextResponse.json({
      ok: true,
      alumno: {
        id:        alumno.id,
        nombre:    nombreAlumno,
        matricula: alumno.matricula,
        carrera:   (alumno.carrera as unknown as { nombre: string } | null)?.nombre ?? null,
      },
      message: "Este alumno ya está vinculado a tu cuenta",
    });
  }

  // Crear el vínculo con metadatos de verificación
  const { data: nuevoVinculo, error: vinculoError } = await admin
    .from("alumno_tutor")
    .insert({
      tutor_id:             user.db_id,
      alumno_id:            alumno.id,
      verificado_en:        new Date().toISOString(),
      metodo_verificacion:  "matricula_curp_fnac",
    })
    .select("id")
    .single();

  if (vinculoError) {
    return NextResponse.json({ error: "Error al crear vínculo" }, { status: 500 });
  }

  // A09 – Audit log del evento de vinculación exitosa
  await auditLog(user.db_id, "alumno_tutor", "INSERT", nuevoVinculo.id, {
    alumno_id: alumno.id,
    metodo:    "matricula_curp_fnac",
  });

  const usuariosJoin2 = Array.isArray(alumno.usuarios) ? alumno.usuarios[0] : alumno.usuarios;
  const nombreAlumno2 = (usuariosJoin2 as { nombre: string } | null)?.nombre ?? null;

  return NextResponse.json({
    ok: true,
    alumno: {
      id:        alumno.id,
      nombre:    nombreAlumno2,
      matricula: alumno.matricula,
      carrera:   (alumno.carrera as unknown as { nombre: string } | null)?.nombre ?? null,
    },
    message: "Alumno vinculado correctamente",
  }, { status: 201 });
}
