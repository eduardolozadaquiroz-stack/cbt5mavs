/**
 * lib/email.ts
 *
 * Envío de correos via Brevo HTTP API v3.
 * Usa fetch() — compatible con Cloudflare Workers (no depende de net/tls).
 *
 * Variables de entorno requeridas:
 *   BREVO_API_KEY  — API key v3 de Brevo (Settings > API Keys, empieza con xkeysib-)
 *   EMAIL_FROM     — Dirección remitente: "CBT Num. 5 <tu@ejemplo.com>"
 *   EMAIL_REPLY_TO — (opcional) Dirección de respuesta
 */

type AuthEmailKind = "welcome" | "password-reset";

type GenerateRecoveryLinkClient = {
  auth: {
    admin: {
      generateLink: (params: {
        type: "recovery";
        email: string;
        options: { redirectTo: string };
      }) => Promise<{
        data: { properties: { action_link: string } | null } | null;
        error: { message?: string } | null;
      }>;
    };
  };
};

type AuthEmailInput = {
  to: string;
  actionUrl: string;
  kind: AuthEmailKind;
  name?: string | null;
};

const DEFAULT_APP_URL = "https://cbt5mavs.pages.dev";

// Validar variables SMTP requeridas
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta configurar variable de entorno: ${name}`);
  }
  return value;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function appUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL ?? DEFAULT_APP_URL).replace(/\/$/, "");
}

function renderAuthEmail({ actionUrl, kind, name }: AuthEmailInput) {
  const isWelcome = kind === "welcome";
  const safeName = name ? escapeHtml(name) : "";
  const safeUrl = escapeHtml(actionUrl);
  const portalUrl = appUrl();
  const title = isWelcome ? "Activa tu cuenta" : "Restablecer contraseña";
  const subject = isWelcome
    ? "Activa tu cuenta del portal CBT Num. 5"
    : "Restablece tu contraseña del portal CBT Num. 5";
  const intro = isWelcome
    ? "Tu cuenta en el portal escolar del CBT Num. 5 ha sido creada."
    : "Recibimos una solicitud para restablecer la contraseña de tu cuenta.";
  const cta = isWelcome ? "Activar mi cuenta" : "Crear nueva contraseña";
  const accent = isWelcome ? "#1e56ab" : "#d97706";
  const expiry = isWelcome ? "24 horas" : "1 hora";

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} - CBT Núm. 5</title>
</head>
<body style="margin:0;padding:0;background:#eef2f8;font-family:'Segoe UI',Arial,sans-serif;color:#1f2937;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#eef2f8;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;max-width:580px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.10);">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(160deg,#0f2a5e 0%,#1e4fa8 100%);padding:40px 48px 32px;text-align:center;">
              <!-- Logo con fondo blanco circular para que no se comprima -->
              <div style="display:inline-block;background:#ffffff;border-radius:50%;width:96px;height:96px;line-height:96px;text-align:center;box-shadow:0 4px 16px rgba(0,0,0,.25);margin-bottom:20px;">
                <img src="${portalUrl}/logo.png" alt="CBT Núm. 5" width="68" height="68"
                  style="display:inline-block;vertical-align:middle;border-radius:50%;object-fit:contain;" />
              </div>
              <p style="margin:0 0 4px;color:#93c5fd;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Dirección General de Educación Tecnológica Industrial</p>
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;line-height:1.3;letter-spacing:0.3px;">Centro de Bachillerato Tecnológico Núm. 5</h1>
              <p style="margin:6px 0 0;color:#bfdbfe;font-size:13px;">Chalco, Estado de México</p>
            </td>
          </tr>

          <!-- BANDA DE ACENTO -->
          <tr>
            <td style="background:${accent};height:4px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- CUERPO -->
          <tr>
            <td style="padding:44px 48px 36px;">
              <!-- Icono de acción -->
              <div style="text-align:center;margin-bottom:24px;">
                <div style="display:inline-block;background:${accent}18;border-radius:50%;width:56px;height:56px;line-height:56px;text-align:center;">
                  <span style="font-size:26px;line-height:56px;display:inline-block;vertical-align:middle;">${isWelcome ? "👋" : "🔒"}</span>
                </div>
              </div>

              <h2 style="margin:0 0 12px;color:#0f2a5e;font-size:24px;font-weight:700;text-align:center;line-height:1.3;">${title}</h2>

              ${safeName ? `<p style="margin:0 0 6px;color:#334155;font-size:15px;text-align:center;font-weight:600;">Hola, ${safeName}.</p>` : ""}

              <p style="margin:0 0 32px;color:#64748b;font-size:14px;line-height:1.75;text-align:center;">
                ${intro}<br/>Haz clic en el botón para continuar.
              </p>

              <!-- Botón CTA -->
              <div style="text-align:center;margin-bottom:32px;">
                <a href="${safeUrl}"
                  style="display:inline-block;background:${accent};color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:16px 42px;border-radius:10px;letter-spacing:0.3px;box-shadow:0 4px 14px ${accent}55;">
                  ${cta}
                </a>
              </div>

              <!-- Aviso de expiración -->
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px 20px;text-align:center;margin-bottom:28px;">
                <p style="margin:0;color:#64748b;font-size:12px;line-height:1.6;">
                  ⏱ Este enlace expira en <strong style="color:#334155;">${expiry}</strong>.
                  Si no solicitaste este correo, puedes ignorarlo con seguridad.
                </p>
              </div>

              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 20px;" />

              <!-- Enlace de respaldo -->
              <p style="margin:0;color:#94a3b8;font-size:11px;text-align:center;line-height:1.7;">
                ¿El botón no funciona? Copia y pega este enlace en tu navegador:<br/>
                <a href="${safeUrl}" style="color:#1e56ab;text-decoration:none;word-break:break-all;">${safeUrl}</a>
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f1f5fb;border-top:1px solid #e2e8f0;padding:24px 48px;text-align:center;">
              <p style="margin:0 0 6px;color:#1e4fa8;font-size:13px;font-weight:700;">Portal Escolar CBT Núm. 5</p>
              <p style="margin:0 0 12px;">
                <a href="${portalUrl}/login" style="color:#1e56ab;font-size:12px;text-decoration:none;">${portalUrl.replace(/^https?:\/\//, "")}/login</a>
              </p>
              <p style="margin:0;color:#94a3b8;font-size:11px;line-height:1.6;">
                Este es un mensaje automático — por favor no respondas a este correo.<br/>
                Chalco, Estado de México · Ciclo escolar 2025–2026
              </p>
            </td>
          </tr>

          <!-- BARRA INFERIOR -->
          <tr>
            <td style="background:linear-gradient(160deg,#0f2a5e 0%,#1e4fa8 100%);padding:14px 48px;text-align:center;">
              <p style="margin:0;color:#93c5fd;font-size:11px;letter-spacing:0.5px;">
                © 2025–2026 Centro de Bachillerato Tecnológico Núm. 5 · Chalco
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `${title}

