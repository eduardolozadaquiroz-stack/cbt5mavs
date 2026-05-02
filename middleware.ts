import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// ── Rutas que requieren sesión activa ────────────────────────────────────────
const PROTECTED_DASHBOARD   = /^\/dashboard\//;
const PROTECTED_API_PADRES  = /^\/api\/padres\//;

// ── APIs que requieren JWT en cualquier método (red de seguridad) ─────────────
// Estas rutas NUNCA deben ser accesibles sin sesión válida.
const PROTECTED_API_ALWAYS = [
  /^\/api\/admin\//,          // todo el panel de admin
  /^\/api\/calificaciones/,   // datos académicos sensibles
  /^\/api\/asistencias/,      // datos académicos sensibles
  /^\/api\/perfil/,           // datos personales
  /^\/api\/horarios/,         // datos académicos
  /^\/api\/grupos/,           // datos académicos
  /^\/api\/storage\/upload/,  // subida de archivos
  /^\/api\/auth\/logout/,     // logout requiere sesión
  /^\/api\/auth\/reset-password/, // cambio de contraseña
];

// ── APIs públicas explícitas (allowlist) ─────────────────────────────────────
// Solo estas rutas de API son accesibles sin JWT.
const PUBLIC_API_PATHS = [
  /^\/api\/auth\/login$/,
  /^\/api\/auth\/forgot-password$/,
  /^\/api\/auth\/verify-email/,
  /^\/api\/avisos(\?|$)/,           // GET avisos es público
  /^\/api\/admin\/config(\?|$)/,    // GET config del sitio es público
  /^\/api\/admin\/admision-config/, // GET admision config es público
];

// ── Rutas de API que solo GET es público (POST/PATCH/DELETE requieren JWT) ───
const ADMIN_WRITE_APIS = ["/api/admin/config", "/api/admin/admision-config"];

// ── Cabeceras de seguridad OWASP ─────────────────────────────────────────────
// El nonce se inyecta dinámicamente en buildSecurityHeaders().
function buildSecurityHeaders(nonce: string): Record<string, string> {
  return {
    // A05 – Security Misconfiguration: cabeceras estándar
    "X-Frame-Options":        "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy":        "strict-origin-when-cross-origin",
    "X-XSS-Protection":       "0",   // moderno: deshabilitado (lo maneja CSP)
    "Permissions-Policy":     "camera=(), microphone=(), geolocation=(), payment=()",
    // A02 – Cryptographic Failures: forzar HTTPS
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    // A03 – Injection: Content Security Policy con nonce (sin unsafe-inline para scripts)
    "Content-Security-Policy": [
      "default-src 'self'",
      // Nonce por request — elimina la necesidad de 'unsafe-inline' en scripts
      // Next.js SSR hydration usa el nonce inyectado en el layout
      `script-src 'self' 'nonce-${nonce}'`,
      // Los estilos de Tailwind/Next.js aún requieren unsafe-inline (no hay nonce para CSS)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      // Solo conexiones a Supabase y mismo origen
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-src https://www.google.com https://maps.google.com",
      "frame-ancestors 'none'",     // bloquea clickjacking
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  };
}

function applySecurityHeaders(response: NextResponse, nonce: string): NextResponse {
  const headers = buildSecurityHeaders(nonce);
  Object.entries(headers).forEach(([key, value]) =>
    response.headers.set(key, value)
  );
  // Exponer el nonce al layout de Next.js mediante un header de respuesta.
  // El layout lo lee para inyectarlo en <script nonce="..."> tags.
  response.headers.set("x-nonce", nonce);
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // ── Generar nonce criptográfico por request (OWASP A03 – CSP sin unsafe-inline) ──
  // crypto.randomUUID() está disponible en el Edge Runtime de Next.js
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // ── Crear respuesta mutable para manejar refresco de cookies de sesión ──────
  let response = NextResponse.next({ request });

  // ── Construir cliente Supabase SSR (lee/escribe cookies de sesión) ───────────
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Propagar cookies al request primero
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Recrear respuesta con request actualizado
          response = NextResponse.next({ request });
          // Aplicar cookies a la respuesta
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // ── Validar sesión con el servidor de Supabase (no solo decodifica JWT local)
  // getUser() valida el token contra Supabase Auth → previene JWT falsos
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── 1. Proteger rutas /dashboard/* ───────────────────────────────────────────
  if (PROTECTED_DASHBOARD.test(pathname) && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    const redirectResponse = NextResponse.redirect(loginUrl);
    return applySecurityHeaders(redirectResponse, nonce);
  }

  // ── 2. Proteger API /api/padres/* ────────────────────────────────────────────
  if (PROTECTED_API_PADRES.test(pathname) && !user) {
    return applySecurityHeaders(
      NextResponse.json({ error: "No autorizado" }, { status: 401 }),
      nonce
    );
  }

  // ── 3. Red de seguridad: APIs siempre protegidas ─────────────────────────────
  //    Independientemente de que cada handler tenga su requireAuth(),
  //    el middleware rechaza aquí antes de ejecutar el handler (defensa en profundidad).
  const isAlwaysProtected = PROTECTED_API_ALWAYS.some((re) => re.test(pathname));
  if (isAlwaysProtected && !user) {
    return applySecurityHeaders(
      NextResponse.json({ error: "No autorizado" }, { status: 401 }),
      nonce
    );
  }

  // ── 4. Proteger escrituras en APIs de administración ─────────────────────────
  //    GET es público (navbar, secciones públicas); solo POST/PATCH/DELETE requieren JWT
  const isAdminWriteApi = ADMIN_WRITE_APIS.some((p) =>
    pathname.startsWith(p)
  );
  if (isAdminWriteApi && method !== "GET" && !user) {
    return applySecurityHeaders(
      NextResponse.json({ error: "No autorizado" }, { status: 401 }),
      nonce
    );
  }

  // ── Aplicar cabeceras de seguridad a toda respuesta ──────────────────────────
  return applySecurityHeaders(response, nonce);
}

export const config = {
  matcher: [
    /*
     * Aplica a todas las rutas excepto archivos estáticos de Next.js.
     * Excluimos: _next/static, _next/image, favicon.ico, archivos en /public
     */
    "/((?!_next/static|_next/image|favicon\\.ico|icons/|images/|logo\\.png|.*\\.svg).*)",
  ],
};
