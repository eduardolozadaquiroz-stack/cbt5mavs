/**
 * lib/email.ts
 *
 * Envío de correos via Gmail API (OAuth2 + fetch).
 * Compatible con Cloudflare Pages edge runtime (no usa node:tls ni nodemailer).
 *
 * Variables de entorno requeridas:
 *   GMAIL_CLIENT_ID      — OAuth2 Client ID de Google Cloud Console
 *   GMAIL_CLIENT_SECRET  — OAuth2 Client Secret
 *   GMAIL_REFRESH_TOKEN  — Refresh token (obtenido una vez con OAuth Playground)
 *   EMAIL_FROM           — Dirección remitente: "CBT Num. 5 <tu@gmail.com>"
 *   EMAIL_REPLY_TO       — (opcional) Dirección de respuesta
 *
 * Cómo obtener el refresh token:
 *   1. Crear credenciales OAuth2 en https://console.cloud.google.com
 *      (tipo "Aplicación web", redirect URI: https://developers.google.com/oauthplayground)
 *   2. Ir a https://developers.google.com/oauthplayground
 *   3. Configurar el ícono de engranaje → "Use your own OAuth credentials"
 *   4. Autorizar el scope: https://www.googleapis.com/auth/gmail.send
 *   5. Copiar el refresh_token generado
 *   6. Subir los 3 valores como secrets:
 *      wrangler pages secret put GMAIL_CLIENT_ID --project-name cbt5mavs
 *      wrangler pages secret put GMAIL_CLIENT_SECRET --project-name cbt5mavs
 *      wrangler pages secret put GMAIL_REFRESH_TOKEN --project-name cbt5mavs
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
    : "Restablece tu contrasena del portal CBT Num. 5";
  const intro = isWelcome
    ? "Tu cuenta en el portal escolar del CBT Num. 5 ha sido creada."
    : "Recibimos una solicitud para restablecer la contrasena de tu cuenta.";
  const cta = isWelcome ? "Activar mi cuenta" : "Crear nueva contrasena";
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
                Haz clic en el boton para continuar.
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
                Si el boton no funciona, copia y pega este enlace en tu navegador:<br />
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
              <p style="margin:0;color:#93c5fd;font-size:12px;">Este es un correo automatico, por favor no respondas a este mensaje.</p>
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

/* ── Gmail API helpers ──────────────────────────────────────────────────────── */

async function getAccessToken(): Promise<string> {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

  if (!clientId) throw new Error("Falta configurar GMAIL_CLIENT_ID.");
  if (!clientSecret) throw new Error("Falta configurar GMAIL_CLIENT_SECRET.");
  if (!refreshToken) throw new Error("Falta configurar GMAIL_REFRESH_TOKEN.");

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    throw new Error(`Error al obtener access token de Google: ${detail}`);
  }

  const data = await res.json() as { access_token?: string };
  if (!data.access_token) throw new Error("Google no devolvió access_token.");
  return data.access_token;
}

/**
 * Codifica un string en base64url (RFC 4648) usando la Web Crypto API
 * disponible en todos los runtimes edge.
 */
function toBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function buildMimeMessage(
  input: AuthEmailInput & { subject: string; html: string; text: string }
): string {
  const boundary = `cbt-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const from = process.env.EMAIL_FROM ?? "";
  const replyTo = process.env.EMAIL_REPLY_TO ?? "";

  const headers = [
    `From: ${from}`,
    `To: ${input.to}`,
    `Subject: ${input.subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
  ];
  if (replyTo) headers.push(`Reply-To: ${replyTo}`);

  const mime = [
    ...headers,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    input.text,
    "",
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    input.html,
    "",
    `--${boundary}--`,
    "",
  ].join("\r\n");

  return toBase64Url(mime);
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
  const from = process.env.EMAIL_FROM;
  if (!from) throw new Error("Falta configurar EMAIL_FROM.");

  const { subject, html, text } = renderAuthEmail(input);
  const raw = buildMimeMessage({ ...input, subject, html, text });
  const accessToken = await getAccessToken();

  const res = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/send",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw }),
    }
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    throw new Error(`Gmail API respondió con error ${res.status}: ${detail}`);
  }
}

 *
 * Variables de entorno requeridas:
 *   RESEND_API_KEY  — API key de Resend (wrangler pages secret put RESEND_API_KEY)
 *   EMAIL_FROM      — Dirección remitente: "CBT Num. 5 <noreply@tudominio.com>"
 *                     El dominio debe estar verificado en Resend.
 *   EMAIL_REPLY_TO  — (opcional) Dirección de respuesta
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
    : "Restablece tu contrasena del portal CBT Num. 5";
  const intro = isWelcome
    ? "Tu cuenta en el portal escolar del CBT Num. 5 ha sido creada."
    : "Recibimos una solicitud para restablecer la contrasena de tu cuenta.";
  const cta = isWelcome ? "Activar mi cuenta" : "Crear nueva contrasena";
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
                Haz clic en el boton para continuar.
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
                Si el boton no funciona, copia y pega este enlace en tu navegador:<br />
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
              <p style="margin:0;color:#93c5fd;font-size:12px;">Este es un correo automatico, por favor no respondas a este mensaje.</p>
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
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Falta configurar RESEND_API_KEY.");

  const from = process.env.EMAIL_FROM;
  if (!from) throw new Error("Falta configurar EMAIL_FROM.");

  const { subject, html, text } = renderAuthEmail(input);

  const body: Record<string, unknown> = {
    from,
    to: [input.to],
    subject,
    html,
    text,
  };

  const replyTo = process.env.EMAIL_REPLY_TO;
  if (replyTo) body.reply_to = replyTo;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    throw new Error(`Resend respondió con error ${res.status}: ${detail}`);
  }
}


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

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  replyTo?: string;
};