${safeName ? `Hola, ${name}.\n` : ""}${intro}

Abre este enlace para continuar:
${actionUrl}

El enlace expira en ${expiry}. Si no solicitaste este correo, puedes ignorarlo.`;

  return { subject, html, text };
}

/* ── Brevo HTTP API v3 ─────────────────────────────────────────────────────── */

/**
 * Envía un correo usando la API REST de Brevo.
 * fetch() funciona en Cloudflare Workers; nodemailer (net/tls) NO.
 * Requiere BREVO_API_KEY (API key v3, empieza con xkeysib-). Settings > API Keys en Brevo.
 */
async function sendViaBrevoApi(options: {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}) {
  const apiKey = process.env.BREVO_API_KEY ?? process.env.SMTP_PASS ?? "";
  if (!apiKey) throw new Error("Falta configurar variable de entorno: BREVO_API_KEY");

  // Parsear EMAIL_FROM: "Nombre <email@dominio.com>" → { name, email }
  const fromMatch = options.from.match(/^(.+?)\s*<(.+?)>$/);
  const sender = fromMatch
    ? { name: fromMatch[1].trim(), email: fromMatch[2].trim() }
    : { email: options.from };

  const payload = {
    sender,
    to: [{ email: options.to }],
    subject: options.subject,
    htmlContent: options.html,
    textContent: options.text,
    ...(options.replyTo ? { replyTo: { email: options.replyTo } } : {}),
  };

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Brevo API ${res.status}: ${detail}`);
  }

  const resBody = await res.json().catch(() => ({})) as Record<string, unknown>;
  console.log(`[email] Brevo accepted → to=${options.to} messageId=${resBody.messageId ?? "?"} sender=${sender.email}`);
}

/* ── Exports públicos ───────────────────────────────────────────────────────── */

export async function generatePasswordRecoveryLink(
  admin: GenerateRecoveryLinkClient,
  email: string,
  redirectTo: string
) {
  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo },
  });

  const actionLink = data?.properties?.action_link;
  if (error || !actionLink) {
    throw new Error(error?.message ?? "No se pudo generar el enlace del correo.");
  }

  return actionLink;
}

export async function sendAuthEmail(input: AuthEmailInput) {
  const from = requireEnv("EMAIL_FROM");
  const replyTo = process.env.EMAIL_REPLY_TO ?? "";

  const { subject, html, text } = renderAuthEmail(input);

  try {
    await sendViaBrevoApi({
      from,
      to: input.to,
      subject,
      html,
      text,
      replyTo: replyTo || undefined,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Error enviando correo via Brevo: ${message}`);
  }
}
