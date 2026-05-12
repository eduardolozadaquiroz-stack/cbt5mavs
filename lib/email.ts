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
  <title>${title} - CBT Num. 5</title>
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:Segoe UI,Arial,sans-serif;color:#1f2937;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f0f4f8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08);">
          <tr>
            <td style="background:#1a3a6b;padding:32px 40px;text-align:center;">
              <img src="${portalUrl}/logo.png" alt="CBT Num. 5 Chalco" width="72" height="72" style="display:block;margin:0 auto 16px;border-radius:12px;border:3px solid rgba(255,255,255,.25);" />
              <p style="margin:0;color:#bfdbfe;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Centro de Bachillerato Tecnologico</p>
              <h1 style="margin:6px 0 0;color:#ffffff;font-size:24px;line-height:1.2;">CBT Num. 5 - Chalco</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 40px 28px;">
              <h2 style="margin:0 0 10px;color:#1e3a5f;font-size:22px;text-align:center;">${title}</h2>
              <p style="margin:0 0 24px;color:#64748b;font-size:14px;line-height:1.6;text-align:center;">
                ${safeName ? `Hola, ${safeName}.<br />` : ""}${intro}<br />
                Haz clic en el botón para continuar.
              </p>
              <div style="text-align:center;margin:28px 0;">
                <a href="${safeUrl}" style="display:inline-block;background:${accent};color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 34px;border-radius:8px;">
                  ${cta}
                </a>
              </div>
              <p style="margin:24px 0 0;color:#94a3b8;font-size:12px;text-align:center;line-height:1.5;">
                Este enlace expira en <strong>${expiry}</strong>. Si no solicitaste este correo, puedes ignorarlo.
              </p>
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0;" />
              <p style="margin:0;color:#94a3b8;font-size:11px;text-align:center;line-height:1.6;word-break:break-all;">
                Si el botón no funciona, copia y pega este enlace en tu navegador:<br />
                <a href="${safeUrl}" style="color:#1e56ab;text-decoration:none;">${safeUrl}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:22px 40px;text-align:center;">
              <p style="margin:0;color:#475569;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Portal escolar</p>
              <p style="margin:5px 0 0;color:#1e56ab;font-size:12px;">
                <a href="${portalUrl}/login" style="color:#1e56ab;text-decoration:none;">${portalUrl.replace(/^https?:\/\//, "")}/login</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#1a3a6b;padding:18px 40px;text-align:center;">
              <p style="margin:0;color:#93c5fd;font-size:12px;">Este es un correo automático, por favor no respondas a este mensaje.</p>
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