const DEFAULT_APP_URL = "https://cbt5mavs.pages.dev";

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
    : "Restablece tu contrasena del portal CBT Num. 5";
  const intro = isWelcome
    ? "Tu cuenta en el portal escolar del CBT Num. 5 ha sido creada."
    : "Recibimos una solicitud para restablecer la contrasena de tu cuenta.";
  const cta = isWelcome ? "Activar mi cuenta" : "Crear nueva contrasena";
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
                Haz clic en el boton para continuar.
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
                Si el boton no funciona, copia y pega este enlace en tu navegador:<br />
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
              <p style="margin:0;color:#93c5fd;font-size:12px;">Este es un correo automatico, por favor no respondas a este mensaje.</p>
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

function header(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function dotStuff(value: string) {
  return value.replace(/\r?\n/g, "\r\n").replace(/^\./gm, "..");
}

function buildMimeMessage(input: AuthEmailInput & { subject: string; html: string; text: string }, config: SmtpConfig) {
  const boundary = `cbt-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const headers = [
    `From: ${header(config.from)}`,
    `To: ${header(input.to)}`,
    `Subject: ${header(input.subject)}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
  ];

  if (config.replyTo) headers.push(`Reply-To: ${header(config.replyTo)}`);

  return [
    ...headers,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    input.text,
    "",
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    input.html,
    "",
    `--${boundary}--`,
    "",
  ].join("\r\n");
}

function getSmtpConfig(): SmtpConfig {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || "465");
  const user = process.env.SMTP_USER || process.env.GMAIL_SMTP_USER || "";
  const pass = process.env.SMTP_PASS || process.env.GMAIL_SMTP_PASS || "";
  const from = process.env.EMAIL_FROM || (user ? `CBT Num. 5 Chalco <${user}>` : "");

  if (!user) throw new Error("Falta configurar SMTP_USER.");
  if (!pass) throw new Error("Falta configurar SMTP_PASS.");
  if (!from) throw new Error("Falta configurar EMAIL_FROM.");

  return {
    host,
    port,
    secure: (process.env.SMTP_SECURE ?? (port === 465 ? "true" : "false")) === "true",
    user,
    pass,
    from,
    replyTo: process.env.EMAIL_REPLY_TO || undefined,
  };
}

async function sendWithNodeTls(config: SmtpConfig, to: string, message: string) {
  if (!config.secure) {
    throw new Error("En desarrollo local usa SMTP_PORT=465 y SMTP_SECURE=true para Gmail.");
  }

  const tls = await import("node:tls");

  const socket: any = tls.connect({ host: config.host, port: config.port, servername: config.host });

  const decoder = new TextDecoder();
  let buffer = "";

  await new Promise<void>((resolve, reject) => {
    socket.once("connect", resolve);
    socket.once("secureConnect", resolve);
    socket.once("error", reject);
  });

  const readLine = () => new Promise<string>((resolve, reject) => {
    const done = () => {
      const index = buffer.indexOf("\n");
      if (index >= 0) {
        const line = buffer.slice(0, index + 1).replace(/\r?\n$/, "");
        buffer = buffer.slice(index + 1);
        cleanup();
        resolve(line);
      }
    };
    const onData = (chunk: Uint8Array) => {
      buffer += decoder.decode(chunk, { stream: true });
      done();
    };
    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };
    const cleanup = () => {
      socket.off("data", onData);
      socket.off("error", onError);
    };
    socket.on("data", onData);
    socket.on("error", onError);
    done();
  });

  const readResponse = async () => {
    let code = 0;
    for (;;) {
      const line = await readLine();
      const match = /^(\d{3})([\s-])/.exec(line);
      if (!match) continue;
      code = Number(match[1]);
      if (match[2] === " ") break;
    }
    if (code >= 400) throw new Error(`SMTP respondió con error ${code}.`);
  };

  const writeLine = (line: string) => socket.write(`${line}\r\n`);
  const writeData = (data: string) => socket.write(data);

  try {
    await readResponse();
    writeLine(`EHLO ${config.host}`);
    await readResponse();

    const auth = Buffer.from(`\u0000${config.user}\u0000${config.pass}`, "utf8").toString("base64");
    writeLine(`AUTH PLAIN ${auth}`);
    await readResponse();
    writeLine(`MAIL FROM:<${config.user}>`);
    await readResponse();
    writeLine(`RCPT TO:<${to}>`);
    await readResponse();
    writeLine("DATA");
    await readResponse();
    writeData(`${dotStuff(message)}\r\n.\r\n`);
    await readResponse();
    writeLine("QUIT");
  } finally {
    socket.end();
  }
}

async function sendSmtpEmail(to: string, message: string) {
  const config = getSmtpConfig();
  await sendWithNodeTls(config, to, message);
}

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
  const { subject, html, text } = renderAuthEmail(input);
  const config = getSmtpConfig();
  const message = buildMimeMessage({ ...input, subject, html, text }, config);
  await sendSmtpEmail(input.to, message);
}
